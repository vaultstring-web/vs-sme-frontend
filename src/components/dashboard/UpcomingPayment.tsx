// src/app/dashboard/components/UpcomingPayment.tsx
import { Calendar } from 'lucide-react';

export default function UpcomingPayment() {
  return (
    <div className="bento-card p-6 bg-linear-to-br from-primary-500/5 to-primary-500/10 border border-primary-500/20">
      <h2 className="text-xl font-bold mb-4">Upcoming Payment</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground/60">Amount Due</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">MWK 45,000</p>
          </div>
          <div className="p-3 bg-primary-500/20 rounded-xl">
            <Calendar className="w-6 h-6 text-primary-500" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Due Date</span>
            <span className="font-medium">Feb 28, 2024</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Loan Reference</span>
            <span className="font-medium">VS-2024-0012</span>
          </div>
        </div>
        <button className="w-full mt-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
          Schedule Payment
        </button>
      </div>
    </div>
  );
}