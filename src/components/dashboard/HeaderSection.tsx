'use client';

import { User } from 'lucide-react';

interface HeaderSectionProps {
  user: {
    fullName?: string;
    email?: string;
  } | null;
  totalApplications: number;
  activeLoansCount: number;
}

export default function HeaderSection({
  user,
  totalApplications,
  activeLoansCount,
}: HeaderSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary-500/10 rounded-xl">
          <User className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-sm text-foreground/60">{user?.email || 'Loading...'}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-foreground/60">Total Applications</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {totalApplications}
          </p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-right">
          <p className="text-sm text-foreground/60">Active Loans</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {activeLoansCount}
          </p>
        </div>
      </div>
    </div>
  );
}