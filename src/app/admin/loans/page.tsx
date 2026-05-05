'use client';

import AdminLoansTable from '@/components/admin/loans/AdminLoansTable';
import { Wallet } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

export default function AdminLoansPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        icon={<Wallet className="h-5 w-5" />}
        title="Loan Management"
        subtitle="Monitor active loans, track repayment progress, and manage disbursements across the platform."
      />

      <AdminLoansTable />
    </div>
  );
}
