/**
 * Permission-based Conditional Rendering Component
 * Shows/hides content based on user permissions
 */

'use client';

import { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { Permission, Role } from '@/types/api';

interface CanProps {
  /** Required permission or array of permissions */
  permission?: Permission | Permission[];
  
  /** Required role or array of roles */
  role?: Role | Role[];
  
  /** If true, user must have ALL permissions (AND logic) */
  requireAll?: boolean;
  
  /** Content to show if permission check passes */
  children: ReactNode;
  
  /** Content to show if permission check fails (optional) */
  fallback?: ReactNode;
}

/**
 * Can Component - Conditional rendering based on permissions
 * 
 * @example
 * // Single permission
 * <Can permission="applications:approve">
 *   <button>Approve</button>
 * </Can>
 * 
 * @example
 * // Multiple permissions (OR logic - user needs ANY)
 * <Can permission={['applications:approve', 'applications:recommend:approve']}>
 *   <button>Recommend/Approve</button>
 * </Can>
 * 
 * @example
 * // Multiple permissions (AND logic - user needs ALL)
 * <Can permission={['loans:view:all', 'loans:disburse']} requireAll>
 *   <button>Disburse Loan</button>
 * </Can>
 * 
 * @example
 * // Role-based
 * <Can role="LOAN_MANAGER">
 *   <AdminPanel />
 * </Can>
 * 
 * @example
 * // With fallback
 * <Can permission="admin:delete" fallback={<span>No access</span>}>
 *   <button>Delete</button>
 * </Can>
 */
export function Can({
  permission,
  role,
  requireAll = false,
  children,
  fallback
}: CanProps) {
  const perms = usePermission();

  // Check role
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    const hasRole = roles.some(r => {
      switch (r) {
        case 'SUPER_ADMIN':
          return perms.isSuperAdmin;
        case 'LOAN_MANAGER':
          return perms.isLoanManager;
        case 'ACCOUNTANT':
          return perms.isAccountant;
        case 'LOAN_OFFICER':
          return perms.isLoanOfficer;
        case 'AUDITOR':
          return perms.isAuditor;
        case 'APPLICANT':
          return perms.isApplicant;
        default:
          return false;
      }
    });

    if (!hasRole) {
      return fallback || null;
    }
  }

  // Check permission
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = requireAll
      ? perms.canAll(permissions)
      : perms.canAny(permissions);

    if (!hasPermission) {
      return fallback || null;
    }
  }

  return <>{children}</>;
}

interface CannotProps {
  /** Required permission or array of permissions to NOT have */
  permission?: Permission | Permission[];
  
  /** Required role or array of roles to NOT have */
  role?: Role | Role[];
  
  /** Content to show if user does NOT have permission */
  children: ReactNode;
  
  /** Content to show if user DOES have permission (optional) */
  fallback?: ReactNode;
}

/**
 * Cannot Component - Conditional rendering when user lacks permissions
 * Inverse of Can component
 * 
 * @example
 * // Show only to non-admins
 * <Cannot role="SUPER_ADMIN">
 *   <p>You are not a super admin</p>
 * </Cannot>
 */
export function Cannot({
  permission,
  role,
  children,
  fallback
}: CannotProps) {
  const perms = usePermission();

  // Check role
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    const hasRole = roles.some(r => {
      switch (r) {
        case 'SUPER_ADMIN':
          return perms.isSuperAdmin;
        case 'LOAN_MANAGER':
          return perms.isLoanManager;
        case 'ACCOUNTANT':
          return perms.isAccountant;
        case 'LOAN_OFFICER':
          return perms.isLoanOfficer;
        case 'AUDITOR':
          return perms.isAuditor;
        case 'APPLICANT':
          return perms.isApplicant;
        default:
          return false;
      }
    });

    if (hasRole) {
      return fallback || null;
    }
  }

  // Check permission
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = permissions.some(p => perms.can(p));

    if (hasPermission) {
      return fallback || null;
    }
  }

  return <>{children}</>;
}
