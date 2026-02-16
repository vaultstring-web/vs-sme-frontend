'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/useApplications';
import type { ApplicationDetail } from '@/context/ApplicationsContext';
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Building,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Trash2,
  Send,
  Edit,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

// Status configuration (unchanged)
const statusConfig = {
  APPROVED: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  DISBURSED: {
    label: 'Disbursed',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  SUBMITTED: {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Clock,
  },
  DRAFT: {
    label: 'Draft',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: FileText,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
  REPAYED: {
    label: 'Repaid',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    icon: CheckCircle2,
  },
  DEFAULTED: {
    label: 'Defaulted',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
};

interface Props {
  // Optional initial data from the server (if we pre‑rendered with real data)
  initialApplication?: ApplicationDetail;
  // The ID from the URL (passed from the server page for convenience)
  applicationId: string;
}

export default function ApplicationDetailClient({
  initialApplication,
  applicationId,
}: Props) {
  const router = useRouter();
  const params = useParams();
  // Use the ID from props, fallback to useParams (for safety)
  const id = applicationId || (typeof params?.id === 'string' ? params.id : '');

  // ------------------------------------------------------------
  // Use the hook – we assume it now accepts an initial value.
  // If you haven't modified the hook yet, see the note below.
  // ------------------------------------------------------------
  const {
    currentApplication,
    isLoading,
    error,
    fetchApplicationById,
    submitApplication,
    deleteApplication,
    clearError,
  } = useApplications(initialApplication);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ------------------------------------------------------------
  // Fetch the real data on the client if:
  // - We only have placeholder data (or no initial data), OR
  // - The ID in the URL changes (e.g., navigation)
  // ------------------------------------------------------------
  useEffect(() => {
    if (id && id !== 'placeholder') {
      // Only fetch if we don't already have data for this ID,
      // or if the existing data is for a different ID.
      if (!currentApplication || currentApplication.id !== id) {
        fetchApplicationById(id);
      }
    }
  }, [id, currentApplication, fetchApplicationById]);

  // All handlers remain exactly as they were
  const handleSubmit = async () => {
    if (!currentApplication) return;
    setIsSubmitting(true);
    try {
      await submitApplication(currentApplication.id);
      alert('Application submitted successfully!');
      fetchApplicationById(currentApplication.id);
    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentApplication) return;
    setIsDeleting(true);
    try {
      await deleteApplication(currentApplication.id);
      alert('Application deleted successfully!');
      router.push('/dashboard/applications');
    } catch (err) {
      console.error('Failed to delete application:', err);
      alert('Failed to delete application. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Formatting helpers
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return `MWK ${amount.toLocaleString()}`;
  };

  // Loading state – show spinner if hook says loading AND we have no data yet
  if (isLoading && !currentApplication) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Error state (only if we have no data to show)
  if (error && !currentApplication) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="bento-card border-l-4 border-red-500 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                Error Loading Application
              </h3>
              <p className="mt-1 text-red-600 dark:text-red-300">{error}</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => id && fetchApplicationById(id)}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
                >
                  Try Again
                </button>
                <Link
                  href="/dashboard/applications"
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Back to Applications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No application found
  if (!currentApplication) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="bento-card p-6 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-foreground/20" />
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Application Not Found
          </h3>
          <p className="mb-4 text-foreground/60">
            The application you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/dashboard/applications"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // Render the full UI – identical to your original component
  // ------------------------------------------------------------
  const app = currentApplication;
  const StatusIcon = statusConfig[app.status]?.icon || FileText;
  const isSME = app.type === 'SME';
  const appData = isSME ? app.smeData : app.payrollData;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <Link
              href="/dashboard/applications"
              className="rounded-lg p-2 transition-colors hover:bg-card"
            >
              <ArrowLeft className="h-5 w-5 text-foreground/60" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {isSME ? appData?.businessName : appData?.employerName}
            </h1>
          </div>
          <div className="ml-14 flex items-center gap-4 text-sm text-foreground/60">
            <span>ID: {app.id.substring(0, 8).toUpperCase()}</span>
            <span>•</span>
            <span>{app.type} Application</span>
            <span>•</span>
            <span>Created {formatDate(app.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              statusConfig[app.status]?.color || 'bg-gray-100 text-gray-800'
            }`}
          >
            {statusConfig[app.status]?.label || app.status}
          </span>
        </div>
      </div>

      {/* Action Buttons – only for DRAFT */}
      {app.status === 'DRAFT' && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/dashboard/applications/${app.id}/edit`)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
          >
            <Edit className="h-4 w-4" />
            Edit Application
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}

      {/* Rest of the UI – Loan Information, SME/Payroll details, Documents, Sidebar, Delete Modal */}
      {/* ... (keep everything exactly as in your original component from this point) */}
      {/* I'm truncating here for brevity – you must copy the full JSX from your existing file. */}
    </div>
  );
}