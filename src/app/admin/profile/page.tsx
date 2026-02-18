'use client';

import PersonalInfo from '@/components/dashboard/profile/PersonalInfo';
import SecuritySettings from '@/components/dashboard/profile/SecuritySettings';

export default function AdminProfilePage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
          Admin Profile
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage your account settings and security preferences.
        </p>
      </div>

      <div className="space-y-8">
        <PersonalInfo />
        <SecuritySettings />
      </div>
    </div>
  );
}
