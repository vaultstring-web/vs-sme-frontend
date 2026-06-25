'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLoans } from '@/hooks/useLoans';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Banknote,
  Receipt,
  Smartphone,
  Shield,
  Package,
  FileText,
} from 'lucide-react';
import ResponsiveTable from '@/components/ui/ResponsiveTable';
import ApplicantRepaymentModal from './ApplicantRepaymentModal';
import apiClient from '@/lib/apiClient';

interface LoanDetailsProps {
  loanId: string;
  onBack: () => void;
}

interface Collateral {
  id: string;
  type: string;
  description: string;
  estimatedValue: number;
  status: string;
  verifiedAt?: string;
  createdAt: string;
}

// ── Collateral Section ────────────────────────────────────────────────────────
function CollateralSection({ applicationId }: { applicationId: string }) {
  const [collaterals, setCollaterals] = useState<Collateral[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollateral = useCallback(async () => {
    try {
      setLoading(true);
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
      case 'VERIFIED': return <CheckCircle2 size={12} />;
      case 'REJECTED': return <AlertCircle size={12} />;
      default:         return <Clock size={12} />;
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
        <div className="space-y-3">
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
                <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(c.status)}`}>
                  {getStatusIcon(c.status)}
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-0.5">Estimated Value</p>
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

// ── Main Component ─────────────────────────────────────────────────────────────
export default function LoanDetails({ loanId, onBack }: LoanDetailsProps) {
  const { currentLoan: loan, isLoading, fetchLoanById } = useLoans();
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

  useEffect(() => {
    fetchLoanById(loanId);
  }, [loanId, fetchLoanById]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Loading loan details...</p>
      </div>
    );
  }

  if (!loan) return null;

  const getScheduleStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'LATE':    return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'PARTIAL': return <Clock className="w-4 h-4 text-amber-500" />;
      default:        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

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
      {/* Header */}
      <div className="flex items-start gap-4 sm:items-center">
        <button
          onClick={onBack}
          className="shrink-0 rounded-lg p-2 text-foreground/60 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Loan Details</h1>
          <p className="break-all text-xs font-bold uppercase tracking-widest text-foreground/40">
            Reference: {loan.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Repayment Action */}
      {(loan.status === 'ACTIVE' || loan.status === 'RESTRUCTURED') && loan.remainingBalance > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-primary-200 bg-primary-50 dark:border-primary-900/30 dark:bg-primary-900/10 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-primary-700 dark:text-primary-300">Ready to make a payment?</p>
            <p className="text-xs text-primary-600/70 dark:text-primary-400/70 mt-0.5">
              Pay your installment or any partial amount directly from your Mpamba wallet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsRepayModalOpen(true)}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-colors hover:bg-primary-700"
          >
            <Smartphone size={16} />
            Pay via Mpamba
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bento-card p-6 border-l-4 border-l-primary-500">
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Remaining Balance</p>
          <h3 className="text-2xl font-black text-foreground mb-4">MWK {loan.remainingBalance.toLocaleString()}</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-primary-600">
            <TrendingUp size={14} />
            <span>{Math.round((loan.remainingBalance / loan.totalRepayable) * 100)}% Outstanding</span>
          </div>
        </div>

        <div className="bento-card p-6">
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Total Repayable</p>
          <h3 className="text-2xl font-black text-foreground mb-4">MWK {loan.totalRepayable.toLocaleString()}</h3>
          <p className="text-xs text-foreground/60 font-medium">Principal: MWK {loan.totalPrincipal.toLocaleString()}</p>
        </div>

        <div className="bento-card p-6">
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Next Payment</p>
          {loan.schedule?.find(s => s.status !== 'PAID') ? (
            <>
              <h3 className="text-2xl font-black text-foreground mb-4">
                MWK {loan.schedule.find(s => s.status !== 'PAID')?.amountDue.toLocaleString()}
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                <Calendar size={14} />
                <span>Due: {new Date(loan.schedule.find(s => s.status !== 'PAID')!.dueDate).toLocaleDateString()}</span>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center">
              <span className="text-sm font-bold text-green-600 uppercase">Loan Fully Paid</span>
            </div>
          )}
        </div>
      </div>

      {/* Schedule + History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Payment Schedule
          </h3>
          <div className="bento-card overflow-hidden">
            <ResponsiveTable
              mobileCards={
                <div className="space-y-3 p-4">
                  {loan.schedule?.map((item) => (
                    <div key={item.id} className="space-y-2 rounded-xl border border-border p-4">
                      <p className="text-sm font-medium text-foreground">
                        {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-sm font-bold text-foreground">MWK {item.amountDue.toLocaleString()}</p>
                      {item.paidAmount > 0 && (
                        <p className="text-[10px] font-bold text-green-600">Paid: MWK {item.paidAmount.toLocaleString()}</p>
                      )}
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getScheduleStatusClass(item.status)}`}>
                        {getScheduleStatusIcon(item.status)}
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              }
              table={
                <table className="hidden w-full min-w-[700px] text-left md:table">
                  <thead>
                    <tr className="border-b border-border bg-slate-50/50 dark:bg-zinc-900/50">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase text-foreground/40">Due Date</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase text-foreground/40">Amount</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase text-foreground/40">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loan.schedule?.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-bold text-foreground">MWK {item.amountDue.toLocaleString()}</div>
                          {item.paidAmount > 0 && (
                            <div className="text-[10px] font-bold text-green-600">Paid: MWK {item.paidAmount.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getScheduleStatusClass(item.status)}`}>
                            {getScheduleStatusIcon(item.status)}
                            {item.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            />
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary-600" />
            Payment History
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
                      <p className="text-sm font-bold text-foreground">MWK {payment.amount.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                        {payment.method.replace('_', ' ')} • {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground/40 uppercase">Ref</p>
                    <p className="text-xs font-mono font-medium text-foreground">{payment.referenceNo || 'N/A'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bento-card p-12 text-center text-foreground/40 italic text-sm">
                No payments recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collateral — full width below schedule/history */}
      <CollateralSection applicationId={loan.applicationId} />

      <ApplicantRepaymentModal
        isOpen={isRepayModalOpen}
        onClose={() => setIsRepayModalOpen(false)}
        loanId={loanId}
        remainingBalance={loan.remainingBalance}
        suggestedAmount={loan.schedule?.find(s => s.status !== 'PAID')?.amountDue}
        onSuccess={() => {
          setIsRepayModalOpen(false);
          fetchLoanById(loanId);
        }}
      />
    </div>
  );
}