"use client";

import { useState, useEffect } from "react";
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
  const [pendingCount, setPendingCount] = useState(0);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch pending count and recent activity
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Parallel fetch
      const [statsRes, activityRes] = await Promise.all([
        apiClient.get("/admin/stats"),
        apiClient.get("/admin/activity"),
      ]);

      // Calculate pending (Submitted + Under Review)
      const pending = statsRes.data.byStatus
        .filter((s: any) => ["SUBMITTED", "UNDER_REVIEW"].includes(s.status))
        .reduce((acc: number, s: any) => acc + s._count._all, 0);

      setActivities(activityRes.data.data || []);
      setPendingCount(pending);

      // Count unread notifications
      const unread = (activityRes.data.data || []).filter(
        (a: ActivityLog) => !a.isRead,
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
        aria-label="Open notifications"
      >
        <Bell size={20} />
        {(pendingCount > 0 || unreadCount > 0) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-125 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <h3 className="font-bold text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                {activities.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-foreground/50 hover:text-foreground/70 font-medium transition-colors"
                    aria-label="Clear all notifications"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-foreground/40 hover:text-foreground/60"
                  aria-label="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Pending Reviews Section */}
              {pendingCount > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-200 dark:border-yellow-900/20">
                  <div className="flex items-center gap-3">
                    <AlertCircle
                      className="text-yellow-600 dark:text-yellow-400"
                      size={20}
                    />
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

              {/* Recent Activity Feed */}
              <div className="p-4">
                {unreadCount > 0 && (
                  <div className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                    Unread ({unreadCount})
                  </div>
                )}

                {isLoading && activities.length === 0 ? (
                  <div className="text-center py-4 text-foreground/40 text-sm">
                    Loading...
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-4 text-foreground/40 text-sm">
                    No recent activity.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((log) => (
                      <div
                        key={log.id}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer group
                          ${
                            log.isRead
                              ? "border-border bg-card/50"
                              : "border-primary-200 dark:border-primary-900/30 bg-primary-50 dark:bg-primary-900/10"
                          }`}
                        onClick={() => !log.isRead && handleMarkAsRead(log.id)}
                      >
                        <div className="flex items-start gap-3 justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className={`mt-1 w-2 h-2 rounded-full shrink-0
                              ${
                                log.action === "APPROVED"
                                  ? "bg-green-500"
                                  : log.action === "REJECTED"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                              }`}
                            />
                            <div className="space-y-1 flex-1">
                              <p className="text-sm text-foreground/80">
                                <span className="font-medium">
                                  {log.actor?.fullName || "System"}
                                </span>{" "}
                                {log.action.toLowerCase().replace("_", " ")}{" "}
                                <span className="font-medium text-foreground">
                                  {log.application?.type} App
                                </span>
                              </p>
                              <p className="text-xs text-foreground/50">
                                for {log.application?.user?.fullName} •{" "}
                                {new Date(log.timestamp).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </p>
                              {log.notes && (
                                <p className="text-xs text-foreground/60 mt-1 italic">
                                  "{log.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!log.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(log.id);
                                }}
                                className="p-1 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded transition-colors"
                                aria-label="Mark as read"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(log.id);
                              }}
                              className="p-1 text-foreground/40 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
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
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 border-t border-border text-center">
                <a
                  href="/admin/activity"
                  className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View All Activity
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
