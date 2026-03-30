'use client';

import { useState, useEffect } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { Loan } from '@/types/api';
import { 
  Wallet, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Banknote
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyLoansList({ onSelect }: { onSelect: (loan: Loan) => void }) {
  const { loans, isLoading, error, fetchMyLoans } = useLoans();

  useEffect(() => {
    fetchMyLoans();
  }, [fetchMyLoans]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Loading your loans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bento-card p-8 flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-error-main mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-2">Failed to load loans</h3>
        <p className="text-foreground/60 mb-6">{error}</p>
        <button 
          onClick={() => fetchMyLoans()}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="bento-card p-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
          <Wallet className="w-8 h-8 text-foreground/30" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No active loans</h3>
        <p className="text-foreground/60 max-w-sm mb-8">
          You don't have any active loans at the moment. Once an application is approved and disbursed, it will appear here.
        </p>
        <a 
          href="/dashboard/applications"
          className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
        >
          View Applications
        </a>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'REPAYED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'DEFAULTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'RESTRUCTURED': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {loans.map((loan, index) => (
        <motion.div
          key={loan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(loan)}
          className="bento-card p-6 cursor-pointer group hover:border-primary-500/50 transition-all relative overflow-hidden"
        >
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(loan.status)}`}>
              {loan.status}
            </div>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight size={20} />
            </div>
          </div>

          {/* Amount Info */}
          <div className="space-y-1 mb-6">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Remaining Balance</p>
            <h3 className="text-3xl font-black text-foreground tracking-tight">
              MWK {loan.remainingBalance.toLocaleString()}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
              <span className="text-foreground/40">Repayment Progress</span>
              <span className="text-primary-600 dark:text-primary-400">
                {Math.round(((loan.totalRepayable - loan.remainingBalance) / loan.totalRepayable) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((loan.totalRepayable - loan.remainingBalance) / loan.totalRepayable) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-primary-500 rounded-full shadow-[0_0_10px_rgba(var(--color-primary-500),0.5)]"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-primary-600 shadow-sm">
                <Banknote size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase">Total Repayable</p>
                <p className="text-sm font-bold text-foreground">MWK {loan.totalRepayable.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-primary-600 shadow-sm">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase">Started</p>
                <p className="text-sm font-bold text-foreground">{new Date(loan.startDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
