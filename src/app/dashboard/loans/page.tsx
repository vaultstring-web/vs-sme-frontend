'use client';

import { useState } from 'react';
import MyLoansList from '@/components/dashboard/loans/MyLoansList';
import LoanDetails from '@/components/dashboard/loans/LoanDetails';
import LoanReminders from '@/components/dashboard/loans/LoanReminders';
import { Loan } from '@/types/api';
import { Wallet } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

export default function LoansPage() {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  return (
    <div className="space-y-8">
      {!selectedLoan ? (
        <>
          <PageHeader
            icon={<Wallet className="h-5 w-5" />}
            title="My Loans"
            subtitle="Manage your active loans, view repayment schedules, and track your payment history."
          />
          <LoanReminders />
          <MyLoansList onSelect={setSelectedLoan} />
        </>
      ) : (
        <LoanDetails 
          loanId={selectedLoan.id} 
          onBack={() => setSelectedLoan(null)} 
        />
      )}
    </div>
  );
}
