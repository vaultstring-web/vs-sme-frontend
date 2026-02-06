// src/app/dashboard/components/RecentActivity.tsx
import { CheckCircle2, CreditCard, FileText } from 'lucide-react';

const activityData = [
  { 
    action: 'Loan Approved', 
    amount: 'MWK 500,000', 
    date: 'Today, 10:30 AM', 
    status: 'success',
    icon: CheckCircle2,
    color: 'green'
  },
  { 
    action: 'Payment Received', 
    amount: 'MWK 25,000', 
    date: 'Yesterday, 2:45 PM', 
    status: 'success',
    icon: CreditCard,
    color: 'blue'
  },
  { 
    action: 'Application Submitted', 
    amount: 'MWK 1,200,000', 
    date: '2 days ago', 
    status: 'pending',
    icon: FileText,
    color: 'yellow'
  },
];

export default function RecentActivity() {
  return (
    <div className="bento-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <p className="text-sm text-foreground/60">Latest updates on your account</p>
        </div>
        <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View All Activity
        </button>
      </div>

      <div className="space-y-4">
        {activityData.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-card/50 transition-colors group">
              <div className={`p-3 rounded-lg bg-${activity.color}-50 dark:bg-${activity.color}-900/20`}>
                <Icon className={`w-5 h-5 text-${activity.color}-500`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-foreground/60">{activity.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{activity.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
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