'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import ResponsiveTable from '@/components/ui/ResponsiveTable';

interface Application {
  id: string;
  type: string;
  status: string;
  amount: number;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

export default function AdminRecentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await apiClient.get('/admin/applications?page=1&pageSize=5&sortBy=createdAt&sortOrder=desc');
        setApplications(response.data.data);
      } catch (error) {
        console.error('Failed to fetch recent applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (isLoading) {
    return (
      <div className="bento-card p-8 text-center text-foreground/50">
        Loading recent applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bento-card p-8 text-center text-foreground/50">
        No recent applications found.
      </div>
    );
  }

  return (
    <div className="bento-card overflow-hidden">
      <ResponsiveTable
        mobileCards={
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="space-y-2 rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{app.user.fullName}</p>
                    <p className="max-w-[220px] truncate text-xs text-foreground/50" title={app.user.email}>
                      {app.user.email}
                    </p>
                  </div>
                  <Link
                    href={`/admin/applications/detail?id=${app.id}`}
                    className="shrink-0 rounded-lg p-2 text-foreground/40 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
                <div className="text-xs text-foreground/60">{new Date(app.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-foreground/60">{app.type === 'SME' ? 'SME Loan' : 'Payroll Loan'}</div>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                    app.status === 'APPROVED'
                      ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400'
                      : app.status === 'REJECTED'
                        ? 'border-red-200 bg-red-100 text-red-800 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400'
                        : app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
                          ? 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800/50 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {app.status.replace('_', ' ').toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        }
        table={
        <table className="hidden w-full min-w-[700px] text-left text-sm md:table">
          <thead className="bg-slate-50 text-xs uppercase text-foreground/50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Applicant</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr key={app.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                <td className="px-6 py-4 text-foreground/60 sm:whitespace-nowrap">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{app.user.fullName}</div>
                  <div className="max-w-[220px] truncate text-xs text-foreground/50" title={app.user.email}>
                    {app.user.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground/60">
                  {app.type === 'SME' ? 'SME Loan' : 'Payroll Loan'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                    app.status === 'APPROVED' ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400' : 
                      app.status === 'REJECTED' ? 'border-red-200 bg-red-100 text-red-800 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400' : 
                      app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW' ? 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800/50 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {app.status.replace('_', ' ').toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-left md:text-right">
                  <Link 
                    href={`/admin/applications/detail?id=${app.id}`}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/40 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        }
      />
      
      <div className="px-6 py-4 border-t border-border bg-slate-50 dark:bg-zinc-800/30">
        <Link 
          href="/admin/applications"
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-center sm:justify-end gap-1"
        >
          View All Applications
        </Link>
      </div>
    </div>
  );
}
