'use client';

import { useLoans } from '@/hooks/useLoans';
import { Bell, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoanReminders() {
  const { loans } = useLoans();

  const upcomingPayments = loans.flatMap(loan => 
    (loan.schedule || [])
      .filter(s => s.status !== 'PAID')
      .map(s => ({
        ...s,
        loanId: loan.id,
        loanTitle: loan.id.slice(0, 8).toUpperCase()
      }))
  ).filter(s => {
    const dueDate = new Date(s.dueDate);
    const now = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (upcomingPayments.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2">
        <Bell size={14} className="text-primary-500" />
        Upcoming Reminders
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingPayments.map((payment, index) => (
          <motion.div
            key={`${payment.loanId}-${payment.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 text-primary-600 shadow-sm">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-primary-700 dark:text-primary-400">
                MWK {payment.amountDue.toLocaleString()} Due Soon
              </p>
              <p className="text-[10px] font-medium text-foreground/60">
                Loan {payment.loanTitle} • {new Date(payment.dueDate).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
