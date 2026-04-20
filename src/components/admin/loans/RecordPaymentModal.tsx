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
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDatePicker from '@/components/ui/DatePicker';

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
    notes: ''
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
        notes: formData.notes
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
          notes: ''
        });
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden relative border border-border"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
              <Banknote size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight">Record Payment</h3>
              <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Manual entry for Loan: {loanId.slice(0, 8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-foreground/5 transition-colors">
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
                <h4 className="text-2xl font-black text-foreground mb-2">Payment Recorded!</h4>
                <p className="text-foreground/60">The loan balance and schedule have been updated.</p>
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
                    <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">Amount (MWK)</label>
                    <div className="relative">
                      <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 w-5 h-5" />
                      <input 
                        type="number" 
                        required
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary-500/10 outline-hidden transition-all font-bold text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">Payment Date</label>
                    <CustomDatePicker
                      label=""
                      value={formData.paymentDate}
                      onChange={(value) => setFormData({...formData, paymentDate: value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">Payment Method</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 w-5 h-5" />
                    <select 
                      required
                      value={formData.method}
                      onChange={e => setFormData({...formData, method: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary-500/10 outline-hidden transition-all font-bold appearance-none text-foreground"
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
                  <label className="text-xs font-black text-foreground/40 uppercase tracking-widest">Reference / Receipt No.</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 w-5 h-5" />
                    <input 
                      type="text" 
                      value={formData.referenceNo}
                      onChange={e => setFormData({...formData, referenceNo: e.target.value})}
                      placeholder="TXN-123456789"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary-500/10 outline-hidden transition-all font-medium text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 py-4 px-6 rounded-2xl border border-border text-foreground/60 font-bold hover:bg-foreground/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-[2] py-4 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirm Payment'}
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
