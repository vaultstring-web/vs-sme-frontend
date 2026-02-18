'use client';

import { useAuth } from '@/hooks/useAuth';
import AdminKPIWidgets from '@/components/admin/dashboard/AdminKPIWidgets';
import AdminRecentApplications from '@/components/admin/dashboard/AdminRecentApplications';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-foreground/60">
          Welcome back, <span className="font-semibold text-primary-600 dark:text-primary-400">{user?.fullName}</span>. Here's what's happening today.
        </p>
      </div>

      {/* Quick Stats */}
      <AdminKPIWidgets />

      {/* Recent Applications Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent Applications</h2>
        </div>
        <AdminRecentApplications />
      </div>
    </div>
  );
}
