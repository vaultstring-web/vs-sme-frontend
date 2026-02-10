// src/components/dashboard/QuickStatsCards.tsx
import { FileText, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function QuickStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Draft */}
      <div className="bento-card p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-foreground/60 mb-2">Draft Applications</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-foreground">2</span>
              <span className="text-xs text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">In Progress</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">Last updated: Today</span>
            <button className="text-primary-600 hover:underline flex items-center gap-1">
              Continue <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Submitted */}
      <div className="bento-card p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-foreground/60 mb-2">Submitted</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-foreground">5</span>
              <span className="text-xs text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Under Review</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
            <Clock className="w-5 h-5 text-green-500" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">Avg. processing: 3 days</span>
            <button className="text-primary-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Approved */}
      <div className="bento-card p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-foreground/60 mb-2">Approved</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-foreground">3</span>
              <span className="text-xs text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">Active</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">Total disbursed: MWK 2.45M</span>
            <button className="text-primary-600 hover:underline flex items-center gap-1">
              Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
