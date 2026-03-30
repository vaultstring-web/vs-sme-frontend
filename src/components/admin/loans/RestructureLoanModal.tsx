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
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  onSuccess 
}: RestructureLoanModalProps) {
  const { restructureLoan, isLoading, error, clearError } = useLoans();
  const [formData, setFormData] = useState({
    newMonths: '12',
    newInterestRate: (currentRate * 100).toString(),
    reason: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await restructureLoan(loanId, {
        newMonths: Number(formData.newMonths),
        newInterestRate: Number(formData.newInterestRate) / 100,
        reason: formData.reason
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setFormData({
          newMonths: '12',
          newInterestRate: (currentRate * 100).toString(),
          reason: ''
        });
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              <RefreshCcw size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Restructure Loan</h3>
              <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Adjust terms for Loan: {loanId.slice(0, 8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-2xl font-black text-foreground mb-2">Loan Restructured!</h4>
                <p className="text-foreground/60">A new repayment schedule has been generated.</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 text-red-600">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">New Period (Months)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 w-5 h-5" />
                      <input 
                        type="number" 
                        required
                        min="1"
                        max="60"
                        value={formData.newMonths}
                        onChange={e => setFormData({...formData, newMonths: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-slate-50 dark:bg-zinc-900 focus:ring-4 focus:ring-primary-500/10 outline-hidden transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">New APR (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 w-5 h-5" />
                      <input 
                        type="number" 
                        required
                        step="0.1"
                        value={formData.newInterestRate}
                        onChange={e => setFormData({...formData, newInterestRate: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-slate-50 dark:bg-zinc-900 focus:ring-4 focus:ring-primary-500/10 outline-hidden transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">Reason for Restructuring</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-foreground/30 w-5 h-5" />
                    <textarea 
                      required
                      value={formData.reason}
                      onChange={e => setFormData({...formData, reason: e.target.value})}
                      placeholder="e.g., Financial hardship, extension request..."
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-slate-50 dark:bg-zinc-900 focus:ring-4 focus:ring-primary-500/10 outline-hidden transition-all font-medium resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 py-4 px-6 rounded-2xl border border-border text-foreground/60 font-bold hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-[2] py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Restructure Loan'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
