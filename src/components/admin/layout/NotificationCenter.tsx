"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import apiClient from "@/lib/apiClient";

interface ActivityLog {
  id: string;
  action: string;
  notes: string;
  timestamp: string;
  isRead?: boolean;
  actor: {
    fullName: string;
  };
  application: {
    id: string;
    type: string;
    status: string;
    user: {
      fullName: string;
    };
  };
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount] = useState(0);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/admin/activity/${id}/read`);
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Clear all notifications?")) return;
    try {
      await apiClient.post("/admin/activity/clear");
      setActivities([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/admin/activity/${id}`);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      const activity = activities.find((a) => a.id === id);
      if (activity && !activity.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        aria-label="Open notifications"
      >
        <Bell size={20} />
        {(pendingCount > 0 || unreadCount > 0) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 flex max-h-[75vh] w-[calc(100vw-1rem)] max-w-sm animate-in flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl fade-in slide-in-from-top-2 duration-200 sm:max-h-[32rem] sm:w-96 sm:max-w-none">
          <div className="flex shrink-0 items-center justify-between border-b border-border bg-card p-3 sm:p-4">
            <h3 className="font-bold text-foreground">Notifications</h3>
            <div className="flex items-center gap-2">
              {activities.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg px-2 text-xs font-medium text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground/70"
                  aria-label="Clear all notifications"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
                aria-label="Close notifications"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
            {pendingCount > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-200 dark:border-yellow-900/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={20} />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-400 text-sm">
                      Pending Reviews
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-500">
                      You have {pendingCount} applications waiting for review.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4">
              {unreadCount > 0 && (
                <div className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                  Unread ({unreadCount})
                </div>
              )}

              {isLoading && activities.length === 0 ? (
                <div className="text-center py-4 text-foreground/40 text-sm">Loading...</div>
              ) : activities.length === 0 ? (
                <div className="text-center py-4 text-foreground/40 text-sm">
                  No recent activity.
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer group ${
                        log.isRead
                          ? "border-border bg-card/50"
                          : "border-primary-200 dark:border-primary-900/30 bg-primary-50 dark:bg-primary-900/10"
                      }`}
                      onClick={() => !log.isRead && handleMarkAsRead(log.id)}
                    >
                      <div className="flex items-start gap-3 justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            log.action === "APPROVED"
                              ? "bg-green-500"
                              : log.action === "REJECTED"
                                ? "bg-red-500"
                                : "bg-blue-500"
                          }`} />
                          <div className="space-y-1 flex-1">
                            <p className="text-sm text-foreground/80">
                              <span className="font-medium">{log.actor?.fullName || "System"}</span>{" "}
                              {log.action.toLowerCase().replace("_", " ")}{" "}
                              <span className="font-medium text-foreground">{log.application?.type} App</span>
                            </p>
                            <p className="text-xs text-foreground/50">
                              for {log.application?.user?.fullName} •{" "}
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {log.notes && (
                              <p className="text-xs text-foreground/60 mt-1 italic">&quot;{log.notes}&quot;</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          {!log.isRead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMarkAsRead(log.id); }}
                              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg p-2 text-primary-600 transition-colors hover:bg-primary-100 dark:hover:bg-primary-900/20"
                              aria-label="Mark as read"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(log.id); }}
                            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg p-2 text-foreground/40 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                            aria-label="Delete notification"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {activities.length > 0 && (
            <div className="p-3 bg-card border-t border-border text-center">
              <a
                href="/admin/activity"
                className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                View All Activity
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}