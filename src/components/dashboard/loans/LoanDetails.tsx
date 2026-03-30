'use client';

import { useState } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { Loan, PaymentSchedule, LoanPayment } from '@/types/api';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Banknote,
  Receipt,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LoanDetailsProps {
  loanId: string;
  onBack: () => void;
}

export default function LoanDetails({ loanId, onBack }: LoanDetailsProps) {
  const { currentLoan: loan, isLoading, error, fetchLoanById } = useLoans();

  // Load details on mount
  useState(() => {
    fetchLoanById(loanId);
  });

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
      case 'PAID': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'LATE': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'PARTIAL': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

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
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-foreground/60"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Loan Details</h1>
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Reference: {loan.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

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

      {/* Tabs / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Payment Schedule
            </h3>
          </div>
          <div className="bento-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-slate-50/50 dark:bg-zinc-900/50">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase text-foreground/40">Due Date</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase text-foreground/40">Amount</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase text-foreground/40">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loan.schedule?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-bold text-foreground">MWK {item.amountDue.toLocaleString()}</div>
                        {item.paidAmount > 0 && (
                          <div className="text-[10px] text-green-600 font-bold">Paid: MWK {item.paidAmount.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getScheduleStatusClass(item.status)}`}>
                          {getScheduleStatusIcon(item.status)}
                          {item.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                <div key={payment.id} className="bento-card p-4 flex items-center justify-between">
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
    </div>
  );
}
