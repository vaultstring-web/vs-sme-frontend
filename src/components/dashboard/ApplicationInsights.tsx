'use client';

import { Building2, TrendingUp } from 'lucide-react';
import { DashboardStats } from '@/app/dashboard/types';
import Link from 'next/link';

interface ApplicationInsightsProps {
  stats: DashboardStats;
}

export default function ApplicationInsights({ stats }: ApplicationInsightsProps) {
  const total = stats.smeCount + stats.payrollCount;
  const smePercentage = total > 0 ? Math.round((stats.smeCount / total) * 100) : 0;
  const payrollPercentage = 100 - smePercentage;

  return (
    <div className="bento-card p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Application Insights</h2>
          <p className="text-sm text-foreground/60">Track your loan applications progress</p>
        </div>
        <Link
          href="/dashboard/applications"
          className="text-sm text-primary-600 hover:underline dark:text-primary-400"
        >
          View Analytics
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application Types */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Application Types
          </h3>
          {total === 0 ? (
            <p className="text-sm text-foreground/60">No applications yet</p>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 shrink-0 rounded-full bg-primary-500" />
                    <span className="text-sm">SME Working Capital</span>
                  </div>
                  <span className="font-semibold whitespace-nowrap">{smePercentage}%</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 shrink-0 rounded-full bg-blue-500" />
                    <span className="text-sm">Payroll Loans</span>
                  </div>
                  <span className="font-semibold whitespace-nowrap">{payrollPercentage}%</span>
                </div>
              </div>
              <div className="mt-4 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary-500 to-blue-500 rounded-full"
                  style={{ width: `${smePercentage}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Approval Rate */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Approval Rate
          </h3>
          <div className="flex flex-wrap items-end gap-2">
            <div className="text-3xl font-bold whitespace-nowrap">{stats.approvalRate}%</div>
            <div className="flex items-center text-sm text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              of submitted
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between sm:gap-2">
              <span>Approved / Submitted</span>
              <span className="font-medium whitespace-nowrap">
                {stats.approvedCount} / {stats.submittedCount + stats.underReviewCount + stats.approvedCount + stats.rejectedCount}
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${stats.approvalRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}