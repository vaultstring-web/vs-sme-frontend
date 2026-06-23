'use client';

import { useState } from 'react';
import { Smartphone, Loader2, CheckCircle2, AlertCircle, X, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import apiClient from '@/lib/apiClient';

interface Props {
  loanId: string;
  remainingBalance: number;
  /** Pre-filled suggested amount — typically the next installment due */
  suggestedAmount?: number;
  onSuccess?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

type Stage = 'form' | 'loading' | 'pending' | 'done' | 'error';

export default function ApplicantRepaymentModal({
  loanId,
  remainingBalance,
  suggestedAmount,
  onSuccess,
  isOpen,
  onClose,
}: Props) {
  const [stage, setStage] = useState<Stage>('form');
  const [amount, setAmount] = useState(suggestedAmount ? String(suggestedAmount) : '');
  const [errorMsg, setErrorMsg] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<string | null>(null);

  function handleClose() {
    if (stage === 'loading') return;
    setStage('form');
    setAmount(suggestedAmount ? String(suggestedAmount) : '');
    setErrorMsg('');
    setInvoiceNumber('');
    setStatusResult(null);
    onClose();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setErrorMsg('Please enter a valid positive amount.');
      return;
    }
    if (parsed > remainingBalance) {
      setErrorMsg(`Amount cannot exceed your remaining balance of MWK ${remainingBalance.toLocaleString()}.`);
      return;
    }
    setStage('loading');
    setErrorMsg('');
    try {
      const res = await apiClient.post(`/loans/${loanId}/repay`, { amount: parsed });
      setInvoiceNumber(res.data.invoiceNumber ?? '');
      if (res.data.pending) {
        setStage('pending');
      } else {
        setStage('done');
        onSuccess?.();
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message ?? e.message ?? 'Payment request failed');
      setStage('error');
    }
  }

  async function checkStatus() {
    if (!invoiceNumber) return;
    setCheckingStatus(true);
    setStatusResult(null);
    try {
      const res = await apiClient.get(`/mpamba/repay/${invoiceNumber}/status`);
      const s: string = res.data.status;
      setStatusResult(s);
      if (s === 'COMPLETED') {
        setStage('done');
        onSuccess?.();
      } else if (s === 'FAILED') {
        setStage('error');
        setErrorMsg('The payment was not completed. Please try again.');
      }
    } catch {
      setStatusResult('Could not fetch status — try again.');
    } finally {
      setCheckingStatus(false);
    }
  }

  const header = (
    <div className="flex items-center justify-between bg-card px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0 rounded-xl bg-primary-500 p-2 text-white shadow-lg shadow-primary-500/20">
          <Smartphone size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">Pay via Mpamba</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">
            USSD push to your registered number
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleClose}
        disabled={stage === 'loading'}
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-foreground/5 disabled:opacity-40"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      customHeader={header}
      maxWidthClassName="max-w-md"
      className="rounded-3xl"
      contentClassName="!px-4 !py-6 sm:!px-8 sm:!py-8"
    >
      <AnimatePresence mode="wait">
        {(stage === 'form' || stage === 'loading') && (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border bg-slate-50/60 p-5 dark:bg-zinc-900/40 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/50 font-medium">Outstanding balance</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  MWK {remainingBalance.toLocaleString()}
                </span>
              </div>
              {suggestedAmount && (
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/50 font-medium">Next installment</span>
                  <span className="font-bold text-foreground">MWK {suggestedAmount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40">
                Amount to Pay (MWK)
              </label>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/30" />
                <input
                  type="number"
                  required
                  min="1"
                  max={remainingBalance}
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setErrorMsg(''); }}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-12 pr-4 font-bold text-foreground outline-hidden transition-all focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
              <div className="flex gap-2 mt-1">
                {suggestedAmount && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(suggestedAmount))}
                    className="rounded-lg border border-border px-3 py-1 text-xs font-bold text-foreground/60 hover:bg-foreground/5"
                  >
                    Full installment
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAmount(String(remainingBalance))}
                  className="rounded-lg border border-border px-3 py-1 text-xs font-bold text-foreground/60 hover:bg-foreground/5"
                >
                  Full balance
                </button>
              </div>
            </div>

            <p className="text-xs text-foreground/50 text-center">
              You will receive a USSD prompt on your registered Mpamba number to authorise this payment.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={stage === 'loading'}
                className="flex-1 rounded-2xl border border-border py-3.5 font-bold text-foreground/60 transition-colors hover:bg-foreground/5 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={stage === 'loading'}
                className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-xl shadow-primary-500/20 transition-all hover:bg-primary-700 disabled:opacity-50"
              >
                {stage === 'loading' ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
                ) : (
                  <><Smartphone size={18} /> Send USSD Request</>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {stage === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20">
              <Smartphone size={36} />
            </div>
            <div>
              <h4 className="text-xl font-black text-foreground mb-1">Check Your Phone</h4>
              <p className="text-sm text-foreground/60">
                A USSD prompt has been sent to your registered Mpamba number. Authorise the payment on your
                phone and it will be recorded automatically.
              </p>
            </div>
            {statusResult && (
              <p className="text-xs font-bold rounded-xl bg-slate-100 dark:bg-zinc-800 px-4 py-2 text-foreground/70">
                Status: {statusResult}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-2xl border border-border py-3.5 font-bold text-foreground/60 hover:bg-foreground/5"
              >
                Close
              </button>
              <button
                type="button"
                onClick={checkStatus}
                disabled={checkingStatus}
                className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-xl shadow-primary-500/20 hover:bg-primary-700 disabled:opacity-50"
              >
                {checkingStatus ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Payment'}
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center space-y-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20">
              <CheckCircle2 size={40} />
            </div>
            <h4 className="text-2xl font-black text-foreground">Payment Confirmed!</h4>
            <p className="text-foreground/60 text-sm">
              Your Mpamba payment has been received and your loan balance has been updated.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 w-full rounded-2xl border border-border py-3.5 font-bold text-foreground/60 hover:bg-foreground/5"
            >
              Close
            </button>
          </motion.div>
        )}

        {stage === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => { setStage('form'); setErrorMsg(''); }}
              className="w-full rounded-2xl border border-border py-3.5 font-bold text-foreground/60 hover:bg-foreground/5"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
