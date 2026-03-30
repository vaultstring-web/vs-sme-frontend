'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/utils/sessionStorage';
import { getDashboardForRole } from '@/lib/roleRedirects';
import { LoadingSpinner } from '@/components/LoadingSpinner';

/**
 * /me page - Landing page for authenticated users
 * Reads role from localStorage and redirects to appropriate dashboard
 */
export default function MePage() {
  const router = useRouter();

  useEffect(() => {
    const { user } = getSession();
    
    if (user?.role) {
      const dashboard = getDashboardForRole(user.role);
      router.push(dashboard);
    } else {
      // No user data, redirect to login
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <LoadingSpinner size="lg" />
    </div>
  );
}
