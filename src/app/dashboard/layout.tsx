// src/app/dashboard/layout.tsx
'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import HeaderSection from '@/components/dashboard/HeaderSection';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [applicationType, setApplicationType] = useState<'sme' | 'payroll'>('sme');
  const pathname = usePathname();
  
  // Check for both singular and plural application pages
  const isApplicationPage = 
    pathname === '/dashboard/application' || 
    pathname === '/dashboard/applications';

  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <div className="min-h-screen bg-background p-4 md:p-6">
          {/* Show header only on main dashboard, not on application pages */}
          {!isApplicationPage && (
            <HeaderSection 
              applicationType={applicationType}
              onTypeChange={setApplicationType}
            />
          )}
          
          <div className="mt-6">
            {children}
          </div>
        </div>
      </LayoutWrapper>
    </ProtectedRoute>
  );
}
