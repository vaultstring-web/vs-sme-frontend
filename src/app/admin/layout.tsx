'use client';
import AdminLayoutWrapper from '@/components/layout/AdminLayoutWrapper';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LOAN_MANAGER', 'ACCOUNTANT', 'LOAN_OFFICER', 'AUDITOR']}>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </ProtectedRoute>
  );
}
