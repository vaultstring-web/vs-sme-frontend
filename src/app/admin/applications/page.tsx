'use client';

import AdminApplicationTable from '@/components/admin/applications/AdminApplicationTable';

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Applications Management
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Review and manage loan applications.
        </p>
      </div>

      <AdminApplicationTable />
    </div>
  );
}
