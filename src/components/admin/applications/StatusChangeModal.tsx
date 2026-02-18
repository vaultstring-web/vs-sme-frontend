'use client';

import { useState } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { Textarea, Select } from '@/components/ui/FormELements';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, comment: string) => Promise<void>;
  currentStatus: string;
}

export default function StatusChangeModal({ isOpen, onClose, onConfirm, currentStatus }: StatusChangeModalProps) {
  const [newStatus, setNewStatus] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!newStatus || !comment) return;
    
    setIsSubmitting(true);
    try {
      // Prepend reason to comment if selected
      const finalComment = reason ? `[${reason}] ${comment}` : comment;
      await onConfirm(newStatus, finalComment);
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = {
    APPROVED: ['Creditworthy', 'Documents Verified', 'Policy Exception'],
    REJECTED: ['Insufficient Income', 'Bad Credit History', 'Incomplete Documents', 'Policy Violation'],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Update Status</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
              New Status
            </label>
            <Select 
              value={newStatus} 
              onChange={(e) => {
                setNewStatus(e.target.value);
                setReason(''); // Reset reason when status changes
              }}
            >
              <option value="">Select Status...</option>
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="DISBURSED">Disbursed</option>
              <option value="REPAYED">Repayed</option>
              <option value="DEFAULTED">Defaulted</option>
            </Select>
          </div>

          {(newStatus === 'APPROVED' || newStatus === 'REJECTED') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                Reason Code
              </label>
              <Select value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="">Select Reason...</option>
                {reasons[newStatus as keyof typeof reasons].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
              Comment / Notes <span className="text-red-500">*</span>
            </label>
            <Textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add internal notes about this decision..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!newStatus || !comment || isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all
              ${newStatus === 'REJECTED' 
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400' 
                : 'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400'
              }`}
          >
            {isSubmitting ? 'Updating...' : 'Confirm Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
