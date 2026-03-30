/**
 * Role-based Redirect Helper
 * Determines the appropriate dashboard/page for each role
 */

import { Role } from '@/types/api';

/**
 * Get the default dashboard URL for a given role
 */
export function getDashboardForRole(role: Role | undefined): string {
  if (!role) return '/dashboard';

  switch (role) {
    // Admin roles
    case 'SUPER_ADMIN':
      return '/admin/dashboard';
    case 'AUDITOR':
      return '/admin/audit-logs';
    
    // Loan management role
    case 'LOAN_MANAGER':
      return '/admin/dashboard';
    
    // Accounting role
    case 'ACCOUNTANT':
      return '/admin/loans';
    
    // Loan officer role
    case 'LOAN_OFFICER':
      return '/admin/loans';
    
    // Applicant role (customer)
    case 'APPLICANT':
      return '/dashboard';
    
    // Default fallback
    default:
      return '/dashboard';
  }
}

/**
 * Determine if a role should see admin pages
 */
export function isAdminRole(role: Role | undefined): boolean {
  if (!role) return false;
  return ['SUPER_ADMIN', 'AUDITOR', 'LOAN_MANAGER', 'ACCOUNTANT'].includes(role);
}

/**
 * Resolve redirect URL based on requested path and user role
 * This ensures users can only access appropriate areas
 */
export function resolveRedirectUrl(
  requestedUrl: string | null | undefined,
  role: Role | undefined
): string {
  // No requested URL, use role-based default
  if (!requestedUrl) {
    return getDashboardForRole(role);
  }

  const isAdmin = isAdminRole(role);

  // Check if requested URL is an admin page
  const isAdminPath = requestedUrl.startsWith('/admin');

  // If non-admin user tries to access admin page, redirect to their dashboard
  if (!isAdmin && isAdminPath) {
    return getDashboardForRole(role);
  }

  // If admin user tries to access customer page, redirect to admin dashboard
  if (isAdmin && !isAdminPath && requestedUrl.startsWith('/dashboard')) {
    return getDashboardForRole(role);
  }

  // Otherwise, allow the requested URL
  return requestedUrl;
}
