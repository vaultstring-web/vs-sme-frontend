'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Eye,
  AlertTriangle,
  Clock,
  ChevronRight,
  X,
  CalendarClock,
  Bell,
  BellRing,
  Trash2,
  Send,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import ResponsiveTable from '@/components/ui/ResponsiveTable';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Application {
  id: string;
  type: string;
  status: string;
  amount: number;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

interface DueLoan {
  id: string;
  dueDate: string;
  remainingBalance: number;
  totalRepayable: number;
  status: string;
  daysUntilDue: number;
  applicationId?: string;
  user?: {
    fullName: string;
  };
}

interface Reminder {
  id: string;
  message: string;
  scheduledAt: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDaysUntilDue(dueDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Reminders Panel ───────────────────────────────────────────────────────────
function RemindersPanel({ loanId }: { loanId: string }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/loans/applications/${loanId}/reminders`);
      const data = res.data.data ?? res.data;
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  }, [loanId]);

  useEffect(() => { fetchReminders(); }, [fetchReminders]);

  const handleCreate = async () => {
    if (!message.trim() || !scheduledAt) return;
    try {
      setSaving(true);
      await apiClient.post(`/loans/applications/${loanId}/reminders`, {
        message,
        scheduledAt,
      });
      setMessage('');
      setScheduledAt('');
      fetchReminders();
    } catch (err) {
      console.error('Failed to create reminder:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTrigger = async (reminderId: string) => {
    try {
      setTriggeringId(reminderId);
      await apiClient.post(`/loans/reminders/${reminderId}/trigger`);
      fetchReminders();
    } catch (err) {
      console.error('Failed to trigger reminder:', err);
    } finally {
      setTriggeringId(null);
    }
  };

  const handleDelete = async (reminderId: string) => {
    if (!confirm('Delete this reminder?')) return;
    try {
      await apiClient.delete(`/loans/reminders/${reminderId}`);
      fetchReminders();
    } catch (err) {
      console.error('Failed to delete reminder:', err);
    }
  };

  const statusBadge = (status: Reminder['status']) => {
    const map: Record<Reminder['status'], string> = {
      PENDING: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      SENT:    'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      FAILED:  'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    };
    return map[status] ?? map.PENDING;
  };

  return (
    <div className="border-t border-border bg-slate-50/60 dark:bg-zinc-900/40">
      {/* Create form */}
      <div className="px-5 py-3 border-b border-border">
        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-2">
          Schedule reminder
        </p>
        <div className="flex flex-col gap-2">
          <input
            placeholder="Reminder message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-foreground/30 focus:ring-2 focus:ring-primary-500/20 outline-none"
          />
          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
            <button
              onClick={handleCreate}
              disabled={saving || !message.trim() || !scheduledAt}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
            >
              <Plus size={12} />
              {saving ? 'Adding…' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Reminders list */}
      <div className="max-h-36 overflow-y-auto">
        {loading ? (
          <p className="text-xs text-foreground/40 text-center py-4">Loading…</p>
        ) : reminders.length === 0 ? (
          <div className="flex items-center gap-2 px-5 py-3">
            <Bell size={13} className="text-foreground/20" />
            <p className="text-xs text-foreground/40">No reminders scheduled</p>
          </div>
        ) : (
          reminders.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-3 px-5 py-2.5 border-b border-border last:border-0 hover:bg-slate-100/50 dark:hover:bg-zinc-800/30 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground truncate">{r.message}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusBadge(r.status)}`}>
                    {r.status}
                  </span>
                  <span className="text-[10px] text-foreground/40">
                    {new Date(r.scheduledAt).toLocaleString('en-GB', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {r.status === 'PENDING' && (
                  <button
                    onClick={() => handleTrigger(r.id)}
                    disabled={triggeringId === r.id}
                    title="Send now"
                    className="p-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 text-foreground/30 hover:text-primary-600 transition-colors disabled:opacity-40"
                  >
                    {triggeringId === r.id ? (
                      <div className="w-3 h-3 border border-primary-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={12} />
                    )}
                  </button>
                )}
                {r.status === 'SENT' && (
                  <CheckCircle2 size={12} className="text-green-500 mx-1" />
                )}
                <button
                  onClick={() => handleDelete(r.id)}
                  title="Delete"
                  className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-foreground/30 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Loan Due Row ──────────────────────────────────────────────────────────────
function LoanDueRow({
  loan,
  isAdmin,
  expandedReminders,
  onToggleReminders,
}: {
  loan: DueLoan;
  isAdmin: boolean;
  expandedReminders: string | null;
  onToggleReminders: (id: string) => void;
}) {
  const isOverdue = loan.daysUntilDue < 0;
  const isDueToday = loan.daysUntilDue === 0;

  const dueLabelText = isOverdue
    ? `${Math.abs(loan.daysUntilDue)} day${Math.abs(loan.daysUntilDue) !== 1 ? 's' : ''} overdue`
    : isDueToday
    ? 'Due today'
    : `Due in ${loan.daysUntilDue} day${loan.daysUntilDue !== 1 ? 's' : ''}`;

  const dueLabelColor = isOverdue
    ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
    : isDueToday
    ? 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
    : 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';

  const href = isAdmin ? `/admin/loans/${loan.id}` : `/loans/${loan.id}`;
  const isReminderOpen = expandedReminders === loan.id;

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
        <div className="min-w-0 flex-1">
          {isAdmin && loan.user?.fullName && (
            <p className="text-sm font-bold text-foreground truncate">{loan.user.fullName}</p>
          )}
          <p className="text-xs text-foreground/40 font-mono uppercase mt-0.5">
            {loan.id.slice(0, 8)}
          </p>
          <p className="text-sm font-bold text-foreground mt-1">
            MWK {loan.remainingBalance.toLocaleString()}
            <span className="text-[11px] font-normal text-foreground/40 ml-1">remaining</span>
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CalendarClock size={11} className={isOverdue ? 'text-red-400' : 'text-yellow-500'} />
            <span className="text-[11px] text-foreground/50">
              {new Date(loan.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dueLabelColor}`}>
            {dueLabelText}
          </span>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => onToggleReminders(loan.id)}
                title={isReminderOpen ? 'Hide reminders' : 'Manage reminders'}
                className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                  isReminderOpen
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-foreground/40 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {isReminderOpen ? <BellRing size={12} /> : <Bell size={12} />}
                Reminders
              </button>
            )}
            <Link
              href={href}
              className="flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              View <ChevronRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Inline reminders panel */}
      {isAdmin && isReminderOpen && (
        <RemindersPanel loanId={loan.id} />
      )}
    </>
  );
}

// ── Loan Due Alert Modal ──────────────────────────────────────────────────────
export function LoanDueAlertModal({
  loans,
  onClose,
  isAdmin = false,
}: {
  loans: DueLoan[];
  onClose: () => void;
  isAdmin?: boolean;
}) {
  const [expandedReminders, setExpandedReminders] = useState<string | null>(null);

  const overdueLoans = loans.filter((l) => l.daysUntilDue < 0);
  const upcomingLoans = loans.filter((l) => l.daysUntilDue >= 0);

  const handleToggleReminders = (id: string) => {
    setExpandedReminders((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              overdueLoans.length > 0
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-yellow-50 dark:bg-yellow-900/20'
            }`}>
              {overdueLoans.length > 0
                ? <AlertTriangle size={20} className="text-red-500 dark:text-red-400" />
                : <Clock size={20} className="text-yellow-500 dark:text-yellow-400" />
              }
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {overdueLoans.length > 0 ? 'Overdue Loan Alert' : 'Upcoming Loan Due'}
              </h3>
              <p className="text-[11px] text-foreground/40 mt-0.5">
                {loans.length} loan{loans.length !== 1 ? 's' : ''} requiring attention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/30 hover:text-foreground/60 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Loan list */}
        <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
          {overdueLoans.length > 0 && (
            <>
              <div className="px-6 py-2 bg-red-50/50 dark:bg-red-900/10 sticky top-0 z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                  Overdue
                </p>
              </div>
              {overdueLoans.map((loan) => (
                <LoanDueRow
                  key={loan.id}
                  loan={loan}
                  isAdmin={isAdmin}
                  expandedReminders={expandedReminders}
                  onToggleReminders={handleToggleReminders}
                />
              ))}
            </>
          )}

          {upcomingLoans.length > 0 && (
            <>
              <div className="px-6 py-2 bg-yellow-50/50 dark:bg-yellow-900/10 sticky top-0 z-10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                  Due Soon
                </p>
              </div>
              {upcomingLoans.map((loan) => (
                <LoanDueRow
                  key={loan.id}
                  loan={loan}
                  isAdmin={isAdmin}
                  expandedReminders={expandedReminders}
                  onToggleReminders={handleToggleReminders}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-slate-50/50 dark:bg-zinc-900/30 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-sm font-semibold text-foreground/40 hover:text-foreground transition-colors"
          >
            Dismiss
          </button>
          <Link
            href={isAdmin ? '/admin/loans' : '/loans'}
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            View all loans
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminRecentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dueLoans, setDueLoans] = useState<DueLoan[]>([]);
  const [showDueAlert, setShowDueAlert] = useState(false);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        // Correct: apiClient baseURL is http://localhost:3001, routes mounted at /api
        // so path here is just /admin/applications (no /api prefix)
        const response = await apiClient.get(
          '/admin/applications?page=1&pageSize=5&sortBy=createdAt&sortOrder=desc'
        );
        setApplications(response.data.data);
      } catch (error) {
        console.error('Failed to fetch recent applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDueLoans = async () => {
      try {
        // /loans/reminders/upcoming does not exist in the backend.
        // Fetch all active loans and filter client-side for those due within 7 days.
        const response = await apiClient.get('/admin/applications?status=ACTIVE&page=1&pageSize=100');
        const raw: DueLoan[] = response.data.data ?? response.data ?? [];

        const sevenDaysFromNow = 7;
        const alertLoans = raw
          .filter((loan) => loan.dueDate)
          .map((loan) => ({
            ...loan,
            daysUntilDue:
              typeof loan.daysUntilDue === 'number'
                ? loan.daysUntilDue
                : getDaysUntilDue(loan.dueDate),
          }))
          .filter((loan) => loan.daysUntilDue <= sevenDaysFromNow)
          .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

        if (alertLoans.length > 0) {
          setDueLoans(alertLoans);
          setShowDueAlert(true);
        }
      } catch (error) {
        console.error('Failed to fetch due loans:', error);
      }
    };

    fetchRecent();
    fetchDueLoans();
  }, []);

  if (isLoading) {
    return (
      <div className="bento-card p-8 text-center text-foreground/50">
        Loading recent applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bento-card p-8 text-center text-foreground/50">
        No recent applications found.
      </div>
    );
  }

  return (
    <>
      {/* ── Due loan alert modal ── */}
      {showDueAlert && dueLoans.length > 0 && (
        <LoanDueAlertModal
          loans={dueLoans}
          onClose={() => setShowDueAlert(false)}
          isAdmin={true}
        />
      )}

      <div className="bento-card overflow-hidden">
        <ResponsiveTable
          mobileCards={
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="space-y-2 rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{app.user.fullName}</p>
                      <p className="max-w-[220px] truncate text-xs text-foreground/50" title={app.user.email}>
                        {app.user.email}
                      </p>
                    </div>
                    <Link
                      href={`/admin/applications/detail?id=${app.id}`}
                      className="shrink-0 rounded-lg p-2 text-foreground/40 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {app.type === 'SME' ? 'SME Loan' : 'Payroll Loan'}
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                      app.status === 'APPROVED'
                        ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400'
                        : app.status === 'REJECTED'
                          ? 'border-red-200 bg-red-100 text-red-800 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400'
                          : app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
                            ? 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800/50 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {app.status.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          }
          table={
            <table className="hidden w-full min-w-[700px] text-left text-sm md:table">
              <thead className="bg-slate-50 text-xs uppercase text-foreground/50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Applicant</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-foreground/60 sm:whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{app.user.fullName}</div>
                      <div className="max-w-[220px] truncate text-xs text-foreground/50" title={app.user.email}>
                        {app.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground/60">
                      {app.type === 'SME' ? 'SME Loan' : 'Payroll Loan'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                        app.status === 'APPROVED'
                          ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400'
                          : app.status === 'REJECTED'
                            ? 'border-red-200 bg-red-100 text-red-800 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400'
                            : app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
                              ? 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800/50 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {app.status.replace('_', ' ').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left md:text-right">
                      <Link
                        href={`/admin/applications/detail?id=${app.id}`}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/40 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        />

        <div className="px-6 py-4 border-t border-border bg-slate-50 dark:bg-zinc-800/30">
          <Link
            href="/admin/applications"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-center sm:justify-end gap-1"
          >
            View All Applications
          </Link>
        </div>
      </div>
    </>
  );
}