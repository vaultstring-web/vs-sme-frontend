"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Edit,
  AlertCircle,
  Search,
} from "lucide-react";
import { Input, Select } from "@/components/ui/FormELements";

interface AuditLog {
  id: string;
  action: string;
  notes: string;
  timestamp: string;
  actor: {
    fullName: string;
  };
}

interface ApplicationTimelineProps {
  logs: AuditLog[];
}

export default function ApplicationTimeline({
  logs,
}: ApplicationTimelineProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [displayedCount, setDisplayedCount] = useState(10);

  const uniqueActions = useMemo(() => {
    return Array.from(new Set(logs?.map((log) => log.action) || []));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (!logs) return [];

    return logs.filter((log) => {
      const matchesSearch =
        log.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = !actionFilter || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [logs, searchQuery, actionFilter]);

  const displayedLogs = filteredLogs.slice(0, displayedCount);
  const hasMore = displayedCount < filteredLogs.length;

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center p-6 text-slate-500 text-sm">
        No history available.
      </div>
    );
  }

  const getIcon = (action: string) => {
    switch (action) {
      case "APPROVED":
        return <CheckCircle2 className="w-5 h-5 text-white" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-white" />;
      case "SUBMITTED":
        return <FileText className="w-5 h-5 text-white" />;
      case "DATA_EDITED":
        return <Edit className="w-5 h-5 text-white" />;
      default:
        return <Clock className="w-5 h-5 text-white" />;
    }
  };

  const getColor = (action: string) => {
    switch (action) {
      case "APPROVED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      case "SUBMITTED":
        return "bg-blue-500";
      case "DATA_EDITED":
        return "bg-amber-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="space-y-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700">
        <div>
          <label
            htmlFor="audit-search"
            className="text-xs font-medium text-slate-600 dark:text-zinc-400"
          >
            Search
          </label>
          <div className="relative mt-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="audit-search"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayedCount(10); // Reset pagination on search
              }}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="audit-filter"
            className="text-xs font-medium text-slate-600 dark:text-zinc-400"
          >
            Filter by Action
          </label>
          <Select
            id="audit-filter"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setDisplayedCount(10);
            }}
            className="h-8 text-sm mt-1"
          >
            <option value="">All Actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action.replace("_", " ")}
              </option>
            ))}
          </Select>
        </div>

        <p className="text-xs text-slate-500 dark:text-zinc-500">
          Showing {displayedLogs.length} of {filteredLogs.length} entries
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 ml-2 border-l-2 border-border space-y-8 py-2">
        {displayedLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            No logs match your filters.
          </div>
        ) : (
          displayedLogs.map((log) => (
            <div key={log.id} className="relative">
              {/* Dot */}
              <div
                className={`absolute -left-[37px] top-1 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-4 border-card ${getColor(log.action)}`}
              >
                {getIcon(log.action)}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-foreground text-sm">
                    {log.action.replace("_", " ")}
                  </span>
                  <span className="text-xs text-foreground/50 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs font-medium text-foreground/60">
                  by {log.actor?.fullName || "System"}
                </p>

                {log.notes && (
                  <div className="mt-2 p-3 rounded-lg text-sm text-foreground/80 border border-border bg-card/50">
                    {log.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setDisplayedCount((prev) => prev + 10)}
            className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 border border-primary-200 dark:border-primary-800/50 rounded-lg transition-colors"
          >
            Load More ({filteredLogs.length - displayedCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
