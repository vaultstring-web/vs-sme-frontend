'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  Eye,
  CheckSquare,
  Square,
  Shield,
  ShieldCheck,
  ShieldOff,
  Plus,
  X,
  Pencil,
  Trash2,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { Input, Select } from '@/components/ui/FormELements';
import { useAuth } from '@/hooks/useAuth';
import CustomDatePicker from '@/components/ui/DatePicker';
import ResponsiveTable from '@/components/ui/ResponsiveTable';

interface Application {
  id: string;
  type: string;
  status: string;
  amount: number;
  createdAt: string;
  submittedAt?: string;
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

interface Collateral {
  id: string;
  type: string;
  description: string;
  estimatedValue: number;
  status: 'PENDING' | 'VERIFIED' | 'RELEASED';
  createdAt: string;
}

// Collateral Modal
function CollateralModal({ applicationId, onClose }: {
  applicationId: string;
  onClose: () => void;
}) {
  const [collaterals, setCollaterals] = useState<Collateral[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: '', description: '', estimatedValue: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchCollaterals = useCallback(async () => {
    try {
      setLoading(true);
      // FIXED: added /collateral prefix to match backend route
      const res = await apiClient.get(`/collateral/application/${applicationId}`);
      setCollaterals(res.data.data ?? res.data);
    } catch (err) {
      console.error('Failed to fetch collaterals:', err);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => { fetchCollaterals(); }, [fetchCollaterals]);

  const handleSubmit = async () => {
    if (!form.type || !form.description || !form.estimatedValue) return;
    try {
      setSubmitting(true);
      if (editingId) {
        await apiClient.put(`/collateral/${editingId}`, {
          type: form.type,
          description: form.description,
          estimatedValue: Number(form.estimatedValue),
        });
      } else {
        await apiClient.post(`/collateral/application/${applicationId}`, {
          type: form.type,
          description: form.description,
          estimatedValue: Number(form.estimatedValue),
        });
      }
      setForm({ type: '', description: '', estimatedValue: '' });
      setEditingId(null);
      fetchCollaterals();
    } catch (err) {
      console.error('Failed to save collateral:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collateral item?')) return;
    try {
      await apiClient.delete(`/collateral/${id}`);
      fetchCollaterals();
    } catch (err) {
      console.error('Failed to delete collateral:', err);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await apiClient.patch(`/collateral/${id}/verify`);
      fetchCollaterals();
    } catch (err) {
      console.error('Failed to verify collateral:', err);
    }
  };

  const handleRelease = async (id: string) => {
    try {
      await apiClient.patch(`/collateral/${id}/release`);
      fetchCollaterals();
    } catch (err) {
      console.error('Failed to release collateral:', err);
    }
  };

  const handleUpload = async (id: string, file: File) => {
    try {
      setUploadingId(id);
      const formData = new FormData();
      formData.append('file', file);
      await apiClient.post(`/collateral/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchCollaterals();
    } catch (err) {
      console.error('Failed to upload file:', err);
    } finally {
      setUploadingId(null);
    }
  };

  const startEdit = (c: Collateral) => {
    setEditingId(c.id);
    setForm({ type: c.type, description: c.description, estimatedValue: String(c.estimatedValue) });
  };

  const statusBadge = (status: Collateral['status']) => {
    const map = {
      PENDING:  'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      VERIFIED: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      RELEASED: 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400',
    };
    return map[status] ?? map.PENDING;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Shield size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Collateral</h3>
              <p className="text-[11px] text-foreground/40">Application {applicationId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/30 hover:text-foreground/60 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Add / Edit form */}
        <div className="px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-zinc-900/40 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-3">
            {editingId ? 'Edit collateral item' : 'Add collateral item'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              placeholder="Type (e.g. Land, Vehicle)"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-foreground/30 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-foreground/30 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
            <input
              type="number"
              placeholder="Estimated value (MWK)"
              value={form.estimatedValue}
              onChange={(e) => setForm((f) => ({ ...f, estimatedValue: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-foreground/30 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <Plus size={15} />
              {submitting ? 'Saving…' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                onClick={() => { setEditingId(null); setForm({ type: '', description: '', estimatedValue: '' }); }}
                className="px-4 py-2 rounded-lg text-sm text-foreground/50 hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Collateral list */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center text-foreground/40 text-sm">Loading…</div>
          ) : collaterals.length === 0 ? (
            <div className="p-8 text-center">
              <Shield size={32} className="mx-auto text-foreground/10 mb-2" />
              <p className="text-sm text-foreground/40">No collateral items yet</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/60 dark:bg-zinc-900/50 sticky top-0">
                <tr>
                  {['Type', 'Description', 'Est. Value', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-foreground/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {collaterals.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3 text-sm font-semibold text-foreground">{c.type}</td>
                    <td className="px-5 py-3 text-sm text-foreground/70">{c.description}</td>
                    <td className="px-5 py-3 text-sm font-bold text-foreground">MWK {c.estimatedValue.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => startEdit(c)} title="Edit" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 text-foreground/40 hover:text-foreground transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (fileRef.current) {
                              (fileRef.current as HTMLInputElement & { _targetId: string })._targetId = c.id;
                              fileRef.current.click();
                            }
                          }}
                          title="Upload document"
                          disabled={uploadingId === c.id}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 text-foreground/40 hover:text-blue-600 transition-colors disabled:opacity-40"
                        >
                          <Upload size={14} />
                        </button>
                        {c.status === 'PENDING' && (
                          <button onClick={() => handleVerify(c.id)} title="Verify" className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-foreground/40 hover:text-green-600 transition-colors">
                            <ShieldCheck size={14} />
                          </button>
                        )}
                        {c.status === 'VERIFIED' && (
                          <button onClick={() => handleRelease(c.id)} title="Release" className="p-1.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-foreground/40 hover:text-yellow-600 transition-colors">
                            <ShieldOff size={14} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(c.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-foreground/40 hover:text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            const id = (e.target as HTMLInputElement & { _targetId: string })._targetId;
            if (file && id) handleUpload(id, file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

// Main Table
export default function AdminApplicationTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [collateralAppId, setCollateralAppId] = useState<string | null>(null);

  const { user: currentUser } = useAuth();
  const isAuditor = currentUser?.role === 'AUDITOR';

  const fetchApplications = useCallback(async () => {
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
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [meta.page, meta.pageSize, sortBy, sortOrder, search, status, dateFrom, dateTo]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchApplications();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchApplications]);

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
        comment: `Bulk ${action.toLowerCase()} via admin dashboard`,
      });
      await fetchApplications();
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

  return (
    <div className="space-y-4">
      {collateralAppId && (
        <CollateralModal
          applicationId={collateralAppId}
          onClose={() => setCollateralAppId(null)}
        />
      )}

      {/* Filters & Actions */}
      <div className="flex flex-col items-start justify-between gap-4 bento-card p-4 lg:flex-row lg:items-center">
        <div className="flex w-full flex-1 flex-col gap-2 lg:w-auto lg:flex-row">
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
          
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <CustomDatePicker 
              label="From"
              value={dateFrom}
              onChange={(value) => setDateFrom(value)}
              fullWidth={false}
            />
            <CustomDatePicker 
              label="To"
              value={dateTo}
              onChange={(value) => setDateTo(value)}
              fullWidth={false}
            />
          </div>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors w-full lg:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && !isAuditor && (
        <div className="fixed bottom-4 left-4 right-4 z-40 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-foreground px-4 py-3 text-background shadow-xl animate-in slide-in-from-bottom-4 duration-200 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:flex-nowrap sm:rounded-full sm:px-6" role="region" aria-label="Bulk actions">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <div className="hidden h-4 w-px bg-background/20 sm:block" />
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => handleBulkAction('APPROVED')}
              disabled={isBulkProcessing}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-xs font-bold transition-colors disabled:opacity-50 text-white"
            >
              Approve
            </button>
            <button 
              onClick={() => handleBulkAction('REJECTED')}
              disabled={isBulkProcessing}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-xs font-bold transition-colors disabled:opacity-50 text-white"
            >
              Reject
            </button>
          </div>
          <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-background/60 hover:text-background">
            <span className="sr-only">Clear selection</span>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bento-card overflow-hidden">
        <ResponsiveTable
          mobileCards={
            <div className="space-y-3">
              {isLoading ? (
                <div className="rounded-xl border border-border p-6 text-center text-foreground/50">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="rounded-xl border border-border p-6 text-center text-foreground/50">No applications found.</div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className={`space-y-2 rounded-xl border border-border p-4 ${selectedIds.has(app.id) && !isAuditor ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'bg-card'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-black dark:text-white">{app.user.fullName}</p>
                        <p className="truncate text-xs text-black/60 dark:text-white/60" title={app.user.email}>
                          {app.user.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setCollateralAppId(app.id)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/40 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20"
                          aria-label="View collateral"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/applications/detail?id=${app.id}`}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/40 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20"
                          aria-label="View application"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-black/60 dark:text-white/60">
                      <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{app.type === 'SME' ? 'SME Loan' : 'Payroll Loan'}</span>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                        app.status === 'APPROVED'
                          ? 'border-green-200 bg-green-100 text-green-800 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400'
                          : app.status === 'REJECTED'
                            ? 'border-red-200 bg-red-100 text-red-800 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-400'
                            : app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
                              ? 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800/50 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : app.status === 'DISBURSED'
                                ? 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800/50 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {app.status.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          }
          table={
            <table className="hidden w-full min-w-[820px] text-left text-sm md:table">
              <thead className="sticky top-0 z-10 text-xs text-black/60 dark:text-white/60 uppercase bg-card/50">
                <tr>
                  {!isAuditor && (
                    <th className="px-4 py-3 w-10">
                      <button onClick={handleSelectAll} className="flex items-center">
                        {applications.length > 0 && selectedIds.size === applications.length ? (
                          <CheckSquare className="w-4 h-4 text-primary-600" />
                        ) : (
                          <Square className="w-4 h-4 text-foreground/30" />
                        )}
                      </button>
                    </th>
                  )}
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
                    <td colSpan={isAuditor ? 5 : 6} className="px-6 py-8 text-center text-black/50 dark:text-white/50">
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={isAuditor ? 5 : 6} className="px-6 py-8 text-center text-black/50 dark:text-white/50">
                      No applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className={`hover:bg-primary-50/30 dark:hover:bg-primary-900/20 transition-colors ${selectedIds.has(app.id) && !isAuditor ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                      {!isAuditor && (
                        <td className="px-4 py-4">
                          <button onClick={() => handleSelectOne(app.id)} className="flex items-center">
                            {selectedIds.has(app.id) ? (
                              <CheckSquare className="w-4 h-4 text-primary-600" />
                            ) : (
                              <Square className="w-4 h-4 text-foreground/30" />
                            )}
                          </button>
                        </td>
                      )}
                      <td className="px-6 py-4 text-black dark:text-white sm:whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-black dark:text-white">{app.user.fullName}</div>
                        <div className="max-w-[220px] truncate text-xs text-black/60 dark:text-white/60" title={app.user.email}>
                          {app.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-black dark:text-white">
                        {app.type === 'SME' ? 'SME Loan' : 'Payroll Loan'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          app.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50'
                            : app.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50'
                              : app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50'
                              : app.status === 'DISBURSED'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {app.status.replace('_', ' ').toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setCollateralAppId(app.id)}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/40 transition-colors hover:bg-amber-50 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:hover:bg-amber-900/20"
                            aria-label={`View collateral for application ${app.id}`}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/admin/applications/detail?id=${app.id}`}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/40 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:hover:bg-primary-900/20"
                            aria-label={`View application ${app.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          }
        />

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-black/60 dark:text-white/60">
            Showing <span className="font-medium">{(meta.page - 1) * meta.pageSize + 1}</span> to{' '}
            <span className="font-medium">{Math.min(meta.page * meta.pageSize, meta.total)}</span> of{' '}
            <span className="font-medium">{meta.total}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMeta(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={meta.page === 1}
              className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card/50 text-foreground/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMeta(prev => ({ ...prev, page: Math.min(meta.totalPages, prev.page + 1) }))}
              disabled={meta.page >= meta.totalPages}
              className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card/50 text-foreground/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}