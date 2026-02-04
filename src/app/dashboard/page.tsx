// app/dashboard/page.tsx
'use client';

import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock,
  BarChart3,
  Download,
  Calendar,
  Shield,
  Building,
  FileText,
  CreditCard,
  Wallet,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  ArrowRight,
  Zap,
  Globe,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';

export default function DashboardPage() {
  const mockUser = {
    name: 'Tiwonge',
    email: 'tiwonge@example.com',
    role: 'Business Owner',
  };

  const stats = [
    { title: 'Credit Available', value: 'MWK 1.5M', change: '+12.5%', icon: DollarSign, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Active Loans', value: '2', change: 'Stable', icon: Wallet, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Processing Time', value: '24 hrs', change: '+15%', icon: Clock, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
    { title: 'Credit Score', value: '780', change: 'Excellent', icon: TrendingUp, color: 'text-lime-600 dark:text-lime-400', bgColor: 'bg-lime-100 dark:bg-lime-900/20' },
  ];

  const recentApplications = [
    { id: 1, name: 'Banda Exports', type: 'Working Capital', amount: 'MWK 450,000', status: 'Approved', date: '2024-01-15', icon: Building, statusColor: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' },
    { id: 2, name: 'Lilongwe Agro', type: 'Equipment Financing', amount: 'MWK 800,000', status: 'Pending', date: '2024-01-14', icon: Users, statusColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800' },
    { id: 3, name: 'Zomba Retail', type: 'Payroll Loan', amount: 'MWK 120,000', status: 'Under Review', date: '2024-01-13', icon: CreditCard, statusColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  ];

  const quickActions = [
    { title: 'Apply for Loan', icon: FileText, color: 'text-lime-600 dark:text-lime-400', bgColor: 'bg-lime-100 dark:bg-lime-900/20 hover:bg-lime-200 dark:hover:bg-lime-900/30' },
    { title: 'Make Payment', icon: DollarSign, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30' },
    { title: 'View Statements', icon: BarChart3, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30' },
    { title: 'Security', icon: Shield, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/30' },
  ];

  return (
    <Layout user={mockUser}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Tiwonge.</h1>
              <p className="text-gray-600 dark:text-gray-300">Your credit health is <span className="text-lime-600 dark:text-lime-400 font-semibold">excellent</span>.</p>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-100 dark:bg-lime-900/30 border border-lime-200 dark:border-lime-500/30 rounded-full">
                <div className="w-2 h-2 bg-lime-500 dark:bg-lime-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-lime-700 dark:text-lime-400">SYSTEM READY</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">MWK to CNY conversion rates updated. Trade bridge is fully operational.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.change.includes('+') || stat.change === 'Excellent' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 dark:text-green-400" />
                    ) : (
                      <span className="w-4 h-4"></span>
                    )}
                    <span className={`text-sm ${stat.change.includes('+') || stat.change === 'Excellent' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Loan Application Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Lending Redefined.</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Access immediate capital for your business growth or salary advances. Secure, fast, and transparent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="group flex-1 bg-gradient-to-r from-lime-500 to-lime-600 text-white dark:text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-lime-500/30 dark:hover:shadow-lime-500/30 transition-all flex items-center justify-center gap-3">
                Apply for Credit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-lime-600 dark:text-lime-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Instant Disbursement</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">12.4k+ trusted SME partners</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-lime-600 dark:text-lime-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cross-Border</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">MWK-CNY direct bridge</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-lime-600 dark:text-lime-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Secure</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bank-level security</p>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent</h2>
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">View All</button>
            </div>

            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{app.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{app.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{app.amount}</span>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {app.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-lime-300 dark:hover:border-lime-500/50 hover:bg-lime-50 dark:hover:bg-lime-900/10 transition-all ${action.bgColor}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${action.bgColor}`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scale Your Operations */}
        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm dark:shadow-none">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Scale Your Operations</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-xl">
                Institutional capital for cross-border expansion. Launch your project and set up your company for global trade.
              </p>
            </div>
            <button className="group bg-lime-600 dark:bg-white text-white dark:text-black font-bold py-3 px-8 rounded-xl hover:bg-lime-700 dark:hover:bg-gray-100 transition-all flex items-center gap-3 whitespace-nowrap shadow-md hover:shadow-lg">
              LAUNCH PROJECT
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lime-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">System Status</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">All systems operational</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600 dark:text-gray-400">API: 99.9%</span>
              <span className="text-gray-600 dark:text-gray-400">Uptime: 100%</span>
              <span className="text-gray-600 dark:text-gray-400">Latency: 42ms</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}