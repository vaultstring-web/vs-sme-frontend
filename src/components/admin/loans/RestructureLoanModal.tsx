'use client';

import { useState } from 'react';
import { useLoans } from '@/hooks/useLoans';
import {
  X,
  RefreshCcw,
  Calendar,
  Percent,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';

interface RestructureLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  currentRate: number;
  onSuccess: () => void;
}

export default function RestructureLoanModal({
  isOpen,
  onClose,
  loanId,
  currentRate,
  onSuccess,
}: RestructureLoanModalProps) {
  const { restructureLoan, isLoading, error } = useLoans();
  const [formData, setFormData] = useState({
    newMonths: '12',
    newInterestRate: (currentRate * 100).toString(),
    reason: '',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await restructureLoan(loanId, {
        newMonths: Number(formData.newMonths),
        newInterestRate: Number(formData.newInterestRate) / 100,
        reason: formData.reason,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setFormData({
          newMonths: '12',
          newInterestRate: (currentRate * 100).toString(),
          reason: '',
        });
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const header = (
    <div className="flex items-center justify-between border-b border-border bg-slate-50 px-4 py-4 dark:bg-zinc-900/50 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0 rounded-xl bg-amber-500 p-2 text-white shadow-lg shadow-amber-500/20">
          <RefreshCcw size={24} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">Restructure Loan</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">
            Adjust terms for Loan: {loanId.slice(0, 8)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-zinc-800"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      customHeader={header}
      maxWidthClassName="max-w-lg"
      className="rounded-3xl bg-white dark:bg-zinc-950"
      contentClassName="!px-4 !py-6 sm:!px-8 sm:!py-8"
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20">
              <CheckCircle2 size={40} />
            </div>
            <h4 className="mb-2 text-2xl font-black text-foreground">Loan Restructured!</h4>
            <p className="text-foreground/60">A new repayment schedule has been generated.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40">New Period (Months)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/30" />
                  <input
                    type="number"
                    required
                    min={1}
                    max={60}
                    value={formData.newMonths}
                    onChange={(e) => setFormData({ ...formData, newMonths: e.target.value })}
                    className="w-full rounded-2xl border border-border bg-slate-50 py-3 pl-12 pr-4 font-bold outline-hidden transition-all focus:ring-4 focus:ring-primary-500/10 dark:bg-zinc-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40">
                  New monthly interest (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/30" />
                  <input
                    type="number"
                    required
                    step={0.1}
                    value={formData.newInterestRate}
                    onChange={(e) => setFormData({ ...formData, newInterestRate: e.target.value })}
                    className="w-full rounded-2xl border border-border bg-slate-50 py-3 pl-12 pr-4 font-bold outline-hidden transition-all focus:ring-4 focus:ring-primary-500/10 dark:bg-zinc-900"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Reason for Restructuring</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-foreground/30" />
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Financial hardship, extension request..."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-border bg-slate-50 py-3 pl-12 pr-4 font-medium outline-hidden transition-all focus:ring-4 focus:ring-primary-500/10 dark:bg-zinc-900"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-border py-4 font-bold text-foreground/60 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900 sm:flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4 font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-700 disabled:opacity-50 sm:flex-[2]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Restructure Loan'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}
