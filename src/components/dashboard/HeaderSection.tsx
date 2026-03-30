'use client';

import { User, ShieldCheck } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* RBM Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-tighter leading-none">Licensed By</span>
            <span className="text-xs font-bold text-green-800 dark:text-green-300 leading-none mt-0.5">Reserve Bank of Malawi</span>
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
    </div>
  );
}