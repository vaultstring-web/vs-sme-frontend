// src/app/dashboard/page.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import HeaderSection from '@/components/dashboard/HeaderSection';
import QuickStatsCards from '@/components/dashboard/QuickStatsCards';
import ApplicationInsights from '@/components/dashboard/ApplicationInsights';
import ActiveLoansCard from '@/components/dashboard/ActiveLoansCard';
import RecentApplicationsTable from '@/components/dashboard/RecentApplicationsTable';
import type { DashboardStats, ActiveLoan, RecentApplication } from './types';


export default function DashboardPage() {
  const { applications, isLoading, error, fetchApplications } = useApplications();
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications({ limit: 100 }); // get enough for meaningful stats
  }, [fetchApplications]);

  const stats = useMemo<DashboardStats>(() => {
    const draft = applications.filter(a => a.status === 'DRAFT');
    const submitted = applications.filter(a => a.status === 'SUBMITTED');
    const underReview = applications.filter(a => a.status === 'UNDER_REVIEW');
    const approved = applications.filter(a =>
      ['APPROVED', 'DISBURSED', 'REPAYED'].includes(a.status)
    );
    const rejected = applications.filter(a => a.status === 'REJECTED');
    const defaulted = applications.filter(a => a.status === 'DEFAULTED');

    const smeCount = applications.filter(a => a.type === 'SME').length;
    const payrollCount = applications.filter(a => a.type === 'PAYROLL').length;

    const totalDisbursed = approved.reduce((sum, app) => {
      const amount = app.smeData?.loanAmount ?? app.payrollData?.loanAmount ?? 0;
      return sum + amount;
    }, 0);

    const submittedOrBeyond = submitted.length + underReview.length + approved.length + rejected.length;
    const approvalRate = submittedOrBeyond > 0
      ? Math.round((approved.length / submittedOrBeyond) * 100)
      : 0;

    return {
      totalApplications: applications.length,
      draftCount: draft.length,
      submittedCount: submitted.length,
      underReviewCount: underReview.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      defaultedCount: defaulted.length,
      smeCount,
      payrollCount,
      totalDisbursed,
      approvalRate,
    };
  }, [applications]);

  const activeLoans = useMemo<ActiveLoan[]>(() => {
    return applications
      .filter(a => ['APPROVED', 'DISBURSED'].includes(a.status))
      .sort((a, b) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3)
      .map(app => ({
        id: app.id,
        reference: app.id.slice(-8).toUpperCase(), // short reference
        amount: app.smeData?.loanAmount ?? app.payrollData?.loanAmount ?? 0,
        status: app.status,
        submittedAt: app.submittedAt,
        type: app.type,
        employerName: app.payrollData?.employerName,
        businessName: app.smeData?.businessName,
      }));
  }, [applications]);

  const recentApplications = useMemo<RecentApplication[]>(() => {
    return applications
      .filter(a => a.submittedAt !== null) // only submitted ones
      .sort((a, b) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(app => ({
        id: app.id,
        reference: app.id.slice(-8).toUpperCase(),
        type: app.type,
        amount: app.smeData?.loanAmount ?? app.payrollData?.loanAmount ?? 0,
        status: app.status,
        submittedAt: app.submittedAt,
        createdAt: app.createdAt,
      }));
  }, [applications]);

  // Loading state
  if (isLoading && applications.length === 0) {
    return (
      <div className="space-y-6 md:space-y-8 animate-pulse">
        <div className="h-20 bg-card/50 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-card/50 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-card/50 rounded-2xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bento-card p-8 text-center">
        <p className="text-red-500 mb-4">Failed to load dashboard data</p>
        <button
          onClick={() => fetchApplications({ limit: 100 })}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <HeaderSection
        user={user}
        totalApplications={stats.totalApplications}
        activeLoansCount={activeLoans.length}
      />

      {/* Stats Cards */}
      <QuickStatsCards stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Insights */}
        <div className="lg:col-span-2 space-y-6">
          <ApplicationInsights stats={stats} />
        </div>
      </div>

      {/* Recent Applications Table */}
      <RecentApplicationsTable applications={recentApplications} />
    </div>
  );
}