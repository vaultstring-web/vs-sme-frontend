'use client';

import { CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ActiveLoan } from '@/app/dashboard/types';

interface ActiveLoansCardProps {
  activeLoans: ActiveLoan[];
  totalAmount: number;
}

export default function ActiveLoansCard({ activeLoans, totalAmount }: ActiveLoansCardProps) {
  if (activeLoans.length === 0) {
    return (
      <div className="bento-card p-6 text-center">
        <CreditCard className="w-8 h-8 text-foreground/30 mx-auto mb-3" />
        <h3 className="font-medium mb-1">No Active Loans</h3>
        <p className="text-sm text-foreground/60">
          Your approved loans will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bento-card p-6">
      <h2 className="mb-4 flex flex-col gap-1 text-xl font-bold sm:flex-row sm:items-center sm:justify-between">
        <span>Active Loans</span>
        <span className="text-sm font-normal text-foreground/60">
          Total: MWK {totalAmount.toLocaleString()}
        </span>
      </h2>
      <div className="space-y-4">
        {activeLoans.map((loan) => (
          <Link
            key={loan.id}
            href={`/dashboard/applications/${loan.id}`}
            className="block p-4 rounded-xl hover:bg-card/80 transition-colors group"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">#{loan.reference}</span>
                  <span
                    className="status-chip"
                    data-status={loan.status.toLowerCase().replace('_', '-')}
                  >
                    {loan.status}
                  </span>
                </div>
                <p className="mt-1 break-words text-sm text-foreground/60">
                  {loan.type === 'SME' ? loan.businessName : (loan.applicantName || loan.employerName)}
                </p>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <p className="font-bold whitespace-nowrap text-primary-600 dark:text-primary-400">
                  MWK {loan.amount.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-foreground/40">
                  {loan.submittedAt
                    ? new Date(loan.submittedAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {activeLoans.length >= 3 && (
          <div className="pt-2 text-center">
            <Link
              href="/dashboard/applications?status=APPROVED,DISBURSED"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
            >
              View all active loans
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}