'use client';

import AdminLoansTable from '@/components/admin/loans/AdminLoansTable';
import { Wallet } from 'lucide-react';

export default function AdminLoansPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
          <Wallet className="w-10 h-10 text-primary-600" />
          Loan Management
        </h1>
        <p className="text-foreground/60 font-medium">
          Monitor active loans, track repayment progress, and manage disbursements across the platform.
        </p>
      </div>

      <AdminLoansTable />
    </div>
  );
}
