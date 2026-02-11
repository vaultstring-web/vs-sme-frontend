// src/app/dashboard/applications/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/useApplications';
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

const statusConfig = {
  APPROVED: { 
    label: "Approved", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
  DISBURSED: { 
    label: "Disbursed", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
  SUBMITTED: { 
    label: "Submitted", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
  },
  UNDER_REVIEW: { 
    label: "Under Review", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
  },
  DRAFT: { 
    label: "Draft", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: FileText,
  },
  REJECTED: { 
    label: "Rejected", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
  REPAYED: { 
    label: "Repaid", 
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    icon: CheckCircle2,
  },
  DEFAULTED: { 
    label: "Defaulted", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = typeof params?.id === 'string' ? params.id : null;

  const {
    currentApplication,
    isLoading,
    error,
    fetchApplicationById,
    submitApplication,
    deleteApplication,
    clearError,
  } = useApplications();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationById(applicationId);
    }
  }, [applicationId, fetchApplicationById]);

  const handleSubmit = async () => {
    if (!currentApplication) return;
    
    setIsSubmitting(true);
    try {
        await submitApplication(currentApplication.id);
        alert('Application submitted successfully!');
        // Use currentApplication.id instead of applicationId
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bento-card p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                Error Loading Application
              </h3>
              <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
              <div className="flex gap-3 mt-4">
                <button
                    onClick={() => applicationId && fetchApplicationById(applicationId)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                Try Again
                </button>
                <Link
                  href="/dashboard/applications"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
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

  if (!currentApplication) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bento-card p-6 text-center">
          <FileText className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Application Not Found
          </h3>
          <p className="text-foreground/60 mb-4">
            The application you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/dashboard/applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  const app = currentApplication;
  const StatusIcon = statusConfig[app.status].icon;
  const isSME = app.type === 'SME';
  const appData = isSME ? app.smeData : app.payrollData;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard/applications"
              className="p-2 hover:bg-card rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground/60" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isSME ? appData?.businessName : appData?.employerName}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-foreground/60 ml-14">
            <span>ID: {app.id.substring(0, 8).toUpperCase()}</span>
            <span>•</span>
            <span>{app.type} Application</span>
            <span>•</span>
            <span>Created {formatDate(app.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusIcon className="w-5 h-5" />
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[app.status].color}`}>
            {statusConfig[app.status].label}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {app.status === 'DRAFT' && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/dashboard/applications/${app.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Application
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}

      {/* Application Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loan Information */}
          <div className="bento-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Loan Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground/60">Loan Amount</p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {formatAmount(isSME ? appData?.loanAmount : appData?.loanAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Payback Period</p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {isSME ? appData?.paybackPeriodMonths : appData?.paybackPeriodMonths} months
                </p>
              </div>
              {isSME && (
                <>
                  <div>
                    <p className="text-sm text-foreground/60">Loan Product</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {appData?.loanProduct}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Repayment Method</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {appData?.repaymentMethod}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SME-specific Details */}
          {isSME && appData && (
            <div className="bento-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Business Type</p>
                    <p className="font-medium text-foreground mt-1">{appData.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Years in Operation</p>
                    <p className="font-medium text-foreground mt-1">{appData.yearsInOperation} years</p>
                  </div>
                  {appData.registrationNo && (
                    <div>
                      <p className="text-sm text-foreground/60">Registration Number</p>
                      <p className="font-medium text-foreground mt-1">{appData.registrationNo}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Purpose of Loan</p>
                  <p className="font-medium text-foreground mt-1">{appData.purposeOfLoan}</p>
                </div>
                {appData.estimatedMonthlyTurnover && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Monthly Turnover</p>
                      <p className="font-medium text-foreground mt-1">
                        {formatAmount(appData.estimatedMonthlyTurnover)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Monthly Profit</p>
                      <p className="font-medium text-foreground mt-1">
                        {formatAmount(appData.estimatedMonthlyProfit)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payroll-specific Details */}
          {!isSME && appData && (
            <div className="bento-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Employment Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Employer</p>
                    <p className="font-medium text-foreground mt-1">{appData.employerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Job Title</p>
                    <p className="font-medium text-foreground mt-1">{appData.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Employee Number</p>
                    <p className="font-medium text-foreground mt-1">{appData.employeeNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Date of Employment</p>
                    <p className="font-medium text-foreground mt-1">
                      {formatDate(appData.dateOfEmployment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Gross Salary</p>
                    <p className="font-medium text-foreground mt-1">
                      {formatAmount(appData.grossMonthlySalary)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Net Salary</p>
                    <p className="font-medium text-foreground mt-1">
                      {formatAmount(appData.netMonthlySalary)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bento-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documents ({app.documents?.length || 0})
            </h2>
            {app.documents && app.documents.length > 0 ? (
              <div className="space-y-2">
                {app.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-foreground">{doc.fileName}</p>
                        <p className="text-sm text-foreground/60">
                          {doc.documentType} • Uploaded {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
                <p className="text-foreground/60">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bento-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <div className="w-0.5 h-full bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium text-foreground">Created</p>
                  <p className="text-sm text-foreground/60">{formatDate(app.createdAt)}</p>
                </div>
              </div>
              {app.submittedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    {app.status !== 'SUBMITTED' && <div className="w-0.5 h-full bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-foreground">Submitted</p>
                    <p className="text-sm text-foreground/60">{formatDate(app.submittedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bento-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-foreground hover:bg-card/50 rounded-lg transition-colors">
                Print Application
              </button>
              <button className="w-full px-4 py-2 text-left text-foreground hover:bg-card/50 rounded-lg transition-colors">
                Download PDF
              </button>
              <button className="w-full px-4 py-2 text-left text-foreground hover:bg-card/50 rounded-lg transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 border border-border">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Delete Application?</h3>
                <p className="text-sm text-foreground/60 mt-1">
                  This action cannot be undone. The application and all associated documents will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
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