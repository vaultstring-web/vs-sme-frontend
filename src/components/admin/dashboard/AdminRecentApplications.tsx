'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import apiClient from '@/lib/apiClient';

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
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-foreground/50 uppercase bg-slate-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Applicant</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{app.user.fullName}</div>
                  <div className="text-xs text-foreground/50">{app.user.email}</div>
                </td>
                <td className="px-6 py-4 text-foreground/60">
                  {app.type === 'SME' ? 'SME Loan' : 'Payroll Loan'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50' : 
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50' : 
                      app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                    {app.status.replace('_', ' ').toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/admin/applications/detail?id=${app.id}`}
                    className="inline-flex items-center justify-center p-2 text-foreground/40 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
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
