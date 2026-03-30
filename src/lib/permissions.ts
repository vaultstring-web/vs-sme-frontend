import { Role, Permission } from '@/types/api';

/**
 * Role-to-Permissions Mapping
 * Each role has the MINIMUM permissions needed
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    // Applications
    'applications:view:all',
    'applications:approve',
    'applications:reject',
    'applications:edit:documents',
    'applications:request:documents',
    
    // Loans
    'loans:view:all',
    'loans:disburse',
    'loans:authorize:disbursement',
    'loans:restructure',
    'loans:write_off',
    
    // Payments
    'payments:view:all',
    
    // Documents
    'documents:verify',
    
    // Admin
    'users:manage',
    'users:change:role',
    'audit:view',
    'system:configure',
  ],
  
  LOAN_MANAGER: [
    // Applications
    'applications:view:all',
    'applications:recommend:approve',
    'applications:recommend:reject',
    'applications:request:documents',
    
    // Loans
    'loans:view:all',
    
    // Documents
    'documents:verify',
  ],
  
  ACCOUNTANT: [
    // Loans
    'loans:view:all',
    
    // Payments
    'payments:record',
    'payments:edit',
    'payments:reverse',
    'payments:view:all',
    
    // Audit
    'audit:view',
  ],
  
  LOAN_OFFICER: [
    // Applications (own only)
    'applications:view:own',
    
    // Loans (assigned)
    'loans:view:own',
    
    // Payments (view own)
    'payments:view:own',
    
    // Documents
    'documents:upload',
  ],
  
  AUDITOR: [
    // Applications
    'applications:view:all',
    
    // Loans
    'loans:view:all',
    
    // Payments
    'payments:view:all',
    
    // Audit
    'audit:view',
  ],
  
  APPLICANT: [
    // Applications (own)
    'applications:view:own',
    
    // Loans (own)
    'loans:view:own',
    
    // Payments (own)
    'payments:view:own',
    
    // Documents
    'documents:upload',
  ],
};

/**
 * Helper function to get user permissions
 */
export function getUserPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Helper function to check if user has permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Helper function to check if user has any of the permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  const userPermissions = ROLE_PERMISSIONS[role];
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * Helper function to check if user has all permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  const userPermissions = ROLE_PERMISSIONS[role];
  return permissions.every(p => userPermissions.includes(p));
}

/**
 * Role display names
 */
export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  LOAN_MANAGER: 'Loan Manager',
  ACCOUNTANT: 'Accountant',
  LOAN_OFFICER: 'Loan Officer',
  AUDITOR: 'Auditor',
  APPLICANT: 'Applicant',
};

/**
 * Role descriptions
 */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: 'Full system access and approval authority',
  LOAN_MANAGER: 'Reviews and recommends loan applications',
  ACCOUNTANT: 'Records payments and maintains financial records',
  LOAN_OFFICER: 'Manages disbursement and borrower relations',
  AUDITOR: 'Views audit logs and compliance reports',
  APPLICANT: 'Submits loan applications and views own data',
};
