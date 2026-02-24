"use client";

import { useState } from "react";
import { X, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Textarea, Select } from "@/components/ui/FormELements";

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
  currentStatus,
}: StatusChangeModalProps) {
  const [newStatus, setNewStatus] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!newStatus || !comment) return;

    setIsSubmitting(true);
    try {
      // Prepend reason to comment if selected
      const finalComment = reason ? `[${reason}] ${comment}` : comment;
      await onConfirm(newStatus, finalComment);
      // Reset form on success
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            {showConfirmation ? "Confirm Status Change" : "Update Status"}
          </h3>
          <button
            onClick={() => {
              if (showConfirmation) {
                setShowConfirmation(false);
              } else {
                onClose();
                setNewStatus("");
                setComment("");
                setReason("");
              }
            }}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {!showConfirmation ? (
          <>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                  New Status
                </label>
                <Select
                  value={newStatus}
                  onChange={(e) => {
                    setNewStatus(e.target.value);
                    setReason(""); // Reset reason when status changes
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

              {(newStatus === "APPROVED" ||
                newStatus === "REJECTED" ||
                newStatus === "UNDER_REVIEW") && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                    Reason Code
                  </label>
                  <Select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
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

              {isIrreversible && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    This status change cannot be undone. You will need
                    confirmation on the next step.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800">
              <button
                onClick={() => {
                  onClose();
                  setNewStatus("");
                  setComment("");
                  setReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  isIrreversible ? setShowConfirmation(true) : handleSubmit()
                }
                disabled={!canProceed || isSubmitting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all
                  ${
                    newStatus === "REJECTED"
                      ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                      : "bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400"
                  }`}
              >
                {isIrreversible ? "Next" : "Confirm Update"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center
                    ${newStatus === "APPROVED" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                >
                  {newStatus === "APPROVED" ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="font-bold text-lg text-slate-900 dark:text-zinc-100">
                  {newStatus === "APPROVED"
                    ? "Approve Application?"
                    : "Reject Application?"}
                </p>
                <p className="text-sm text-slate-600 dark:text-zinc-400">
                  This action cannot be undone. {reason && `Reason: ${reason}`}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700">
                <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium mb-1">
                  Comment:
                </p>
                <p className="text-sm text-slate-900 dark:text-zinc-100">
                  {comment}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-all
                  ${
                    newStatus === "REJECTED"
                      ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                      : "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                  }`}
              >
                {isSubmitting ? "Confirming..." : "Confirm & Update"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
