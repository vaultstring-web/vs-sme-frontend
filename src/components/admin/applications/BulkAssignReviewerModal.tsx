"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/FormELements";
import apiClient from "@/lib/apiClient";
import Modal from "@/components/ui/Modal";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Reviewer"
      maxWidthClassName="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            className="min-h-11 w-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReviewerId || isSubmitting}
            className="min-h-11 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700 disabled:bg-primary-400 sm:w-auto"
          >
            {isSubmitting ? "Assigning..." : "Assign"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
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
    </Modal>
  );
}
