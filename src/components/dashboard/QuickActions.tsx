// src/components/dashboard/QuickActions.tsx
import { CreditCard, BarChart3, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="bento-card p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <Link 
          href="/dashboard/applications"
          className="w-full p-4 bg-gradient-to-r from-primary-500/10 to-primary-500/5 border border-primary-500/20 rounded-xl text-left hover:border-primary-500/40 transition-all group block"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">New Application</p>
              <p className="text-xs text-foreground/60">Start a new loan application</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/60" />
          </div>
        </Link>

        <button className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl text-left hover:border-blue-500/40 transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">View Reports</p>
              <p className="text-xs text-foreground/60">Analytics & insights</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/60" />
          </div>
        </button>

        <button className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl text-left hover:border-purple-500/40 transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Support Center</p>
              <p className="text-xs text-foreground/60">Get help & guidance</p>
            </div>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/60" />
          </div>
        </button>
      </div>
    </div>
  );
}
