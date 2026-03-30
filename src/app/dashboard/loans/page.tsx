'use client';

import { useState } from 'react';
import MyLoansList from '@/components/dashboard/loans/MyLoansList';
import LoanDetails from '@/components/dashboard/loans/LoanDetails';
import LoanReminders from '@/components/dashboard/loans/LoanReminders';
import { Loan } from '@/types/api';
import { Wallet } from 'lucide-react';

export default function LoansPage() {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  return (
    <div className="space-y-8">
      {!selectedLoan ? (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Wallet className="w-10 h-10 text-primary-600" />
              My Loans
            </h1>
            <p className="text-foreground/60 font-medium">
              Manage your active loans, view repayment schedules, and track your payment history.
            </p>
          </div>
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
