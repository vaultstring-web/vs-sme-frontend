'use client';
import AdminLayoutWrapper from '@/components/layout/AdminLayoutWrapper';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN_TIER1', 'ADMIN_TIER2']}>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </ProtectedRoute>
  );
}
