'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  CheckSquare,
  Square,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { Input, Select } from '@/components/ui/FormELements';
import BulkAssignReviewerModal from '@/components/admin/applications/BulkAssignReviewerModal';
import BulkStatusModal from '@/components/admin/applications/BulkStatusModal';

interface Application {
  id: string;
  type: string;
  status: string;
  amount: number;
  createdAt: string;
  submittedAt?: string;
  priority?: string;
  notes?: string;
  assignedReviewer?: { id: string; fullName: string } | null;
  user: {
    id: string;
    fullName: string;
    email: string;
    primaryPhone: string;
  };
}

interface Meta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AdminApplicationTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Row inline editing
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [rowEdits, setRowEdits] = useState<Record<string, Partial<Application>>>({});
  const [reviewers, setReviewers] = useState<{ id: string; fullName: string }[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: meta.page.toString(),
        pageSize: meta.pageSize.toString(),
        sortBy,
        sortOrder,
        ...(search && { q: search }),
        ...(status && { status }),
        ...(dateFrom && { createdFrom: dateFrom }),
        ...(dateTo && { createdTo: dateTo }),
      });

      const response = await apiClient.get(`/admin/applications?${params.toString()}`);
      setApplications(response.data.data);
      setMeta(response.data.meta);
      setSelectedIds(new Set()); // Reset selection on fetch
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviewers = async () => {
    try {
      const res = await apiClient.get('/admin/reviewers');
      setReviewers(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch reviewers', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchApplications();
    }, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [meta.page, meta.pageSize, sortBy, sortOrder, search, status, dateFrom, dateTo]);

  useEffect(() => {
    fetchReviewers();
  }, []);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === applications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(applications.map(app => app.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to ${action} ${selectedIds.size} applications?`)) return;

    setIsBulkProcessing(true);
    try {
      await apiClient.patch('/admin/applications/status/bulk', {
        ids: Array.from(selectedIds),
        status: action,
        comment: `Bulk ${action.toLowerCase()} via admin dashboard`
      });
      await fetchApplications(); // Refresh list
    } catch (error) {
      console.error('Bulk action failed', error);
      alert('Some applications could not be updated. Please check their current status.');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { q: search }),
        ...(status && { status }),
        ...(dateFrom && { createdFrom: dateFrom }),
        ...(dateTo && { createdTo: dateTo }),
      });

      const response = await apiClient.get(`/admin/applications/export?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'applications.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleExportSelected = async () => {
    if (selectedIds.size === 0) return alert('No applications selected');
    try {
      const response = await apiClient.post('/admin/applications/export', { ids: Array.from(selectedIds) }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'applications-selected.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export selected failed', error);
      alert('Export failed.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected applications? This cannot be undone.`)) return;
    try {
      await apiClient.request({ method: 'delete', url: '/admin/applications', data: { ids: Array.from(selectedIds) } });
      await fetchApplications();
    } catch (error) {
      console.error('Delete selected failed', error);
      alert('Delete failed.');
    }
  };

  // Row inline editing helpers
  const startRowEdit = (id: string, app: Application) => {
    setEditingRowId(id);
    setRowEdits(prev => ({ ...prev, [id]: { ...app } }));
  };

  const cancelRowEdit = (id: string) => {
    setEditingRowId(prev => (prev === id ? null : prev));
    setRowEdits(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const saveRowEdit = async (id: string) => {
    const edits = rowEdits[id];
    if (!edits) return cancelRowEdit(id);

    // Optimistic update
    const prevApps = applications;
    setApplications((list) => list.map(a => a.id === id ? ({ ...a, ...edits } as Application) : a));

    try {
      await apiClient.patch(`/admin/applications/${id}`, edits);
      cancelRowEdit(id);
    } catch (error) {
      console.error('Row update failed', error);
      alert('Update failed, reverting changes.');
      setApplications(prevApps);
      cancelRowEdit(id);
    }
  };

  const onRowFieldChange = (id: string, field: keyof Application, value: any) => {
    setRowEdits(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  };

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bento-card p-4">
        <div className="flex flex-1 flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input
              placeholder="Search applications..."
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-40"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>

          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors justify-center"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-foreground text-background px-6 py-3 rounded-full shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-200" role="region" aria-label="Bulk actions">
          <span className="font-medium text-sm">{selectedIds.size} selected</span>
          <div className="h-4 w-px bg-background/20" />
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('APPROVED')}
              disabled={isBulkProcessing}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-xs font-bold transition-colors disabled:opacity-50 text-white"
              aria-label="Approve selected applications"
            >
              Approve
            </button>
            <button
              onClick={() => handleBulkAction('REJECTED')}
              disabled={isBulkProcessing}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-xs font-bold transition-colors disabled:opacity-50 text-white"
              aria-label="Reject selected applications"
            >
              Reject
            </button>
            <button
              onClick={handleExportSelected}
              className="px-3 py-1 bg-primary-600 hover:bg-primary-700 rounded-md text-xs font-bold text-white"
            >
              Export Selected
            </button>
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-800 rounded-md text-xs font-bold text-white"
            >
              Assign Reviewer
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded-md text-xs font-bold text-white"
            >
              Delete
            </button>
            <button
              onClick={() => setIsBulkStatusModalOpen(true)}
              className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded-md text-xs font-bold text-white"
            >
              Change Status
            </button>
          </div>
          <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-background/60 hover:text-background">
            <span className="sr-only">Clear selection</span>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      {/* Bulk action modals */}
      <BulkAssignReviewerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        ids={Array.from(selectedIds)}
        reviewers={reviewers}
        onAssigned={async () => { await fetchApplications(); setSelectedIds(new Set()); setIsAssignModalOpen(false); }}
      />
      <BulkStatusModal
        isOpen={isBulkStatusModalOpen}
        onClose={() => setIsBulkStatusModalOpen(false)}
        ids={Array.from(selectedIds)}
        onConfirmed={async () => { await fetchApplications(); setSelectedIds(new Set()); setIsBulkStatusModalOpen(false); }}
      />

      {/* Table */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 z-10 text-xs text-foreground/50 uppercase bg-slate-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button onClick={handleSelectAll} className="flex items-center">
                    {applications.length > 0 && selectedIds.size === applications.length ? (
                      <CheckSquare className="w-4 h-4 text-primary-600" />
                    ) : (
                      <Square className="w-4 h-4 text-foreground/30" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 font-medium cursor-pointer hover:text-primary-600" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium">Applicant</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium cursor-pointer hover:text-primary-600" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/50">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/50">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const isEditing = editingRowId === app.id;
                  const edits = rowEdits[app.id] || {};
                  return (
                    <tr key={app.id} className={`hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors ${selectedIds.has(app.id) ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                      <td className="px-4 py-4">
                        <button onClick={() => handleSelectOne(app.id)} className="flex items-center">
                          {selectedIds.has(app.id) ? (
                            <CheckSquare className="w-4 h-4 text-primary-600" />
                          ) : (
                            <Square className="w-4 h-4 text-foreground/30" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{app.user.fullName}</div>
                        <div className="text-xs text-foreground/50">{app.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-foreground/60">
                        {app.type === 'SME' ? 'SME Loan' : 'Payroll Loan'}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Select
                              value={(edits.status as string) ?? app.status}
                              onChange={(e) => onRowFieldChange(app.id, 'status', e.target.value)}
                              className="text-sm"
                            >
                              <option value="DRAFT">Draft</option>
                              <option value="SUBMITTED">Submitted</option>
                              <option value="UNDER_REVIEW">Under Review</option>
                              <option value="APPROVED">Approved</option>
                              <option value="REJECTED">Rejected</option>
                            </Select>
                            <Select
                              value={(edits.priority as string) ?? (app.priority ?? 'normal')}
                              onChange={(e) => onRowFieldChange(app.id, 'priority', e.target.value)}
                              className="text-sm w-28"
                            >
                              <option value="low">Low</option>
                              <option value="normal">Normal</option>
                              <option value="high">High</option>
                            </Select>
                            <Select
                              value={(edits.assignedReviewer?.id as string) ?? (app.assignedReviewer?.id ?? '')}
                              onChange={(e) => {
                                const reviewer = reviewers.find(r => r.id === e.target.value) || null;
                                onRowFieldChange(app.id, 'assignedReviewer', reviewer ? { id: reviewer.id, fullName: reviewer.fullName } : null);
                              }}
                              className="text-sm w-52"
                            >
                              <option value="">Unassigned</option>
                              {reviewers.map(r => (
                                <option key={r.id} value={r.id}>{r.fullName}</option>
                              ))}
                            </Select>
                            <Input
                              value={(edits.notes as string) ?? (app.notes ?? '')}
                              onChange={(e) => onRowFieldChange(app.id, 'notes', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveRowEdit(app.id);
                                if (e.key === 'Escape') cancelRowEdit(app.id);
                              }}
                              className="h-8 text-sm w-64"
                            />
                            <button onClick={() => saveRowEdit(app.id)} className="p-1 text-green-600" aria-label="Save">
                              <Check size={16} />
                            </button>
                            <button onClick={() => cancelRowEdit(app.id)} className="p-1 text-red-600" aria-label="Cancel">
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50' :
                                  app.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50' :
                                  app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50' :
                                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                                {app.status.replace('_', ' ').toLowerCase()}
                              </span>
                              <div className="text-xs text-foreground/50">{app.priority ?? 'normal'}</div>
                              <div className="text-xs text-foreground/50">{app.assignedReviewer?.fullName ?? 'Unassigned'}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => startRowEdit(app.id, app)} className="p-1 text-foreground/40 hover:text-primary-600" aria-label="Edit row">
                                <Pencil size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/applications/detail?id=${app.id}`}
                          className="inline-flex items-center justify-center p-2 text-foreground/40 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                          aria-label={`View application ${app.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-sm text-foreground/60">
            Showing <span className="font-medium">{(meta.page - 1) * meta.pageSize + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.pageSize, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMeta(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={meta.page === 1}
              className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-zinc-800 text-foreground/60"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMeta(prev => ({ ...prev, page: Math.min(meta.totalPages, prev.page + 1) }))}
              disabled={meta.page >= meta.totalPages}
              className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-zinc-800 text-foreground/60"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}