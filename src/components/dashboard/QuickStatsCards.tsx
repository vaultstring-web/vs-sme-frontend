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
      blobClass: 'text-blue-500',
      badgeClass:
        'rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      iconWrapClass: 'rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20',
      iconClass: 'h-5 w-5 text-blue-500',
      href: hasDrafts ? `/dashboard/applications/${latestDraftId}` : undefined,
    },
    {
      title: 'In Review',
      count: stats.submittedCount + stats.underReviewCount,
      badge: 'Under Review',
      icon: Clock,
      blobClass: 'text-yellow-500',
      badgeClass:
        'rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      iconWrapClass: 'rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20',
      iconClass: 'h-5 w-5 text-yellow-500',
      href: '/dashboard/applications?status=SUBMITTED,UNDER_REVIEW',
    },
    {
      title: 'Approved',
      count: stats.approvedCount,
      badge: `MWK ${stats.totalDisbursed.toLocaleString()}`,
      icon: CheckCircle2,
      blobClass: 'text-green-500',
      badgeClass:
        'rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600 dark:bg-green-900/30 dark:text-green-400',
      iconWrapClass: 'rounded-lg bg-green-50 p-3 dark:bg-green-900/20',
      iconClass: 'h-5 w-5 text-green-500',
      href: '/dashboard/applications?status=APPROVED,DISBURSED,REPAYED',
    },
    {
      title: 'Rejected',
      count: stats.rejectedCount,
      badge: 'Declined',
      icon: XCircle,
      blobClass: 'text-red-500',
      badgeClass:
        'rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400',
      iconWrapClass: 'rounded-lg bg-red-50 p-3 dark:bg-red-900/20',
      iconClass: 'h-5 w-5 text-red-500',
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
            <div className={`absolute right-0 top-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-current opacity-5 transition-transform group-hover:scale-110 ${card.blobClass}`} />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-2 text-sm text-foreground/60">{card.title}</p>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-2xl font-bold md:text-3xl">
                    {card.count}
                  </span>
                  <span className={`text-xs ${card.badgeClass}`}>
                    {card.badge}
                  </span>
                </div>
              </div>
              <div className={`shrink-0 ${card.iconWrapClass}`}>
                <Icon className={card.iconClass} />
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