"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Textarea, Select } from "@/components/ui/FormELements";
import Modal from "@/components/ui/Modal";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, comment: string) => Promise<void>;
  currentStatus: string;
}

export default function StatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus: _currentStatus,
}: StatusChangeModalProps) {
  const [newStatus, setNewStatus] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClose = () => {
    setNewStatus("");
    setReason("");
    setComment("");
    setShowConfirmation(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!newStatus || !comment) return;

    setIsSubmitting(true);
    try {
      const finalComment = reason ? `[${reason}] ${comment}` : comment;
      await onConfirm(newStatus, finalComment);
      setNewStatus("");
      setReason("");
      setComment("");
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = {
    APPROVED: ["Creditworthy", "Documents Verified", "Policy Exception"],
    REJECTED: [
      "Insufficient Income",
      "Bad Credit History",
      "Incomplete Documents",
      "Policy Violation",
    ],
    UNDER_REVIEW: [
      "Additional Info Needed",
      "Credit Check In Progress",
      "Document Verification Pending",
    ],
  };

  const isIrreversible = newStatus === "REJECTED" || newStatus === "APPROVED";
  const canProceed = newStatus && comment;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (showConfirmation) {
          setShowConfirmation(false);
        } else {
          handleClose();
        }
      }}
      title={showConfirmation ? "Confirm Status Change" : "Update Status"}
      maxWidthClassName="max-w-md"
      className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      footer={
        !showConfirmation ? (
          <>
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => (isIrreversible ? setShowConfirmation(true) : void handleSubmit())}
              disabled={!canProceed || isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-all sm:w-auto ${
                newStatus === "REJECTED"
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                  : "bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400"
              }`}
            >
              {isIrreversible ? "Next" : "Confirm Update"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:w-auto"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-all sm:w-auto ${
                newStatus === "REJECTED"
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                  : "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
              }`}
            >
              {isSubmitting ? "Confirming..." : "Confirm & Update"}
            </button>
          </>
        )
      }
    >
      {!showConfirmation ? (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              New Status
            </label>
            <Select
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value);
                setReason("");
              }}
            >
              <option value="">Select Status...</option>
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
              <option value="UNDER_REVIEW">Under Review</option>
            </Select>
          </div>

          {(newStatus === "APPROVED" || newStatus === "REJECTED" || newStatus === "UNDER_REVIEW") && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                Reason Code
              </label>
              <Select value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="">Select Reason...</option>
                {reasons[newStatus as keyof typeof reasons]?.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
              Comment / Notes <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add internal notes about this decision..."
              rows={4}
            />
          </div>

          {isIrreversible && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/30 dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                This status change cannot be undone. You will need confirmation on the next step.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                newStatus === "APPROVED" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              {newStatus === "APPROVED" ? (
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              {newStatus === "APPROVED" ? "Approve Application?" : "Reject Application?"}
            </p>
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              This action cannot be undone. {reason && `Reason: ${reason}`}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="mb-1 text-xs font-medium text-slate-500 dark:text-zinc-500">Comment:</p>
            <p className="text-sm text-slate-900 dark:text-zinc-100">{comment}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
