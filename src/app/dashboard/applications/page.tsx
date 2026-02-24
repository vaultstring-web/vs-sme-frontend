// src/app/dashboard/applications/page.tsx
'use client';

import { FileText, Briefcase, X, Clock, CheckCircle2, XCircle, Search, Filter, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useApplications } from '@/hooks/useApplications';
import type { ApplicationStatus } from '@/context/ApplicationsContext';
import NewApplicationModal from '@/components/modals/NewApplicationModal';

// Map backend status to frontend display config
const statusConfig = {
  APPROVED: { 
    label: "Approved", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", 
    icon: CheckCircle2 
  },
  DISBURSED: { 
    label: "Disbursed", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", 
    icon: CheckCircle2 
  },
  SUBMITTED: { 
    label: "Submitted", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", 
    icon: Clock 
  },
  UNDER_REVIEW: { 
    label: "Under Review", 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", 
    icon: Clock 
  },
  DRAFT: { 
    label: "Draft", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", 
    icon: FileText 
  },
  REJECTED: { 
    label: "Rejected", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", 
    icon: XCircle 
  },
  REPAYED: { 
    label: "Repaid", 
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", 
    icon: CheckCircle2 
  },
  DEFAULTED: { 
    label: "Defaulted", 
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", 
    icon: XCircle 
  },
};

type FilterType = ApplicationStatus | 'all';

export default function ApplicationsPage() {
  const {
    applications,
    meta,
    isLoading,
    error,
    fetchApplications,
    clearError,
  } = useApplications();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications({ page: 1, limit: 100 });
  }, [fetchApplications]);

  // Extract unique types for filter
  const applicationTypes = useMemo(() => {
    const types = applications.map(app => app.type);
    return ['all', ...Array.from(new Set(types))];
  }, [applications]);

  // Filter applications based on search (client-side for name search)
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Search filter - search in business name, employer name, or type
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        (app.smeData?.businessName?.toLowerCase().includes(searchTerm)) ||
        (app.payrollData?.employerName?.toLowerCase().includes(searchTerm)) ||
        app.type.toLowerCase().includes(searchTerm);

      // Status filter
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || app.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, searchQuery, statusFilter, typeFilter]);

  // Calculate stats based on filtered results
  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const inReview = filteredApplications.filter(app => 
      app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
    ).length;
    const approved = filteredApplications.filter(app => 
      app.status === 'APPROVED' || app.status === 'DISBURSED'
    ).length;
    const totalAmount = filteredApplications.reduce((sum, app) => {
      const amount = app.smeData?.loanAmount || app.payrollData?.loanAmount || 0;
      return sum + amount;
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

  // Calculate progress based on status
  const getProgress = (status: ApplicationStatus): number => {
    switch (status) {
      case 'DRAFT': return 20;
      case 'SUBMITTED': return 40;
      case 'UNDER_REVIEW': return 60;
      case 'APPROVED': return 80;
      case 'DISBURSED': return 100;
      case 'REPAYED': return 100;
      case 'REJECTED': return 100;
      case 'DEFAULTED': return 100;
      default: return 0;
    }
  };

  // Format amount for display
  const formatAmount = (amount: number): string => {
    return `MWK ${amount.toLocaleString()}`;
  };

  // Get application name
  const getApplicationName = (app: any): string => {
    if (app.type === 'SME') {
      return app.smeData?.businessName || 'SME Application';
    } else {
      return app.payrollData?.employerName || 'Payroll Application';
    }
  };

  // Get application amount
  const getApplicationAmount = (app: any): number => {
    return app.smeData?.loanAmount || app.payrollData?.loanAmount || 0;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB');
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
          ← Back to Dashboard
        </Link>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bento-card p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-400">
                Error loading applications
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bento-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by business name, employer, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-foreground/40 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:bg-card/80 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-background border border-border rounded-lg shadow-xl z-20">
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Status
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="all"
                            checked={statusFilter === 'all'}
                            onChange={() => setStatusFilter('all')}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-foreground">All Statuses</span>
                        </label>
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value={status}
                              checked={statusFilter === status}
                              onChange={() => setStatusFilter(status as ApplicationStatus)}
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

          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
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
              <span>Status: {statusConfig[statusFilter as ApplicationStatus].label}</span>
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-1 hover:text-primary-700"
              >
                ×
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
                ×
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
                ×
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
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
                      const StatusIcon = statusConfig[app.status].icon;
                      const progress = getProgress(app.status);
                      
                      return (
                        <tr key={app.id} className="hover:bg-card/50 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-foreground">{getApplicationName(app)}</p>
                              <p className="text-sm text-foreground/60">ID: {app.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {app.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-foreground">
                            {formatAmount(getApplicationAmount(app))}
                          </td>
                          <td className="py-4 px-4 text-foreground/60">
                            {formatDate(app.submittedAt || app.createdAt)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="w-4 h-4" />
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[app.status].color}`}>
                                {statusConfig[app.status].label}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-500 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-foreground">{progress}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Link 
                                href={`/dashboard/applications/${app.id}`}
                                className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                              >
                                View
                              </Link>
                              {app.status === "DRAFT" && (
                                <Link
                                  href={`/dashboard/applications/${app.id}/edit`}
                                  className="px-3 py-1 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded"
                                >
                                  Continue
                                </Link>
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
                            {applications.length === 0 
                              ? "You haven't created any applications yet"
                              : "Try adjusting your search or filters"
                            }
                          </p>
                          <button
                            onClick={handleClearFilters}
                            className="mt-4 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg"
                          >
                            {applications.length === 0 ? "Create Application" : "Clear all filters"}
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
                  Showing {filteredApplications.length} of {applications.length} applications
                </span>
                {filteredApplications.length > 0 && (
                  <button className="text-primary-600 hover:underline">
                    Export Results
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <NewApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}