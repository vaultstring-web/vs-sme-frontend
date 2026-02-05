// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Users,
  ArrowRight,
  Calendar,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { ApplicationTypeSelector } from '@/components/dashboard/ApplicationTypeSelector';

export default function DashboardPage() {
  const [applicationType, setApplicationType] = useState<'sme' | 'payroll'>('sme');

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section with User Profile */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-linear-to-brrom-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">VS</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, Alex Kamwendo</h1>
              <p className="text-foreground/60 mt-1 flex items-center gap-2">
                <span className="text-sm">alex.kamwendo@email.com</span>
                <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
                  SME Account
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Application Type Selector */}
        <div className="lg:w-auto">
          <ApplicationTypeSelector 
            selectedType={applicationType}
            onTypeChange={setApplicationType}
          />
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Stats & Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bento-card p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Draft Applications</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold">2</span>
                    <span className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">In Progress</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Last updated: Today</span>
                  <button className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                    Continue <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bento-card p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Submitted</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold">5</span>
                    <span className="text-xs text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Under Review</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Clock className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Avg. processing: 3 days</span>
                  <button className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bento-card p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Approved</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold">3</span>
                    <span className="text-xs text-purple-500 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Total disbursed: MWK 2.45M</span>
                  <button className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Application Insights */}
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
              {/* Application Type Distribution */}
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
                
                {/* Visual progress bar */}
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
        </div>

        {/* Right Column - Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bento-card p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full p-4 bg-linear-to-r from-primary-500/10 to-primary-500/5 border border-primary-500/20 rounded-xl text-left hover:border-primary-500/40 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500 rounded-lg">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New Application</p>
                    <p className="text-xs text-foreground/60">Start a new loan application</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
              
              <button className="w-full p-4 bg-linear-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl text-left hover:border-blue-500/40 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">View Reports</p>
                    <p className="text-xs text-foreground/60">Analytics & insights</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
              
              <button className="w-full p-4 bg-linear-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl text-left hover:border-purple-500/40 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Support Center</p>
                    <p className="text-xs text-foreground/60">Get help & guidance</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            </div>
          </div>

          {/* Upcoming Payment */}
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
        </div>
      </div>

      {/* Recent Activity - Full Width */}
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
          {[
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
          ].map((activity, index) => {
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
    </div>
  );
}