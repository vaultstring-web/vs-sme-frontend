// src/app/dashboard/layout.tsx
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <LayoutWrapper>
        <div>{children}</div>
      </LayoutWrapper>
    </ProtectedRoute>
  );
}