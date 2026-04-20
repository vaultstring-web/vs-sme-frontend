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
import DocumentViewer from '@/components/shared/DocumentViewer';
import { API_BASE_URL } from '@/lib/apiClient';

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
  } = useApplications(initialApplication);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

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
            The application you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
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
  const smeData = app.smeData;
  const payrollData = app.payrollData;
  const appData = isSME ? smeData : payrollData;

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
              {isSME ? smeData?.businessName : (app.user?.fullName || payrollData?.employerName)}
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

      {/* Application Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Loan Information */}
          <div className="bento-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
              <DollarSign className="h-5 w-5" />
              Loan Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground/60">Loan Amount</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formatAmount(appData?.loanAmount || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Payback Period</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {appData?.paybackPeriodMonths || 0} months
                </p>
              </div>
              {isSME && (
                <>
                  <div>
                    <p className="text-sm text-foreground/60">Loan Product</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {smeData?.loanProduct}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Repayment Method</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {smeData?.repaymentMethod}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SME-specific Details */}
          {isSME && smeData && (
            <div className="bento-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Building className="h-5 w-5" />
                Business Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Business Type</p>
                    <p className="mt-1 font-medium text-foreground">{smeData.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Years in Operation</p>
                    <p className="mt-1 font-medium text-foreground">{smeData.yearsInOperation} years</p>
                  </div>
                  {smeData.registrationNo && (
                    <div>
                      <p className="text-sm text-foreground/60">Registration Number</p>
                      <p className="mt-1 font-medium text-foreground">{smeData.registrationNo}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Purpose of Loan</p>
                  <p className="mt-1 font-medium text-foreground">{smeData.purposeOfLoan}</p>
                </div>
                {smeData.estimatedMonthlyTurnover && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Monthly Turnover</p>
                      <p className="mt-1 font-medium text-foreground">
                        {formatAmount(smeData.estimatedMonthlyTurnover || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Monthly Profit</p>
                      <p className="mt-1 font-medium text-foreground">
                        {formatAmount(smeData.estimatedMonthlyProfit || 0)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payroll-specific Details */}
          {!isSME && payrollData && (
            <div className="bento-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <User className="h-5 w-5" />
                Employment Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Employer</p>
                    <p className="mt-1 font-medium text-foreground">{payrollData.employerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Job Title</p>
                    <p className="mt-1 font-medium text-foreground">{payrollData.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Employee Number</p>
                    <p className="mt-1 font-medium text-foreground">{payrollData.employeeNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Date of Employment</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatDate(payrollData.dateOfEmployment || null)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Gross Salary</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatAmount(payrollData.grossMonthlySalary || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Net Salary</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatAmount(payrollData.netMonthlySalary || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bento-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
              <FileText className="h-5 w-5" />
              Documents ({app.documents?.length || 0})
            </h2>
            {app.documents && app.documents.length > 0 ? (
              <div className="space-y-2">
                {app.documents.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-foreground">{doc.fileName}</p>
                        <p className="text-sm text-foreground/60">
                          {doc.documentType} • Uploaded {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setViewerIndex(idx);
                          setIsViewerOpen(true);
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        View
                      </button>
                      <a
                        href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `${API_BASE_URL}${doc.fileUrl}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-3 h-12 w-12 text-foreground/20" />
                <p className="text-foreground/60">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>
        {isViewerOpen && app.documents && (
          <DocumentViewer
            documents={app.documents.map(d => ({ id: d.id, name: d.fileName, fileUrl: d.fileUrl, documentType: d.documentType }))}
            initialIndex={viewerIndex}
            onClose={() => setIsViewerOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bento-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Calendar className="h-5 w-5" />
              Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-primary-500" />
                  <div className="h-full w-0.5 bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium text-foreground">Created</p>
                  <p className="text-sm text-foreground/60">{formatDate(app.createdAt)}</p>
                </div>
              </div>
              {app.submittedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary-500" />
                    {app.status !== 'SUBMITTED' && <div className="h-full w-0.5 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-foreground">Submitted</p>
                    <p className="text-sm text-foreground/60">{formatDate(app.submittedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Delete Application?</h3>
                <p className="mt-1 text-sm text-foreground/60">
                  This action cannot be undone. The application and all associated documents will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}