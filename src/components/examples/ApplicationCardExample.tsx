/**
 * Example: Complete Application Card Component with RBAC
 * 
 * This example demonstrates all aspects of the RBAC system:
 * - Hook usage (useAuth, usePermission)
 * - Conditional rendering (Can component)
 * - Role-based operations
 * - Permission-based button visibility
 */

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { Can } from '@/components/permissions';
import { Application } from '@/types/api';
import Button from '@/components/ui/Button';

interface ApplicationCardProps {
  application: Application;
  onApprove?: (appId: string) => Promise<void>;
  onReject?: (appId: string, reason: string) => Promise<void>;
}

/**
 * ApplicationCard Component
 * Shows application details with role-appropriate actions
 */
export function ApplicationCard({
  application,
  onApprove,
  onReject,
}: ApplicationCardProps) {
  const { user, isSuperAdmin } = useAuth();
  const permission = usePermission();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsLoading(true);
    try {
      await onApprove(application.id);
    } catch (error) {
      console.error('Failed to approve:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    setIsLoading(true);
    try {
      const reason = prompt('Please provide a rejection reason:');
      if (reason) {
        await onReject(application.id, reason);
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine badge color based on status
  const getStatusColor = () => {
    switch (application.status) {
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
      case 'APPROVED_FOR_DISBURSEMENT':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
      case 'LOAN_MANAGER_REJECTED':
        return 'bg-red-100 text-red-800';
      case 'LOAN_MANAGER_APPROVED':
        return 'bg-blue-100 text-blue-800';
      case 'DISBURSED':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header with Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {application.user?.fullName}
          </h3>
          <p className="text-sm text-gray-500">{application.user?.email}</p>
        </div>
        <div className={`${getStatusColor()} px-3 py-1 rounded-full text-xs font-semibold`}>
          {application.status}
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-2 mb-6 text-sm">
        <p>
          <span className="font-medium text-gray-700">Loan Amount:</span>{' '}
          <span className="text-gray-900">${application.amount?.toLocaleString()}</span>
        </p>
        <p>
          <span className="font-medium text-gray-700">Applied Date:</span>{' '}
          <span className="text-gray-900">
            {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </p>
      </div>

      {/* Loan Manager Assessment (visible only to loan managers) */}
      <Can permission="applications:recommend:approve">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Loan Manager Assessment</h4>
          {application.managerRiskScore !== null ? (
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-700">Risk Score:</span>{' '}
                <span className="font-semibold text-blue-900">{application.managerRiskScore}/100</span>
              </p>
              <p>
                <span className="text-gray-700">Recommendation:</span>{' '}
                <span className={`font-semibold ${
                  application.managerRecommended ? 'text-green-600' : 'text-red-600'
                }`}>
                  {application.managerRecommended ? 'Approved' : 'Rejected'}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 italic">No assessment yet</p>
          )}
        </div>
      </Can>

      {/* Super Admin Approval Info (only visible to super admin) */}
      <Can role="SUPER_ADMIN">
        <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-4">
          <h4 className="font-semibold text-purple-900 mb-2">Final Approval</h4>
          {application.approvedAt ? (
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-700">Approved By:</span>{' '}
                <span className="font-semibold">{application.approvedBy?.fullName}</span>
              </p>
              <p>
                <span className="text-gray-700">Date:</span>{' '}
                <span className="text-gray-900">
                  {new Date(application.approvedAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 italic">Pending final approval</p>
          )}
        </div>
      </Can>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        {/* Recommend/Approve - for Loan Managers */}
        <Can permission={['applications:recommend:approve']}>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {permission.isLoanManager ? 'Recommend Approval' : 'Approve'}
          </Button>
        </Can>

        {/* Reject - for Loan Managers and Super Admins */}
        <Can permission={['applications:reject', 'applications:recommend:reject']}>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Reject
          </Button>
        </Can>

        {/* Edit Documents - for authorized roles */}
        <Can permission="applications:edit:documents">
          <Button
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            Edit Documents
          </Button>
        </Can>

        {/* Final Authorization for Disbursement - Super Admin only */}
        <Can role="SUPER_ADMIN">
          {application.approvedAt && !application.disbursalAuthorizedAt && (
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Authorize Disbursement
            </Button>
          )}
        </Can>
      </div>

      {/* Additional Info Section (visible based on permissions) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Can 
          permission={['applications:view:all']}
          fallback={
            <p className="text-sm text-gray-500 italic">
              More details available to administrators
            </p>
          }
        >
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-700">Total Documents:</span>{' '}
              <span className="text-gray-900">
                {application.documents?.length || 0}
              </span>
            </p>
            {permission.isSuperAdmin && (
              <p>
                <span className="font-medium text-gray-700">User ID:</span>{' '}
                <span className="text-gray-900 font-mono text-xs">{application.userId}</span>
              </p>
            )}
          </div>
        </Can>
      </div>

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <summary className="cursor-pointer font-semibold">Debug Info</summary>
          <pre className="mt-2 overflow-auto bg-white p-2 rounded border border-gray-200">
            {JSON.stringify({
              userRole: user?.role,
              userPermissions: user?.permissions?.slice(0, 3), // Show first 3 permissions
              isSuperAdmin,
              hasApprovePerm: permission.can('applications:approve'),
              hasRejectPerm: permission.can('applications:reject'),
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Example: Application List with Permission-Based Filtering
 */
export function ApplicationList({ applications }: { applications: Application[] }) {
  const permission = usePermission();

  // Filter applications based on user role
  const visibleApplications = applications.filter(app => {
    if (permission.isSuperAdmin) {
      return true; // Super admins see all
    }
    if (permission.isLoanManager && (app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW')) {
      return true; // Loan managers see submitted/under review applications
    }
    if (permission.isLoanOfficer) {
      return true; // Loan officers see assigned applications
    }
    if (permission.isApplicant) {
      return app.userId === 'currentUserId'; // Applicants only see their own
    }
    return false;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications</h2>
        <Can permission="applications:view:all">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
            {visibleApplications.length} Total
          </div>
        </Can>
      </div>

      {visibleApplications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No applications to display</p>
      ) : (
        <div className="grid gap-4">
          {visibleApplications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
            />
          ))}
        </div>
      )}
    </div>
  );
}
