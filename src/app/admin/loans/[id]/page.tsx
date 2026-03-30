'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLoans } from '@/hooks/useLoans';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Banknote,
  Receipt,
  User as UserIcon,
  Phone,
  Mail,
  ShieldCheck,
  Plus,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RecordPaymentModal from '@/components/admin/loans/RecordPaymentModal';
import RestructureLoanModal from '@/components/admin/loans/RestructureLoanModal';

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
      case 'PAID': return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'LATE': return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'PARTIAL': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      default: return 'bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-foreground/60"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Loan Management</h1>
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">ID: {loan.id}</p>
          </div>
        </div>

        {!isAuditor && loan.status !== 'REPAYED' && (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsRestructureModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 rounded-xl transition-all font-bold text-sm shadow-sm"
            >
              <RefreshCcw size={18} />
              Restructure
            </button>
            <button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-primary-500/20"
            >
              <Plus size={18} />
              Record Payment
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Borrower */}
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
                <Mail size={16} className="text-primary-500" />
                <span>{loan.user?.email}</span>
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

        {/* Right Column: Schedule & Payments */}
        <div className="lg:col-span-2 space-y-8">
          {/* Payment Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Repayment Schedule
            </h3>
            <div className="bento-card overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-slate-50/50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40">Due Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40">Principal</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40">Interest</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40">Total Due</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-foreground/40 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loan.schedule?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {new Date(item.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">MWK {item.principalDue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">MWK {item.interestDue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">MWK {item.amountDue.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getScheduleStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary-600" />
              Payment Records
            </h3>
            <div className="space-y-3">
              {loan.payments && loan.payments.length > 0 ? (
                loan.payments.map((payment) => (
                  <div key={payment.id} className="bento-card p-4 flex items-center justify-between">
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
        </div>
      </div>

      {/* Record Payment Modal */}
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
