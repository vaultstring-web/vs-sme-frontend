"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Select, Textarea } from "@/components/ui/FormELements";
import apiClient from "@/lib/apiClient";

interface BulkStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  ids: string[];
  onConfirmed: () => Promise<void>;
}

export default function BulkStatusModal({
  isOpen,
  onClose,
  ids,
  onConfirmed,
}: BulkStatusModalProps) {
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!newStatus || !comment) {
      alert("Please select a status and add a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalComment = reason ? `[${reason}] ${comment}` : comment;
      await apiClient.patch("/admin/applications/status/bulk", {
        ids,
        status: newStatus,
        comment: finalComment,
      });
      await onConfirmed();
    } catch (error) {
      console.error("Bulk status change failed", error);
      alert("Failed to update status. Please try again.");
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
    UNDER_REVIEW: ["Additional Info Needed", "Credit Check In Progress"],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            Change Status (Bulk)
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Changing status for <strong>{ids.length}</strong> application(s).
              This action is logged.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
              New Status <span className="text-red-500">*</span>
            </label>
            <Select
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value);
                setReason("");
              }}
              className="w-full"
            >
              <option value="">Select Status...</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
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
              placeholder="Explain the reason for this bulk status change..."
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
            className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-all
              ${
                newStatus === "REJECTED"
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                  : "bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400"
              }`}
          >
            {isSubmitting ? "Updating..." : "Confirm & Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
