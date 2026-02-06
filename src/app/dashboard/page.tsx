// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import HeaderSection from '@/components/dashboard/HeaderSection';
import QuickStatsCards from '@/components/dashboard/QuickStatsCards';
import ApplicationInsights from '@/components/dashboard/ApplicationInsights';
import QuickActions from '@/components/dashboard/QuickActions';
import UpcomingPayment from '@/components/dashboard/UpcomingPayment';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const [applicationType, setApplicationType] = useState<'sme' | 'payroll'>('sme');

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <HeaderSection 
        applicationType={applicationType}
        onTypeChange={setApplicationType}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <QuickStatsCards />
          <ApplicationInsights />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <UpcomingPayment />
        </div>
      </div>

      {/* Full-width Recent Activity */}
      <RecentActivity />
    </div>
  );
}