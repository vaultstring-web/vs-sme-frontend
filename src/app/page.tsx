// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // 🛡️ Role-based redirection
        const isAdmin = user.role === 'ADMIN_TIER1' || user.role === 'ADMIN_TIER2' || user.role === 'AUDITOR';
        router.replace(isAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        // Not authenticated – go to dashboard (which will likely redirect to login)
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show a loading spinner while determining auth state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );
}