'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  ClipboardList,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { Select } from '@/components/ui/FormELements';

interface AuditLog {
  id: string;
  action: string;
  comment?: string;
  timestamp: string;
  actor: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  application?: {
    id: string;
    type: string;
  };
  beforeValue?: Record<string, unknown>;
  afterValue?: Record<string, unknown>;
}

const LogDiff = ({ before, after }: { before?: Record<string, unknown>; after?: Record<string, unknown> }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!before && !after) return null;

  const allKeys = Array.from(new Set([...Object.keys(before || {}), ...Object.keys(after || {})]));

  return (
    <div className="mt-4 border-t border-border/50 pt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-wider"
      >
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isOpen ? 'Hide Changes' : 'Show Data Changes'}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 overflow-hidden rounded-lg border border-border/50 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="grid grid-cols-1 gap-2 bg-slate-100 p-2 text-[10px] font-bold uppercase tracking-tight text-foreground/50 dark:bg-zinc-800 sm:grid-cols-12">
            <div className="sm:col-span-4">Field</div>
            <div className="sm:col-span-4 text-red-600">Before</div>
            <div className="sm:col-span-4 text-green-600">After</div>
          </div>
          <div className="divide-y divide-border/30">
            {allKeys.map(key => (
              <div key={key} className="grid grid-cols-1 gap-2 p-2 text-xs transition-colors hover:bg-white dark:hover:bg-zinc-800 sm:grid-cols-12 sm:items-center">
                <div className="break-words font-medium text-foreground/70 sm:col-span-4" title={key}>{key}</div>
                <div className="break-words italic text-red-600/80 sm:col-span-4" title={String(before?.[key] ?? 'N/A')}>
                  {String(before?.[key] ?? 'N/A')}
                </div>
                <div className="break-words font-bold text-green-600 sm:col-span-4" title={String(after?.[key] ?? 'N/A')}>
                  {String(after?.[key] ?? 'N/A')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [action, setAction] = useState('');

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(action && { action }),
      });

      const response = await apiClient.get(`/admin/audit-logs?${params.toString()}`);
      setLogs(response.data.logs);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, action]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'APPROVED': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'REJECTED': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'STATUS_CHANGE': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-slate-600 bg-slate-50 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-primary-600" />
          Audit Logs
        </h1>
        <p className="text-foreground/60">
          Track all administrative actions and system changes.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bento-card p-4">
        <div className="flex-1">
          <Select 
            value={action} 
            onChange={(e) => setAction(e.target.value)}
            className="w-full"
          >
            <option value="">All Actions</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="STATUS_CHANGE">Status Change</option>
            <option value="DATA_UPDATE">Data Update</option>
          </Select>
        </div>
        <button 
          onClick={() => { setPage(1); fetchLogs(); }}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bento-card p-12 text-center text-foreground/50">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="bento-card p-12 text-center text-foreground/50">
            No audit logs found.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bento-card p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground">{log.actor.fullName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-foreground/60">
                          {log.actor.role.replace('_', ' ')}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${getActionColor(log.action)}`}>
                          {log.action.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 mt-1">
                        {log.comment || 'No additional details provided.'}
                      </p>
                      {log.application && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-primary-600 dark:text-primary-400">
                          <FileText className="h-3 w-3 shrink-0" />
                          <span className="break-all">
                            Application: {log.application.id} ({log.application.type})
                          </span>
                        </div>
                      )}
                      
                      {/* Detailed Data Changes */}
                      {(log.beforeValue || log.afterValue) && (
                        <LogDiff before={log.beforeValue} after={log.afterValue} />
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/60 sm:justify-end">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div className="mt-1 text-xs text-foreground/40">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-4 py-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-border rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="p-2 border border-border rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
