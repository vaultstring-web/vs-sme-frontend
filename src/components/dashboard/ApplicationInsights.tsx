// src/app/dashboard/components/ApplicationInsights.tsx
import { Building2, TrendingUp } from 'lucide-react';

export default function ApplicationInsights() {
  return (
    <div className="bento-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Application Insights</h2>
          <p className="text-sm text-foreground/60">Track your loan applications progress</p>
        </div>
        <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Types */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Application Types
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                <span className="text-sm">SME Working Capital</span>
              </div>
              <span className="font-semibold">70%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Payroll Loans</span>
              </div>
              <span className="font-semibold">30%</span>
            </div>
          </div>
          <div className="mt-4 h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-rrom-primary-500 to-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Success Rate */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Success Rate
          </h3>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold">85%</div>
            <div className="text-sm text-green-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% this month
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Approval Rate</span>
              <span className="font-medium">92%</span>
            </div>
            <div className="w-full bg-border rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}