// src/app/dashboard/applications/page.tsx
'use client';

import { FileText, Clock, CheckCircle2, XCircle, Search, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

const applicationsData = [
  {
    id: 1,
    name: "Mwana's Hardware Store",
    type: "SME Working Capital",
    amount: "MWK 1,500,000",
    date: "2024-02-15",
    status: "approved",
    progress: 100
  },
  {
    id: 2,
    name: "Bata Shoe Company",
    type: "Payroll Loan",
    amount: "MWK 750,000",
    date: "2024-02-10",
    status: "in-review",
    progress: 60
  },
  {
    id: 3,
    name: "Malawi Textiles Ltd",
    type: "SME Working Capital",
    amount: "MWK 2,300,000",
    date: "2024-02-05",
    status: "draft",
    progress: 30
  },
  {
    id: 4,
    name: "City Pharmacy",
    type: "SME Working Capital",
    amount: "MWK 900,000",
    date: "2024-01-28",
    status: "rejected",
    progress: 100
  },
  {
    id: 5,
    name: "Teachers Union",
    type: "Payroll Loan",
    amount: "MWK 3,500,000",
    date: "2024-01-20",
    status: "approved",
    progress: 100
  },
  {
    id: 6,
    name: "Tech Solutions Ltd",
    type: "SME Working Capital",
    amount: "MWK 1,800,000",
    date: "2024-02-18",
    status: "in-review",
    progress: 45
  },
  {
    id: 7,
    name: "Farmers Cooperative",
    type: "Payroll Loan",
    amount: "MWK 2,100,000",
    date: "2024-02-12",
    status: "approved",
    progress: 100
  },
  {
    id: 8,
    name: "Medical Supplies Inc",
    type: "SME Working Capital",
    amount: "MWK 1,200,000",
    date: "2024-02-08",
    status: "draft",
    progress: 20
  },
];

const statusConfig = {
  approved: { 
    label: "Approved", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", 
    icon: CheckCircle2 
  },
  "in-review": { 
    label: "In Review", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", 
    icon: Clock 
  },
  draft: { 
    label: "Draft", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", 
    icon: FileText 
  },
  rejected: { 
    label: "Rejected", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", 
    icon: XCircle 
  },
};

type StatusType = keyof typeof statusConfig;
type FilterType = StatusType | 'all';

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract unique types for filter
  const applicationTypes = useMemo(() => {
    const types = applicationsData.map(app => app.type);
    return ['all', ...Array.from(new Set(types))];
  }, []);

  // Filter applications based on search and filters
  const filteredApplications = useMemo(() => {
    return applicationsData.filter(app => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.amount.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || app.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  // Calculate stats based on filtered results
  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const inReview = filteredApplications.filter(app => app.status === 'in-review').length;
    const approved = filteredApplications.filter(app => app.status === 'approved').length;
    const totalAmount = filteredApplications.reduce((sum, app) => {
      const amount = parseFloat(app.amount.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return {
      total,
      inReview,
      approved,
      totalAmount: `MWK ${(totalAmount / 1000000).toFixed(1)}M`
    };
  }, [filteredApplications]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Applications</h1>
          <p className="text-foreground/60 mt-1">
            Manage and track all your loan applications
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-card rounded-lg transition-colors"
        >
           Back to Dashboard
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bento-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Applications</p>
              <p className="text-2xl font-bold mt-1 text-foreground">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">In Review</p>
              <p className="text-2xl font-bold mt-1 text-foreground">{stats.inReview}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Approved</p>
              <p className="text-2xl font-bold mt-1 text-foreground">{stats.approved}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Amount</p>
              <p className="text-2xl font-bold mt-1 text-foreground">{stats.totalAmount}</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by name, type, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-foreground placeholder:text-foreground/40"
            />
          </div>
        </div>
        <div className="flex gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-card/80 transition-colors text-foreground"
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isFilterOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsFilterOpen(false)}
                />
                
                {/* Filter Panel */}
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Status
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            checked={statusFilter === 'all'}
                            onChange={() => setStatusFilter('all')}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-foreground">All Status</span>
                        </label>
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              checked={statusFilter === status}
                              onChange={() => setStatusFilter(status as StatusType)}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-foreground">{config.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Loan Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {applicationTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === 'all' ? 'All Types' : type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <button
                        onClick={handleClearFilters}
                        className="w-full px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-card/50 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            + New Application
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(statusFilter !== 'all' || typeFilter !== 'all' || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-foreground/60">Active filters:</span>
          
          {statusFilter !== 'all' && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary-500/10 text-primary-600 rounded-full text-sm">
              <span>Status: {statusConfig[statusFilter].label}</span>
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-1 hover:text-primary-700"
              >
                
              </button>
            </div>
          )}
          
          {typeFilter !== 'all' && (
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm">
              <span>Type: {typeFilter}</span>
              <button
                onClick={() => setTypeFilter('all')}
                className="ml-1 hover:text-blue-700"
              >
                
              </button>
            </div>
          )}
          
          {searchQuery && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="ml-1 hover:text-green-700"
              >
                
              </button>
            </div>
          )}
          
          <button
            onClick={handleClearFilters}
            className="text-sm text-foreground/60 hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Applications Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card/50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground/70">Application</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground/70">Type</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground/70">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground/70">Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground/70">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground/70">Progress</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => {
                  const StatusIcon = statusConfig[app.status as StatusType].icon;
                  return (
                    <tr key={app.id} className="hover:bg-card/50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">{app.name}</p>
                          <p className="text-sm text-foreground/60">ID: APP-{app.id.toString().padStart(4, "0")}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {app.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-foreground">{app.amount}</td>
                      <td className="py-4 px-4 text-foreground/60">{app.date}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[app.status as StatusType].color}`}>
                            {statusConfig[app.status as StatusType].label}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${app.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-foreground">{app.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded">
                            View
                          </button>
                          {app.status === "draft" && (
                            <button className="px-3 py-1 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded">
                              Continue
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-foreground/20 mb-4" />
                      <p className="text-foreground/60">No applications found</p>
                      <p className="text-sm text-foreground/40 mt-1">
                        Try adjusting your search or filters
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="mt-4 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Results Count */}
        <div className="px-4 py-3 border-t border-border bg-card/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">
              Showing {filteredApplications.length} of {applicationsData.length} applications
            </span>
            {filteredApplications.length > 0 && (
              <button className="text-primary-600 hover:underline">
                Export Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
