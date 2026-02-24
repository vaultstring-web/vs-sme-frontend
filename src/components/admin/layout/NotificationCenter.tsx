'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface ActivityLog {
  id: string;
  action: string;
  notes: string;
  timestamp: string;
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

  // Fetch pending count and recent activity
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Parallel fetch
      const [statsRes, activityRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/activity')
      ]);

      // Calculate pending (Submitted + Under Review)
      // Assuming statsRes.data.byStatus is array: [{status: 'SUBMITTED', _count: {_all: 5}}, ...]
      const pending = statsRes.data.byStatus
        .filter((s: any) => ['SUBMITTED', 'UNDER_REVIEW'].includes(s.status))
        .reduce((acc: number, s: any) => acc + s._count._all, 0);
      
      setPendingCount(pending);
      setActivities(activityRes.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
      >
        <Bell size={20} />
        {pendingCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-foreground">Notifications</h3>
              <button onClick={() => setIsOpen(false)} className="text-foreground/40 hover:text-foreground/60">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-100 overflow-y-auto custom-scrollbar">
              {/* Pending Reviews Section */}
              {pendingCount > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-200 dark:border-yellow-900/20">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="text-yellow-600 dark:text-yellow-500" size={20} />
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
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-3">
                  Recent Activity
                </h4>
                
                {isLoading && activities.length === 0 ? (
                  <div className="text-center py-4 text-foreground/40 text-sm">Loading...</div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-4 text-foreground/40 text-sm">No recent activity.</div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((log) => (
                      <div key={log.id} className="flex gap-3 items-start">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 
                          ${log.action === 'APPROVED' ? 'bg-green-500' : 
                            log.action === 'REJECTED' ? 'bg-red-500' : 
                            'bg-blue-500'}`} 
                        />
                        <div className="space-y-1">
                          <p className="text-sm text-foreground/80">
                            <span className="font-medium">{log.actor?.fullName || 'System'}</span>
                            {' '}{log.action.toLowerCase().replace('_', ' ')}{' '}
                            <span className="font-medium text-foreground">
                              {log.application?.type} App
                            </span>
                          </p>
                          <p className="text-xs text-foreground/50">
                            for {log.application?.user?.fullName} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 border-t border-border text-center">
              <a href="/admin/activity" className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">
                View All Activity
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
