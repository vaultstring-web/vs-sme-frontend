//src/hooks/usePermission.ts

import { useAuth } from './useAuth';
import { Permission } from '@/types/api';

export const usePermission = () => {
    const auth = useAuth();

    return {
        // Check if user has a specific permission
        can: (permission: Permission): boolean => {
            return auth.hasPermission(permission);
        },

        // Check if user has any of the permissions
        canAny: (permissions: Permission[]): boolean => {
            return auth.hasAnyPermission(permissions);
        },

        // Check if user has all permissions
        canAll: (permissions: Permission[]): boolean => {
            return auth.hasAllPermissions(permissions);
        },

        // Role checks
        isSuperAdmin: auth.isSuperAdmin,
        isLoanManager: auth.isLoanManager,
        isAccountant: auth.isAccountant,
        isLoanOfficer: auth.isLoanOfficer,
        isAuditor: auth.isAuditor,
        isApplicant: auth.user?.role === 'APPLICANT',
    };
};
