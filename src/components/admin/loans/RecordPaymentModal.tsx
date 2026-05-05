'use client';

import { useState } from 'react';
import { useLoans } from '@/hooks/useLoans';
import {
  X,
  Banknote,
  CreditCard,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDatePicker from '@/components/ui/DatePicker';
import Modal from '@/components/ui/Modal';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  onSuccess: () => void;
}

export default function RecordPaymentModal({ isOpen, onClose, loanId, onSuccess }: RecordPaymentModalProps) {
  const { recordPayment, isLoading, error } = useLoans();
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'BANK_TRANSFER',
    referenceNo: '',
    notes: '',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recordPayment(loanId, {
        amount: Number(formData.amount),
        paymentDate: new Date(formData.paymentDate).toISOString(),
        method: formData.method,
        referenceNo: formData.referenceNo,
        notes: formData.notes,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setFormData({
          amount: '',
          paymentDate: new Date().toISOString().split('T')[0],
          method: 'BANK_TRANSFER',
          referenceNo: '',
          notes: '',
        });
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const header = (
    <div className="flex items-center justify-between bg-card px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0 rounded-xl bg-primary-500 p-2 text-white shadow-lg shadow-primary-500/20">
          <Banknote size={24} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">Record Payment</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">
            Manual entry for Loan: {loanId.slice(0, 8)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-foreground/5"
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
      className="rounded-3xl"
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
            <h4 className="mb-2 text-2xl font-black text-foreground">Payment Recorded!</h4>
            <p className="text-foreground/60">The loan balance and schedule have been updated.</p>
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
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Amount (MWK)</label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/30" />
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-border bg-background py-3 pl-12 pr-4 font-bold text-foreground outline-hidden transition-all focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Payment Date</label>
                <CustomDatePicker
                  label=""
                  value={formData.paymentDate}
                  onChange={(value) => setFormData({ ...formData, paymentDate: value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Payment Method</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/30" />
                <select
                  required
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full appearance-none rounded-2xl border border-border bg-background py-3 pl-12 pr-4 font-bold text-foreground outline-hidden transition-all focus:ring-4 focus:ring-primary-500/10"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash Payment</option>
                  <option value="MPAMBA">TNM Mpamba</option>
                  <option value="AIRTEL_MONEY">Airtel Money</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Reference / Receipt No.</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/30" />
                <input
                  type="text"
                  value={formData.referenceNo}
                  onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                  placeholder="TXN-123456789"
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-12 pr-4 font-medium text-foreground outline-hidden transition-all focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-border py-4 font-bold text-foreground/60 transition-colors hover:bg-foreground/5 sm:flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-4 font-bold text-white shadow-xl shadow-primary-500/20 transition-all hover:bg-primary-700 disabled:opacity-50 sm:flex-[2]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Payment'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}
