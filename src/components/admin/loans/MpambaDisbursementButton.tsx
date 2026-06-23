'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import apiClient from '@/lib/apiClient';

interface Props {
  loanId: string;
  borrowerName: string;
  borrowerPhone: string;
  amount: number;
  onSuccess?: () => void;
}

type Stage = 'idle' | 'confirming' | 'loading' | 'pending' | 'done' | 'error';

export default function MpambaDisbursementButton({
  loanId,
  borrowerName,
  borrowerPhone,
  amount,
  onSuccess,
}: Props) {
  const [stage, setStage] = useState<Stage>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<string | null>(null);

  function open() {
    setStage('confirming');
    setErrorMsg('');
    setStatusResult(null);
  }

  function close() {
    if (stage === 'loading') return;
    setStage('idle');
    setErrorMsg('');
    setTransactionId('');
    setStatusResult(null);
  }

  async function confirm() {
    setStage('loading');
    setErrorMsg('');
    try {
      const res = await apiClient.post(`/mpamba/loans/${loanId}/disburse`);
      setTransactionId(res.data.transactionId ?? '');
      if (res.data.pending) {
        setStage('pending');
      } else {
        setStage('done');
        onSuccess?.();
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message ?? e.message ?? 'Disbursement failed');
      setStage('error');
    }
  }

  async function checkStatus() {
    if (!transactionId) return;
    setCheckingStatus(true);
    setStatusResult(null);
    try {
      const res = await apiClient.get(`/mpamba/disburse/${transactionId}/status`);
      const s: string = res.data.status;
      setStatusResult(s);
      if (s === 'COMPLETED') {
        setStage('done');
        onSuccess?.();
      } else if (s === 'FAILED') {
        setStage('error');
        setErrorMsg('Mpamba reported the transaction as failed.');
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
        <div className="shrink-0 rounded-xl bg-emerald-500 p-2 text-white shadow-lg shadow-emerald-500/20">
          <Smartphone size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">Send via Mpamba</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">
            Loan payout · {loanId.slice(0, 8)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={close}
        disabled={stage === 'loading'}
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-foreground/5 disabled:opacity-40"
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-2.5 text-sm font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400 sm:w-auto"
      >
        <Send size={16} />
        Send via Mpamba
      </button>

      <Modal
        isOpen={stage !== 'idle'}
        onClose={close}
        customHeader={header}
        maxWidthClassName="max-w-md"
        className="rounded-3xl"
        contentClassName="!px-4 !py-6 sm:!px-8 sm:!py-8"
      >
        <AnimatePresence mode="wait">
          {(stage === 'confirming' || stage === 'loading') && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-border bg-slate-50/60 p-5 dark:bg-zinc-900/40 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/50 font-medium">Recipient</span>
                  <span className="font-bold text-foreground">{borrowerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/50 font-medium">Mpamba number</span>
                  <span className="font-bold text-foreground">{borrowerPhone}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-foreground/50 font-medium text-sm">Amount</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    MWK {amount.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-foreground/50 text-center">
                This will send the loan principal directly to the borrower&apos;s Mpamba wallet.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={close}
                  disabled={stage === 'loading'}
                  className="flex-1 rounded-2xl border border-border py-3.5 font-bold text-foreground/60 transition-colors hover:bg-foreground/5 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={stage === 'loading'}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
                >
                  {stage === 'loading' ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={18} /> Confirm & Send</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20">
                <Loader2 size={36} className="animate-spin" />
              </div>
              <div>
                <h4 className="text-xl font-black text-foreground mb-1">Processing</h4>
                <p className="text-sm text-foreground/60">
                  Mpamba accepted the request and is processing the transfer. Check back shortly.
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
                  onClick={close}
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
                  {checkingStatus ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Check Status'}
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
              <h4 className="text-2xl font-black text-foreground">Sent!</h4>
              <p className="text-foreground/60 text-sm">
                MWK {amount.toLocaleString()} has been sent to {borrowerName}&apos;s Mpamba wallet.
              </p>
              <button
                type="button"
                onClick={close}
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
                onClick={close}
                className="w-full rounded-2xl border border-border py-3.5 font-bold text-foreground/60 hover:bg-foreground/5"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
}
