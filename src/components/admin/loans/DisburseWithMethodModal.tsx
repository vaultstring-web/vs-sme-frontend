'use client';

import { useState } from 'react';
import {
  Wallet,
  Smartphone,
  Banknote,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import apiClient from '@/lib/apiClient';

type DisbursementMethod = 'MPAMBA' | 'CASH' | 'BANK_TRANSFER';
type Stage = 'method' | 'confirm' | 'loading' | 'pending' | 'done' | 'error';

interface Props {
  applicationId: string;
  borrowerName: string;
  borrowerPhone: string;
  amount: number;
  onSuccess?: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const METHOD_META: Record<DisbursementMethod, { label: string; description: string; icon: React.ReactNode }> = {
  MPAMBA: {
    label: 'Mpamba Mobile Money',
    description: 'Send directly to the borrower\'s Mpamba wallet. Instant transfer.',
    icon: <Smartphone size={20} />,
  },
  CASH: {
    label: 'Cash',
    description: 'Funds will be handed over in person. You\'ll confirm after handover.',
    icon: <Banknote size={20} />,
  },
  BANK_TRANSFER: {
    label: 'Bank Transfer',
    description: 'Funds transferred to the borrower\'s bank account. Confirm after transfer.',
    icon: <Building2 size={20} />,
  },
};

export default function DisburseWithMethodModal({
  applicationId,
  borrowerName,
  borrowerPhone,
  amount,
  onSuccess,
  onClose,
  isOpen,
}: Props) {
  const [stage, setStage] = useState<Stage>('method');
  const [method, setMethod] = useState<DisbursementMethod | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loanId, setLoanId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<string | null>(null);

  function handleClose() {
    if (stage === 'loading') return;
    setStage('method');
    setMethod(null);
    setErrorMsg('');
    setLoanId('');
    setTransactionId('');
    setStatusResult(null);
    onClose();
  }

  async function handleConfirm() {
    if (!method) return;
    setStage('loading');
    setErrorMsg('');

    try {
      // Step 1: Create the loan record with the chosen disbursement method
      const loanRes = await apiClient.post('/admin/loans/disburse', {
        applicationId,
        disbursementMethod: method,
      });
      const createdLoanId: string = loanRes.data.id;
      setLoanId(createdLoanId);

      if (method === 'MPAMBA') {
        // Step 2 (Mpamba only): Immediately trigger the payout
        const payoutRes = await apiClient.post(`/mpamba/loans/${createdLoanId}/disburse`);
        setTransactionId(payoutRes.data.transactionId ?? '');
        if (payoutRes.data.pending) {
          setStage('pending');
        } else {
          setStage('done');
          onSuccess?.();
        }
      } else {
        // For CASH / BANK_TRANSFER the loan is created; admin confirms separately
        setStage('done');
        onSuccess?.();
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message ?? e.message ?? 'Disbursement failed');
      setStage('error');
    }
  }

  async function checkMpambaStatus() {
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
        setErrorMsg('Mpamba reported the transfer as failed. Please retry or use a different method.');
      }
    } catch {
      setStatusResult('Could not fetch status — try again.');
    } finally {
      setCheckingStatus(false);
    }
  }

  async function confirmManualDisbursement() {
    if (!loanId) return;
    setStage('loading');
    try {
      await apiClient.post(`/admin/loans/${loanId}/confirm-disbursement`);
      setStage('done');
      onSuccess?.();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(e.response?.data?.message ?? e.message ?? 'Confirmation failed');
      setStage('error');
    }
  }

  const header = (
    <div className="flex items-center justify-between bg-card px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="shrink-0 rounded-xl bg-green-600 p-2 text-white shadow-lg shadow-green-600/20">
          <Wallet size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black tracking-tight text-foreground sm:text-xl">Disburse Loan</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">
            MWK {amount.toLocaleString()} · {borrowerName}
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
        {/* ── Step 1: Choose method ── */}
        {stage === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-foreground/60">
              Choose how the loan funds will be transferred to <strong>{borrowerName}</strong>.
            </p>
            <div className="space-y-3">
              {(Object.entries(METHOD_META) as [DisbursementMethod, typeof METHOD_META[DisbursementMethod]][]).map(
                ([key, meta]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMethod(key)}
                    className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                      method === key
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-border hover:border-foreground/20 hover:bg-foreground/5'
                    }`}
                  >
                    <div
                      className={`shrink-0 rounded-xl p-2 ${
                        method === key
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-100 text-foreground/60 dark:bg-zinc-800'
                      }`}
                    >
                      {meta.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground">{meta.label}</p>
                      <p className="text-xs text-foreground/50 mt-0.5">{meta.description}</p>
                    </div>
                    {method === key && <ChevronRight size={16} className="shrink-0 text-green-600" />}
                  </button>
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => method && setStage('confirm')}
              disabled={!method}
              className="mt-2 w-full rounded-2xl bg-green-600 py-3.5 font-bold text-white shadow-xl shadow-green-500/20 transition-all hover:bg-green-700 disabled:opacity-40"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* ── Step 2: Confirm ── */}
        {(stage === 'confirm' || stage === 'loading') && method && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border bg-slate-50/60 p-5 dark:bg-zinc-900/40 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/50 font-medium">Borrower</span>
                <span className="font-bold text-foreground">{borrowerName}</span>
              </div>
              {method === 'MPAMBA' && (
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/50 font-medium">Mpamba number</span>
                  <span className="font-bold text-foreground">{borrowerPhone}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-foreground/50 font-medium">Method</span>
                <span className="font-bold text-foreground">{METHOD_META[method].label}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-foreground/50 font-medium text-sm">Amount</span>
                <span className="text-xl font-black text-green-600 dark:text-green-400">
                  MWK {amount.toLocaleString()}
                </span>
              </div>
            </div>

            {method !== 'MPAMBA' && (
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3">
                You will need to confirm the transfer manually after handing over the funds.
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStage('method')}
                disabled={stage === 'loading'}
                className="flex-1 rounded-2xl border border-border py-3.5 font-bold text-foreground/60 transition-colors hover:bg-foreground/5 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={stage === 'loading'}
                className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 font-bold text-white shadow-xl shadow-green-500/20 transition-all hover:bg-green-700 disabled:opacity-50"
              >
                {stage === 'loading' ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing…</>
                ) : (
                  <><Wallet size={18} /> Confirm Disbursement</>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Mpamba pending ── */}
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
              <h4 className="text-xl font-black text-foreground mb-1">Transfer Processing</h4>
              <p className="text-sm text-foreground/60">
                Mpamba accepted the request. Check back to confirm the funds reached {borrowerName}.
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
                onClick={checkMpambaStatus}
                disabled={checkingStatus}
                className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-xl shadow-primary-500/20 hover:bg-primary-700 disabled:opacity-50"
              >
                {checkingStatus ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Check Status'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Cash/Bank done (awaiting manual confirmation) ── */}
        {stage === 'done' && method && method !== 'MPAMBA' && (
          <motion.div
            key="done-manual"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20">
                {METHOD_META[method].icon}
              </div>
              <h4 className="text-xl font-black text-foreground">Loan Created</h4>
              <p className="text-sm text-foreground/60">
                The repayment schedule is ready. Once you have transferred the funds via{' '}
                {METHOD_META[method].label.toLowerCase()}, confirm the disbursement below.
              </p>
            </div>
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
                onClick={confirmManualDisbursement}
                disabled={stage === 'loading'}
                className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 font-bold text-white shadow-xl shadow-green-500/20 hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle2 size={18} /> Confirm Funds Sent
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Mpamba fully done ── */}
        {stage === 'done' && method === 'MPAMBA' && (
          <motion.div
            key="done-mpamba"
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
              onClick={handleClose}
              className="mt-2 w-full rounded-2xl border border-border py-3.5 font-bold text-foreground/60 hover:bg-foreground/5"
            >
              Close
            </button>
          </motion.div>
        )}

        {/* ── Error ── */}
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
              onClick={handleClose}
              className="w-full rounded-2xl border border-border py-3.5 font-bold text-foreground/60 hover:bg-foreground/5"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
