'use client';

import UserTable from '@/components/admin/users/UserTable';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          User Management
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage registered users and their roles.
        </p>
      </div>

      <UserTable />
    </div>
  );
}
