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
      formatter: (val: number) => val.toString(),
      decoClass: 'text-blue-500/10',
      iconWrapClass:
        'rounded-xl bg-blue-50 p-2 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/40 sm:p-3',
      barTrack: 'bg-blue-500/20',
      barFill: 'bg-blue-500',
    },
    {
      title: 'Pending Review',
      count: pendingCount,
      icon: Clock,
      formatter: (val: number) => val.toString(),
      decoClass: 'text-yellow-500/10',
      iconWrapClass:
        'rounded-xl bg-yellow-50 p-2 text-yellow-700 ring-1 ring-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:ring-yellow-900/40 sm:p-3',
      barTrack: 'bg-yellow-500/20',
      barFill: 'bg-yellow-500',
    },
    {
      title: 'Approved',
      count: stats.approved,
      icon: CheckCircle2,
      formatter: (val: number) => val.toString(),
      decoClass: 'text-green-500/10',
      iconWrapClass:
        'rounded-xl bg-green-50 p-2 text-green-700 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-900/40 sm:p-3',
      barTrack: 'bg-green-500/20',
      barFill: 'bg-green-500',
    },
    {
      title: 'Approval Rate',
      count: stats.approvalRate,
      icon: BarChart3,
      formatter: (val: number) => `${(val * 100).toFixed(1)}%`,
      decoClass: 'text-purple-500/10',
      iconWrapClass:
        'rounded-xl bg-purple-50 p-2 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-900/40 sm:p-3',
      barTrack: 'bg-purple-500/20',
      barFill: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary-200 dark:hover:border-primary-800"
          >
            {/* Background Decoration */}
            <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-current transition-transform duration-500 group-hover:scale-110 ${card.decoClass}`} />
            
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-2 text-sm font-medium text-foreground/60">{card.title}</p>
                <h3 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                  {card.formatter(card.count)}
                </h3>
              </div>
              
              <div className={card.iconWrapClass}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>

            <div className="relative z-10 mt-4 flex items-center gap-2">
               <div className={`h-1 w-12 rounded-full ${card.barTrack}`}>
                 <div className={`h-full w-2/3 rounded-full ${card.barFill}`} />
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
