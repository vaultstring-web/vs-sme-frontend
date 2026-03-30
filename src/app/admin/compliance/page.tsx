'use client';

import { useState, useEffect } from 'react';
import { useLoans } from '@/hooks/useLoans';
import { 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download,
  FileText,
  PieChart,
  BarChart3,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplianceReport {
  summary: {
    totalLoans: number;
    activeLoans: number;
    defaultedLoans: number;
    overdueSchedules: number;
    totalDisbursed: number;
    totalCollected: number;
  };
  timestamp: string;
}

export default function ComplianceReportPage() {
  const { fetchComplianceReport, isLoading } = useLoans();
  const [report, setReport] = useState<ComplianceReport | null>(null);

  useEffect(() => {
    fetchComplianceReport().then(setReport);
  }, [fetchComplianceReport]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Generating compliance report...</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-primary-600" />
            Compliance & Audit
          </h1>
          <p className="text-foreground/60 font-medium">
            System-wide loan performance monitoring and regulatory compliance reporting.
          </p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-xl transition-all font-bold text-sm shadow-lg"
          onClick={() => window.print()}
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bento-card p-6 border-l-4 border-l-blue-500">
          <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Total Disbursed</p>
          <h3 className="text-2xl font-black text-foreground">MWK {report.summary.totalDisbursed.toLocaleString()}</h3>
          <p className="text-xs text-foreground/50 font-medium mt-1">Across {report.summary.totalLoans} loans</p>
        </div>
        
        <div className="bento-card p-6 border-l-4 border-l-green-500">
          <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Total Collected</p>
          <h3 className="text-2xl font-black text-foreground">MWK {report.summary.totalCollected.toLocaleString()}</h3>
          <p className="text-xs text-green-600 font-bold mt-1">
            {Math.round((report.summary.totalCollected / report.summary.totalDisbursed) * 100) || 0}% Recovery Rate
          </p>
        </div>

        <div className="bento-card p-6 border-l-4 border-l-amber-500">
          <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Active Portfolios</p>
          <h3 className="text-2xl font-black text-foreground">{report.summary.activeLoans}</h3>
          <p className="text-xs text-foreground/50 font-medium mt-1">Current outstanding loans</p>
        </div>

        <div className="bento-card p-6 border-l-4 border-l-red-500">
          <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">Overdue Installments</p>
          <h3 className="text-2xl font-black text-foreground">{report.summary.overdueSchedules}</h3>
          <p className="text-xs text-red-600 font-bold mt-1">Requiring follow-up</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance Checklist */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary-600" />
            Compliance Checklist
          </h3>
          <div className="bento-card p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Audit Trail Integrity</p>
                <p className="text-xs text-foreground/50">All system modifications are logged with actor IDs and timestamps.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Disbursement Verification</p>
                <p className="text-xs text-foreground/50">Loans are only created from approved applications with verified data.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Default Management</p>
                <p className="text-xs text-foreground/50">System identifies LATE status after 24h past due date.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Methodology */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary-600" />
            Portfolio Performance
          </h3>
          <div className="bento-card p-8 flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96" cy="96" r="80"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-slate-100 dark:text-zinc-800"
                />
                <circle
                  cx="96" cy="96" r="80"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="20"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={2 * Math.PI * 80 * (1 - (report.summary.activeLoans / report.summary.totalLoans || 0))}
                  strokeLinecap="round"
                  className="text-primary-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-foreground">
                  {Math.round((report.summary.activeLoans / report.summary.totalLoans) * 100) || 0}%
                </span>
                <span className="text-[10px] font-bold text-foreground/40 uppercase">Active</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-6 w-full">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-foreground/40">
                  <span>Repayment Velocity</span>
                  <span className="text-foreground">MWK {Math.round(report.summary.totalCollected / 12).toLocaleString()}/mo avg</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[65%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-foreground/40">
                  <span>Risk Exposure</span>
                  <span className="text-foreground">
                    {Math.round((report.summary.overdueSchedules / report.summary.totalLoans) * 100) || 0}% Portfolio at Risk
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[12%]" />
                </div>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    <span className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">Active</span>
                  </div>
                  <p className="text-xl font-black text-foreground">{report.summary.activeLoans}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">Default</span>
                  </div>
                  <p className="text-xl font-black text-foreground">{report.summary.defaultedLoans}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
