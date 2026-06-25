'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLoans } from '@/hooks/useLoans';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  Calendar, 
  Banknote,
  Receipt,
  User as UserIcon,
  Phone,
  Mail,
  Plus,
  RefreshCcw,
  Shield,
  Package,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import RecordPaymentModal from '@/components/admin/loans/RecordPaymentModal';
import RestructureLoanModal from '@/components/admin/loans/RestructureLoanModal';
import MpambaDisbursementButton from '@/components/admin/loans/MpambaDisbursementButton';
import MpambaRepaymentButton from '@/components/admin/loans/MpambaRepaymentButton';
import ResponsiveTable from '@/components/ui/ResponsiveTable';
import PageHeader from '@/components/ui/PageHeader';
import apiClient from '@/lib/apiClient';

// ── Collateral ────────────────────────────────────────────────────────────────

interface Collateral {
  id: string;
  type: string;
  description: string;
  estimatedValue: number;
  status: string;
  verifiedAt?: string;
  createdAt: string;
}

function CollateralSection({ applicationId }: { applicationId: string }) {
  const [collaterals, setCollaterals] = useState<Collateral[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollateral = useCallback(async () => {
    try {
      setLoading(true);
      // Fixed: added /collateral prefix to match backend route
      const res = await apiClient.get(`/collateral/application/${applicationId}`);
      const data = res.data.data ?? res.data;
      setCollaterals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch collateral:', err);
      setCollaterals([]);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchCollateral();
  }, [fetchCollateral]);

  const getStatusClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'VERIFIED':  return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'RELEASED':  return 'bg-slate-50 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400';
      case 'REJECTED':  return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:          return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'VERIFIED': return <CheckCircle2 size={11} />;
      case 'REJECTED': return <AlertCircle size={11} />;
      default:         return <Clock size={11} />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary-600" />
        Collateral
      </h3>

      {loading ? (
        <div className="bento-card p-8 flex items-center justify-center gap-3 text-foreground/40">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading collateral…</span>
        </div>
      ) : collaterals.length === 0 ? (
        <div className="bento-card p-10 text-center">
          <Package size={32} className="mx-auto text-foreground/10 mb-3" />
          <p className="text-sm font-medium text-foreground/40">No collateral recorded for this loan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collaterals.map((c) => (
            <div key={c.id} className="bento-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{c.type}</p>
                    <p className="text-xs text-foreground/50 mt-0.5 line-clamp-2">{c.description}</p>
                  </div>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(c.status)}`}>
                  {getStatusIcon(c.status)}
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-0.5">Est. Value</p>
                  <p className="text-sm font-bold text-foreground">MWK {c.estimatedValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-0.5">
                    {c.verifiedAt ? 'Verified' : 'Recorded'}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(c.verifiedAt ?? c.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminLoanDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { currentLoan: loan, isLoading, fetchLoanById } = useLoans();
  const { user: currentUser } = useAuth();
  const isAuditor = currentUser?.role === 'AUDITOR';
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRestructureModalOpen, setIsRestructureModalOpen] = useState(false);

  const loadData = useCallback(() => {
    if (id) fetchLoanById(id as string);
  }, [id, fetchLoanById]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Loading loan details...</p>
      </div>
    );
  }

  if (!loan) return null;

  const getScheduleStatusClass = (status: string) => {
    switch (status) {
      case 'PAID':    return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'LATE':    return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'PARTIAL': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      default:        return 'bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        icon={
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 sm:h-10 sm:w-10"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        }
        title="Loan Management"
        subtitle={`ID: ${loan.id}`}
        actions={!isAuditor && loan.status !== 'REPAYED' ? (
          <>
            <button
              type="button"
              onClick={() => setIsRestructureModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-6 py-2.5 text-sm font-bold text-amber-700 shadow-sm transition-all dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-400 sm:w-auto"
            >
              <RefreshCcw size={18} />
              Restructure
            </button>
            {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ACCOUNTANT') &&
              loan.disbursementMethod === 'MPAMBA' &&
              loan.application?.status === 'PENDING_DISBURSEMENT' && (
                <MpambaDisbursementButton
                  loanId={loan.id}
                  borrowerName={loan.user?.fullName ?? ''}
                  borrowerPhone={loan.user?.primaryPhone ?? ''}
                  amount={loan.totalPrincipal}
                  onSuccess={loadData}
                />
              )}
            <MpambaRepaymentButton
              loanId={loan.id}
              borrowerName={loan.user?.fullName ?? ''}
              borrowerPhone={loan.user?.primaryPhone ?? ''}
              remainingBalance={loan.remainingBalance}
              onSuccess={loadData}
            />
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-colors hover:bg-primary-700 sm:w-auto"
            >
              <Plus size={18} />
              Record Payment
            </button>
          </>
        ) : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Borrower + Financial Summary */}
        <div className="lg:col-span-1 space-y-8">
          {/* Borrower Card */}
          <div className="bento-card p-6">
            <h3 className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em] mb-6">Borrower Information</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                <UserIcon size={24} />
              </div>
              <div>
                <p className="font-bold text-foreground">{loan.user?.fullName}</p>
                <p className="text-xs text-foreground/60">National ID: {loan.user?.nationalId}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <Phone size={16} className="text-primary-500" />
                <span>{loan.user?.primaryPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/70">
                <Mail size={16} className="shrink-0 text-primary-500" />
                <span className="min-w-0 break-all">{loan.user?.email}</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bento-card p-6 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900">
            <h3 className="text-xs font-black opacity-50 uppercase tracking-[0.2em] mb-6">Financial Summary</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase opacity-50 mb-1">Outstanding Balance</p>
                <p className="text-3xl font-black">MWK {loan.remainingBalance.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50 mb-1">Principal</p>
                  <p className="text-sm font-bold">MWK {loan.totalPrincipal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50 mb-1">Interest</p>
                  <p className="text-sm font-bold">MWK {loan.totalInterest.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-50 mb-1">Monthly interest rate</p>
                <p className="text-sm font-bold">{(loan.interestRate * 100).toFixed(1)}% per month</p>
              </div>
              <div className="pt-4 border-t border-white/10 dark:border-slate-900/10">
                <div className="flex justify-between items-center mb-2 text-[10px] font-black uppercase opacity-50">
                  <span>Progress</span>
                  <span>{Math.round(((loan.totalRepayable - loan.remainingBalance) / loan.totalRepayable) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 dark:bg-slate-900/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500" 
                    style={{ width: `${Math.round(((loan.totalRepayable - loan.remainingBalance) / loan.totalRepayable) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule, Payments, Collateral */}
        <div className="lg:col-span-2 space-y-8">
          {/* Repayment Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Repayment Schedule
            </h3>
            <div className="bento-card overflow-hidden">
              <ResponsiveTable
                mobileCards={
                  <div className="space-y-3 p-4">
                    {loan.schedule?.map((item) => (
                      <div key={item.id} className="space-y-2 rounded-xl border border-border p-4">
                        <p className="text-sm font-medium text-foreground">{new Date(item.dueDate).toLocaleDateString()}</p>
                        <p className="text-xs text-foreground/70">Principal MWK {item.principalDue.toLocaleString()}</p>
                        <p className="text-xs text-foreground/70">Interest MWK {item.interestDue.toLocaleString()}</p>
                        <p className="text-sm font-bold text-foreground">Total MWK {item.amountDue.toLocaleString()}</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getScheduleStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                }
                table={
                  <table className="hidden w-full min-w-[700px] text-left md:table">
                    <thead>
                      <tr className="border-b border-border bg-slate-50/50 dark:bg-zinc-900/50">
                        <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40">Due Date</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40">Principal</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40">Interest</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40">Total Due</th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase text-foreground/40">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {loan.schedule?.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground/70">MWK {item.principalDue.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-foreground/70">MWK {item.interestDue.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-bold text-foreground">MWK {item.amountDue.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getScheduleStatusClass(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              />
            </div>
          </div>

          {/* Payment Records */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary-600" />
              Payment Records
            </h3>
            <div className="space-y-3">
              {loan.payments && loan.payments.length > 0 ? (
                loan.payments.map((payment) => (
                  <div key={payment.id} className="bento-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600">
                        <Banknote size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">MWK {payment.amount.toLocaleString()}</p>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded-full text-foreground/40 font-bold uppercase">
                            {payment.method}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">
                          Recorded by {payment.recorder?.fullName} on {new Date(payment.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-foreground/40 uppercase">Reference</p>
                      <p className="text-xs font-mono font-medium text-foreground">{payment.referenceNo || 'N/A'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bento-card p-12 text-center text-foreground/40 italic text-sm">
                  No payments recorded for this loan yet.
                </div>
              )}
            </div>
          </div>

          {/* Collateral */}
          {loan.applicationId && (
            <CollateralSection applicationId={loan.applicationId} />
          )}
        </div>
      </div>

      <RecordPaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        loanId={loan.id}
        onSuccess={loadData}
      />

      <RestructureLoanModal
        isOpen={isRestructureModalOpen}
        onClose={() => setIsRestructureModalOpen(false)}
        loanId={loan.id}
        currentRate={loan.interestRate}
        onSuccess={loadData}
      />
    </div>
  );
}