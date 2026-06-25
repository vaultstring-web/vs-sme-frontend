'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { useAuth } from '@/hooks/useAuth';
import {
  Search, Eye, Banknote, User as UserIcon, Plus, Download,
  FileSpreadsheet, FileText, X,
  ClipboardList,
  Trash2,
  CheckCircle2, Bell, BellRing, Send,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import RecordPaymentModal from './RecordPaymentModal';
import ResponsiveTable from '@/components/ui/ResponsiveTable';
import apiClient from '@/lib/apiClient';

// ── Types ─────────────────────────────────────────────────────────────────────
type DownloadFormat = 'excel' | 'pdf';
type DownloadScope = 'single' | 'all';

interface DownloadTarget {
  scope: DownloadScope;
  loanId?: string;
}

interface Loan {
  id: string;
  totalPrincipal: number;
  interestRate: number;
  remainingBalance: number;
  totalRepayable: number;
  status: string;
  dueDate?: string;
  user?: { fullName: string };
  application?: { type: string; id: string };
}

// ── Download helpers ──────────────────────────────────────────────────────────
function buildRows(loans: Loan[]) {
  return loans.map((loan) => ({
    'Loan ID': loan.id,
    Borrower: loan.user?.fullName ?? '—',
    'Principal (MWK)': loan.totalPrincipal,
    'Interest Rate': `${loan.interestRate * 100}% / month`,
    Type: loan.application?.type ?? '—',
    'Remaining Balance (MWK)': loan.remainingBalance,
    'Total Repayable (MWK)': loan.totalRepayable,
    'Due Date': loan.dueDate ?? '—',
    Status: loan.status,
  }));
}

function downloadCSV(rows: Record<string, string | number>[], filename: string) {
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPDF(rows: Record<string, string | number>[], filename: string, title: string) {
  const headers = Object.keys(rows[0]);
  const tableRows = rows
    .map(
      (r) =>
        `<tr>${headers
          .map((h) => `<td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:11px;">${r[h]}</td>`)
          .join('')}</tr>`
    )
    .join('');
  const html = `<!DOCTYPE html><html><head><title>${title}</title>
    <style>body{font-family:Inter,sans-serif;padding:32px;color:#1a202c;}
    h1{font-size:18px;font-weight:700;margin-bottom:4px;}
    p{font-size:11px;color:#718096;margin-bottom:20px;}
    table{width:100%;border-collapse:collapse;}
    th{background:#f7fafc;padding:8px 10px;text-align:left;font-size:10px;font-weight:700;
       text-transform:uppercase;letter-spacing:.05em;border:1px solid #e2e8f0;color:#4a5568;}
    tr:nth-child(even) td{background:#f7fafc;}
    @media print{body{padding:0;}}</style>
    </head><body>
    <h1>${title}</h1><p>Generated ${new Date().toLocaleString()}</p>
    <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${tableRows}</tbody></table></body></html>`;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

// ── Inline format picker ──────────────────────────────────────────────────────
function InlineFormatPicker({
  onSelect, onClose, align = 'right',
}: {
  onSelect: (fmt: DownloadFormat) => void;
  onClose: () => void;
  align?: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} className={`absolute top-full mt-2 z-50 w-52 rounded-xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground/40">Download as</p>
        <button onClick={onClose} className="text-foreground/30 hover:text-foreground/60 transition-colors"><X size={13} /></button>
      </div>
      <div className="p-2 space-y-1">
        <button onClick={() => onSelect('excel')} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
            <FileSpreadsheet size={16} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Excel / CSV</p>
            <p className="text-[10px] text-foreground/40">Opens in spreadsheet apps</p>
          </div>
        </button>
        <button onClick={() => onSelect('pdf')} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <FileText size={16} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">PDF</p>
            <p className="text-[10px] text-foreground/40">Print-ready document</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ── Single loan download modal ────────────────────────────────────────────────
function SingleDownloadModal({ loan, onSelect, onClose }: {
  loan: Loan;
  onSelect: (fmt: DownloadFormat) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground">Download Loan Record</h3>
            <p className="text-[11px] text-foreground/40 mt-0.5 font-mono uppercase">
              {loan.user?.fullName ?? '—'} · {loan.id.slice(0, 8)}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/30 hover:text-foreground/60 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-zinc-900/50 border-b border-border">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-1">Principal</p>
              <p className="text-sm font-bold text-foreground">MWK {loan.totalPrincipal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-1">Balance</p>
              <p className="text-sm font-bold text-primary-600 dark:text-primary-400">MWK {loan.remainingBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-1">Type</p>
              <p className="text-sm font-semibold text-foreground">{loan.application?.type ?? '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-1">Status</p>
              <p className="text-sm font-semibold text-foreground">{loan.status}</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 px-1 mb-3">Choose format</p>
          <button onClick={() => onSelect('excel')} className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border border-border hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all text-left group">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileSpreadsheet size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Excel / CSV</p>
              <p className="text-[11px] text-foreground/40 mt-0.5">Opens in Excel, Numbers, or Google Sheets</p>
            </div>
          </button>
          <button onClick={() => onSelect('pdf')} className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border border-border hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-left group">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">PDF</p>
              <p className="text-[11px] text-foreground/40 mt-0.5">Print-ready document via browser dialog</p>
            </div>
          </button>
        </div>
        <div className="px-4 pb-4">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold text-foreground/40 hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile loan card ──────────────────────────────────────────────────────────
function MobileLoanCard({
  loan,
  isAuditor,
  setActivePicker,
  setPaymentLoanId,
  getStatusColor,
}: {
  loan: Loan;
  isAuditor: boolean;
  setActivePicker: (t: DownloadTarget | null) => void;
  setPaymentLoanId: (id: string | null) => void;
  getStatusColor: (s: string) => string;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-border p-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-foreground">{loan.user?.fullName}</p>
          <p className="break-words text-[10px] font-mono uppercase text-foreground/40">{loan.id.slice(0, 8)}</p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <Link
            href={`/admin/loans/${loan.id}`}
            className="rounded-lg bg-slate-100 p-2 text-foreground/60 transition-colors hover:text-primary-600 dark:bg-zinc-800"
            title="View Details"
          >
            <Eye size={18} />
          </Link>
          <button
            type="button"
            onClick={() => setActivePicker({ scope: 'single', loanId: loan.id })}
            className="rounded-lg bg-slate-100 dark:bg-zinc-800 p-2 text-foreground/60 hover:text-primary-600 transition-colors"
            title="Download"
          >
            <Download size={18} />
          </button>
          {!isAuditor && loan.status !== 'REPAYED' && (
            <button
              type="button"
              onClick={() => setPaymentLoanId(loan.id)}
              className="rounded-lg bg-primary-50 p-2 text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400"
              title="Record Payment"
            >
              <Banknote size={18} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm font-bold">MWK {loan.totalPrincipal.toLocaleString()}</p>
      <p className="break-words text-[10px] font-bold uppercase tracking-widest text-foreground/40">
        {loan.interestRate * 100}% per month • {loan.application?.type}
      </p>
      <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
        Balance MWK {loan.remainingBalance.toLocaleString()}
      </p>
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(loan.status)}`}>
        {loan.status}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminLoansTable() {
  const { loans, isLoading, fetchAllLoans } = useLoans();
  const { user: currentUser } = useAuth();
  const isAuditor = currentUser?.role === 'AUDITOR';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentLoanId, setPaymentLoanId] = useState<string | null>(null);
  const [activePicker, setActivePicker] = useState<DownloadTarget | null>(null);

  useEffect(() => {
    fetchAllLoans({ status });
  }, [fetchAllLoans, status]);

  const filteredLoans = (loans as Loan[]).filter(
    (loan) =>
      loan.user?.fullName.toLowerCase().includes(search.toLowerCase()) ||
      loan.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'ACTIVE':    return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'REPAYED':   return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'DEFAULTED': return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:          return 'bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  const activeSingleLoan = activePicker?.scope === 'single' && activePicker.loanId
    ? filteredLoans.find((l) => l.id === activePicker.loanId) ?? null
    : null;

  const handleDownload = (fmt: DownloadFormat) => {
    if (!activePicker) return;
    if (activePicker.scope === 'all') {
      const rows = buildRows(filteredLoans);
      if (!rows.length) return;
      if (fmt === 'excel') {
        downloadCSV(rows, 'thrive-loans-all');
      } else {
        downloadPDF(rows, 'thrive-loans-all', 'Thrive Microfinance — All Loans');
      }
    } else if (activePicker.scope === 'single' && activePicker.loanId) {
      const loan = filteredLoans.find((l) => l.id === activePicker.loanId);
      if (!loan) return;
      const rows = buildRows([loan]);
      const name = loan.user?.fullName?.replace(/\s+/g, '-').toLowerCase() ?? loan.id.slice(0, 8);
      if (fmt === 'excel') {
        downloadCSV(rows, `loan-${name}`);
      } else {
        downloadPDF(rows, `loan-${name}`, `Loan — ${loan.user?.fullName ?? loan.id.slice(0, 8)}`);
      }
    }
    setActivePicker(null);
  };

  return (
    <div className="space-y-6">
      {activeSingleLoan && (
        <SingleDownloadModal loan={activeSingleLoan} onSelect={handleDownload} onClose={() => setActivePicker(null)} />
      )}

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
          <div className="md:col-span-3 flex gap-2">
            <Link
              href="/admin/applications?status=APPROVED"
              className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-primary-500/20"
            >
              <Plus size={18} />
              New Disbursement
            </Link>
            <div className="relative">
              <button
                onClick={() => setActivePicker(activePicker?.scope === 'all' ? null : { scope: 'all' })}
                title="Download all loans"
                className="flex items-center justify-center w-10 h-full rounded-xl border border-border bg-card hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-foreground/60 hover:text-foreground"
              >
                <Download size={17} />
              </button>
              {activePicker?.scope === 'all' && (
                <InlineFormatPicker onSelect={handleDownload} onClose={() => setActivePicker(null)} align="right" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bento-card overflow-hidden">
        <ResponsiveTable
          mobileCards={
            <div className="space-y-3">
              {isLoading ? (
                <div className="p-6 text-center text-foreground/40">Loading loans...</div>
              ) : filteredLoans.length === 0 ? (
                <div className="p-6 text-center text-foreground/40">No loans found.</div>
              ) : (
                filteredLoans.map((loan) => (
                  <MobileLoanCard
                    key={loan.id}
                    loan={loan}
                    isAuditor={isAuditor}
                    setActivePicker={setActivePicker}
                    setPaymentLoanId={setPaymentLoanId}
                    getStatusColor={getStatusColor}
                  />
                ))
              )}
            </div>
          }
          table={
            <table className="hidden w-full min-w-[760px] text-left md:table">
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
                      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
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
                          <p className="break-words text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                            {loan.interestRate * 100}% per month • {loan.application?.type}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                            MWK {loan.remainingBalance.toLocaleString()}
                          </p>
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
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link
                            href={`/admin/loans/${loan.id}`}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-foreground/60 hover:text-primary-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setActivePicker({ scope: 'single', loanId: loan.id })}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-foreground/60 hover:text-primary-600 transition-colors"
                            title="Download"
                          >
                            <Download size={18} />
                          </button>
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
          }
        />
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