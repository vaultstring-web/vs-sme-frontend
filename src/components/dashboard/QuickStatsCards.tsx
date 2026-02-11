'use client';

import { FileText, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DashboardStats } from '@/app/dashboard/types';

interface QuickStatsCardsProps {
  stats: DashboardStats;
}

export default function QuickStatsCards({ stats }: QuickStatsCardsProps) {
  // Find the most recent draft for the "Continue" link
  // This would ideally come from a prop, but for simplicity we'll assume
  // the parent passes the latest draft ID or we compute it here.
  // We'll add a placeholder - parent can pass it or we fetch again.
  // For now, we'll just disable the button if no drafts.

  const hasDrafts = stats.draftCount > 0;
  // In a real implementation, you would pass the latest draft ID from the parent
  const latestDraftId = 'latest-draft-id'; // placeholder

  const cards = [
    {
      title: 'Draft Applications',
      count: stats.draftCount,
      badge: 'In Progress',
      icon: FileText,
      color: 'blue',
      href: hasDrafts ? `/dashboard/applications/${latestDraftId}` : undefined,
    },
    {
      title: 'In Review',
      count: stats.submittedCount + stats.underReviewCount,
      badge: 'Under Review',
      icon: Clock,
      color: 'yellow',
      href: '/dashboard/applications?status=SUBMITTED,UNDER_REVIEW',
    },
    {
      title: 'Approved',
      count: stats.approvedCount,
      badge: `MWK ${stats.totalDisbursed.toLocaleString()}`,
      icon: CheckCircle2,
      color: 'green',
      href: '/dashboard/applications?status=APPROVED,DISBURSED,REPAYED',
    },
    {
      title: 'Rejected',
      count: stats.rejectedCount,
      badge: 'Declined',
      icon: XCircle,
      color: 'red',
      href: '/dashboard/applications?status=REJECTED',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bento-card p-5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-current opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">{card.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold">
                    {card.count}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full bg-${card.color}-50 dark:bg-${card.color}-900/30 text-${card.color}-600 dark:text-${card.color}-400`}
                  >
                    {card.badge}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}-50 dark:bg-${card.color}-900/20`}>
                <Icon className={`w-5 h-5 text-${card.color}-500`} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                {card.href ? (
                  <Link
                    href={card.href}
                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    {card.title === 'Draft Applications' ? 'Continue' : 'View All'}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-foreground/40">No drafts</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}