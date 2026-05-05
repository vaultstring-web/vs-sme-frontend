// src/app/dashboard/components/RecentActivity.tsx
import { CheckCircle2, CreditCard, FileText } from 'lucide-react';

const activityData = [
  { 
    action: 'Loan Approved', 
    amount: 'MWK 500,000', 
    date: 'Today, 10:30 AM', 
    status: 'success' as const,
    icon: CheckCircle2,
    iconWrapClass: 'rounded-lg bg-green-50 p-3 dark:bg-green-900/20',
    iconClass: 'h-5 w-5 text-green-500',
  },
  { 
    action: 'Payment Received', 
    amount: 'MWK 25,000', 
    date: 'Yesterday, 2:45 PM', 
    status: 'success' as const,
    icon: CreditCard,
    iconWrapClass: 'rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20',
    iconClass: 'h-5 w-5 text-blue-500',
  },
  { 
    action: 'Application Submitted', 
    amount: 'MWK 1,200,000', 
    date: '2 days ago', 
    status: 'pending' as const,
    icon: FileText,
    iconWrapClass: 'rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20',
    iconClass: 'h-5 w-5 text-yellow-500',
  },
];

export default function RecentActivity() {
  return (
    <div className="bento-card p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <p className="text-sm text-foreground/60">Latest updates on your account</p>
        </div>
        <button type="button" className="text-left text-sm text-primary-600 hover:underline dark:text-primary-400 sm:text-right">
          View All Activity
        </button>
      </div>

      <div className="space-y-4">
        {activityData.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="group flex flex-col gap-3 rounded-xl p-4 transition-colors hover:bg-card/50 sm:flex-row sm:items-center sm:gap-4">
              <div className={activity.iconWrapClass}>
                <Icon className={activity.iconClass} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-foreground/60">{activity.date}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold whitespace-nowrap">{activity.amount}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-1 text-xs ${
                      activity.status === 'success' 
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {activity.status === 'success' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}