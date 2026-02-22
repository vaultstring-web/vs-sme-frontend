"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/FormELements";
import apiClient from "@/lib/apiClient";

interface Reviewer {
  id: string;
  fullName: string;
}

interface BulkAssignReviewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ids: string[];
  reviewers: Reviewer[];
  onAssigned: () => Promise<void>;
}

export default function BulkAssignReviewerModal({
  isOpen,
  onClose,
  ids,
  reviewers,
  onAssigned,
}: BulkAssignReviewerModalProps) {
  const [selectedReviewerId, setSelectedReviewerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReviewerId) {
      alert("Please select a reviewer");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.patch("/admin/applications/bulk/assign", {
        ids,
        reviewerId: selectedReviewerId,
      });
      await onAssigned();
    } catch (error) {
      console.error("Bulk assign failed", error);
      alert("Failed to assign reviewer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            Assign Reviewer
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Assigning <strong>{ids.length}</strong> application(s) to a
              reviewer.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
              Select Reviewer <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedReviewerId}
              onChange={(e) => setSelectedReviewerId(e.target.value)}
              className="w-full"
            >
              <option value="">Choose a reviewer...</option>
              {reviewers.map((reviewer) => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.fullName}
                </option>
              ))}
            </Select>
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
            disabled={!selectedReviewerId || isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 transition-all"
          >
            {isSubmitting ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
