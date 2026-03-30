/**
 * Route/Page Protection Component
 * Protects pages based on user role and permissions
 */

'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Permission, Role } from '@/types/api';
import { LoadingSpinner } from './LoadingSpinner';
import { getDashboardForRole } from '@/lib/roleRedirects';

interface ProtectedPageProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requiredRole?: Role[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, ANY permission
  fallback?: ReactNode;
}

/**
 * ProtectedPage Component
 * Wraps pages that require specific permissions/roles
 * 
 * @example
 * // Require any permission
 * <ProtectedPage requiredPermissions={['applications:view:all']}>
 *   <ApplicationsPage />
 * </ProtectedPage>
 * 
 * @example
 * // Require all permissions
 * <ProtectedPage 
 *   requiredPermissions={['loans:view:all', 'loans:disburse']}
 *   requireAll={true}
 * >
 *   <LoansPage />
 * </ProtectedPage>
 * 
 * @example
 * // Require specific role
 * <ProtectedPage requiredRole={['LOAN_MANAGER', 'SUPER_ADMIN']}>
 *   <LoanManagerPage />
 * </ProtectedPage>
 */
export function ProtectedPage({
  children,
  requiredPermissions,
  requiredRole,
  requireAll = false,
  fallback
}: ProtectedPageProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Still loading auth state
  if (isLoading) {
    return fallback || <DefaultLoadingFallback />;
  }

  // Not authenticated
  if (!user) {
    router.push('/auth/login');
    return fallback || <DefaultLoadingFallback />;
  }

  // Check role requirement
  if (requiredRole && !requiredRole.includes(user.role)) {
    return fallback || <DefaultUnauthorizedFallback />;
  }

  // Check permission requirements
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every(p => user.permissions.includes(p))
      : requiredPermissions.some(p => user.permissions.includes(p));

    if (!hasRequiredPermissions) {
      return fallback || <DefaultUnauthorizedFallback />;
    }
  }

  // All checks passed
  return <>{children}</>;
}

function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <LoadingSpinner size="lg" />
    </div>
  );
}

function DefaultUnauthorizedFallback() {
  const { user } = useAuth();
  const dashboardUrl = user?.role ? getDashboardForRole(user.role) : '/dashboard';
  
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-foreground/60 mb-6">
          You don&apos;t have permission to access this page.
        </p>
        <a
          href={dashboardUrl}
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

/**
 * Higher-order component for protecting pages
 * Used as a wrapper in app directory
 * 
 * @example
 * export default withProtectedPage(ApplicationsPage, {
 *   requiredPermissions: ['applications:view:all']
 * });
 */
export function withProtectedPage<P extends object>(
  Component: React.ComponentType<P>,
  {
    requiredPermissions,
    requiredRole,
    requireAll = false
  }: {
    requiredPermissions?: Permission[];
    requiredRole?: Role[];
    requireAll?: boolean;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedPage
        requiredPermissions={requiredPermissions}
        requiredRole={requiredRole}
        requireAll={requireAll}
      >
        <Component {...props} />
      </ProtectedPage>
    );
  };
}
