'use client';

import { useState, useEffect } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  Eye, 
  Banknote,
  User as UserIcon,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import RecordPaymentModal from './RecordPaymentModal';

export default function AdminLoansTable() {
  const { loans, isLoading, fetchAllLoans } = useLoans();
  const { user: currentUser } = useAuth();
  const isAuditor = currentUser?.role === 'AUDITOR';
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentLoanId, setPaymentLoanId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllLoans({ status });
  }, [fetchAllLoans, status]);

  const filteredLoans = loans.filter(loan => 
    loan.user?.fullName.toLowerCase().includes(search.toLowerCase()) ||
    loan.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'REPAYED': return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'DEFAULTED': return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or loan ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary-500/20 outline-hidden transition-all text-sm"
          />
        </div>
        <div className="md:col-span-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary-500/20 outline-hidden transition-all text-sm"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="REPAYED">Repayed</option>
            <option value="DEFAULTED">Defaulted</option>
            <option value="RESTRUCTURED">Restructured</option>
          </select>
        </div>
        {!isAuditor && (
          <div className="md:col-span-3">
            <Link 
              href="/admin/applications?status=APPROVED"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-primary-500/20"
            >
              <Plus size={18} />
              New Disbursement
            </Link>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-slate-50/50 dark:bg-zinc-900/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/40">Borrower</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/40">Loan Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/40">Balance</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/40">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/40 italic">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading loans...
                  </td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/40 italic">
                    No loans found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-primary-600">
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{loan.user?.fullName}</p>
                          <p className="text-[10px] text-foreground/40 font-mono uppercase">{loan.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">MWK {loan.totalPrincipal.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                          {loan.interestRate * 100}% APR • {loan.application?.type}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-primary-600 dark:text-primary-400">MWK {loan.remainingBalance.toLocaleString()}</p>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500" 
                            style={{ width: `${Math.round(((loan.totalRepayable - loan.remainingBalance) / loan.totalRepayable) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/loans/${loan.id}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-foreground/60 hover:text-primary-600 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        {!isAuditor && loan.status !== 'REPAYED' && (
                          <button
                            onClick={() => setPaymentLoanId(loan.id)}
                            className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 transition-colors"
                            title="Record Payment"
                          >
                            <Banknote size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paymentLoanId && (
        <RecordPaymentModal
          isOpen={!!paymentLoanId}
          onClose={() => setPaymentLoanId(null)}
          loanId={paymentLoanId}
          onSuccess={() => fetchAllLoans({ status })}
        />
      )}
    </div>
  );
}
