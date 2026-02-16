'use client';

import { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface AdminStats {
  total: number;
  approved: number;
  approvalRate: number;
  byType: any[]; // or specific type
  byStatus: any[]; // or specific type
}

export default function AdminKPIWidgets() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
            ))}
        </div>
    );
  }

  if (!stats) return null;

  const getCountByStatus = (statusList: string[]) => {
    if (!stats.byStatus) return 0;
    return stats.byStatus
      .filter((item: any) => statusList.includes(item.status))
      .reduce((acc: number, item: any) => acc + item._count._all, 0);
  };

  const pendingCount = getCountByStatus(['SUBMITTED', 'UNDER_REVIEW']);
  
  const cards = [
    {
      title: 'Total Applications',
      count: stats.total,
      icon: FileText,
      color: 'blue',
      formatter: (val: number) => val.toString(),
    },
    {
      title: 'Pending Review',
      count: pendingCount,
      icon: Clock,
      color: 'yellow',
      formatter: (val: number) => val.toString(),
    },
    {
      title: 'Approved',
      count: stats.approved,
      icon: CheckCircle2,
      color: 'green',
      formatter: (val: number) => val.toString(),
    },
    {
      title: 'Approval Rate',
      count: stats.approvalRate,
      icon: BarChart3,
      color: 'purple',
      formatter: (val: number) => `${(val * 100).toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`bento-card p-5 relative overflow-hidden group hover:border-${card.color}-200 dark:hover:border-${card.color}-800 transition-colors`}
          >
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500`} />
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-foreground/60 mb-2">{card.title}</p>
                <h3 className="text-3xl font-bold tracking-tight">
                  {card.formatter(card.count)}
                </h3>
              </div>
              
              <div className={`p-3 rounded-xl bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-700 dark:text-${card.color}-400 ring-1 ring-${card.color}-200 dark:ring-${card.color}-900/40`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>

            {/* Optional: Add trend indicator or extra info here if needed */}
            <div className="mt-4 flex items-center gap-2">
               <div className={`h-1 w-12 rounded-full bg-${card.color}-500/20`}>
                 <div className={`h-full w-2/3 rounded-full bg-${card.color}-500`} />
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
