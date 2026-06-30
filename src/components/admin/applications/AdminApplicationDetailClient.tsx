"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  AlertTriangle,
  Edit2,
  Eye,
  FileText,
  Wallet,
  Shield,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import EditableField from "./EditableField";
import StatusChangeModal from "./StatusChangeModal";
import ApplicationTimeline from "./ApplicationTimeline";
import { useApplications } from "@/hooks/useApplications";
import DocumentViewer from "@/components/shared/DocumentViewer";
import { API_BASE_URL } from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";
import DisburseWithMethodModal from "@/components/admin/loans/DisburseWithMethodModal";
import apiClient from "@/lib/apiClient";

// ── Collateral Section (embedded) ──────────────────────────────────────────────

interface Collateral {
  id: string;
  type: string;
  description: string;
  estimatedValue: number;
  status: "AVAILABLE" | "SOLD";
  createdAt: string;
}

function CollateralSectionDetail({ applicationId }: { applicationId: string }) {
  const [collaterals, setCollaterals] = useState<Collateral[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: "", description: "", estimatedValue: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user: currentUser } = useAuth();
  const isAuditor = currentUser?.role === "AUDITOR";

  const fetchCollaterals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/collateral/application/${applicationId}`);
      setCollaterals(res.data.data ?? res.data);
    } catch (err) {
      console.error("Failed to fetch collaterals:", err);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchCollaterals();
  }, [fetchCollaterals]);

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
      setForm({ type: "", description: "", estimatedValue: "" });
      setEditingId(null);
      fetchCollaterals();
    } catch (err) {
      console.error("Failed to save collateral:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collateral item?")) return;
    try {
      await apiClient.delete(`/collateral/${id}`);
      fetchCollaterals();
    } catch (err) {
      console.error("Failed to delete collateral:", err);
    }
  };

  const handleStatusChange = async (id: string, status: Collateral["status"]) => {
    try {
      setUpdatingId(id);
      await apiClient.patch(`/collateral/${id}/status`, { status });
      fetchCollaterals();
    } catch (err) {
      console.error("Failed to update collateral status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpload = async (id: string, file: File) => {
    try {
      setUploadingId(id);
      const formData = new FormData();
      formData.append("file", file);
      await apiClient.post(`/collateral/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchCollaterals();
    } catch (err) {
      console.error("Failed to upload file:", err);
    } finally {
      setUploadingId(null);
    }
  };

  const startEdit = (c: Collateral) => {
    setEditingId(c.id);
    setForm({ type: c.type, description: c.description, estimatedValue: String(c.estimatedValue) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ type: "", description: "", estimatedValue: "" });
  };

  const statusBadgeClass = (status: Collateral["status"]) => {
    const map = {
      AVAILABLE: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      SOLD:      "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    };
    return map[status] ?? map.AVAILABLE;
  };

  return (
    <div className="bento-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-bold text-foreground">Collateral</h3>
          {!isAuditor && (
            <span className="text-xs text-foreground/40 bg-slate-100 px-2 py-0.5 rounded-full ml-2">
              Manage
            </span>
          )}
        </div>
        {!isAuditor && !editingId && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <Plus size={16} />
            Add Collateral
          </button>
        )}
        {editingId === "new" && (
          <button onClick={cancelEdit} className="text-sm text-foreground/40 hover:text-foreground">
            Cancel
          </button>
        )}
      </div>

      {/* Add / Edit Form (inline) */}
      {(editingId === "new" || editingId !== null) && !isAuditor && (
        <div className="bg-slate-50 dark:bg-zinc-900/40 rounded-lg p-4 border border-border space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">
            {editingId === "new" ? "Add collateral item" : "Edit collateral item"}
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
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <Plus size={15} />
              {submitting ? "Saving…" : editingId === "new" ? "Add" : "Update"}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 rounded-lg text-sm text-foreground/50 hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="p-8 text-center text-foreground/40 text-sm">Loading collaterals…</div>
      ) : collaterals.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-lg">
          <Shield size={32} className="mx-auto text-foreground/10 mb-2" />
          <p className="text-sm text-foreground/40">No collateral items recorded.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/60 dark:bg-zinc-900/50 border-b border-border">
              <tr>
                {["Type", "Description", "Est. Value", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                    {h}
                  </th>
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
                    {!isAuditor ? (
                      <select
                        value={c.status}
                        disabled={updatingId === c.id}
                        onChange={(e) =>
                          handleStatusChange(c.id, e.target.value as Collateral["status"])
                        }
                        className={`text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer disabled:opacity-50 ${statusBadgeClass(
                          c.status
                        )}`}
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="SOLD">Sold</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {!isAuditor ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEdit(c)}
                          title="Edit"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 text-foreground/40 hover:text-foreground transition-colors"
                        >
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
                        <button
                          onClick={() => handleDelete(c.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-foreground/40 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-foreground/30">View only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const id = (e.target as HTMLInputElement & { _targetId: string })._targetId;
          if (file && id) handleUpload(id, file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ── Main Detail Component ──────────────────────────────────────────────────────

interface AdminApplicationDetailClientProps {
  id: string;
}

export default function AdminApplicationDetailClient({
  id,
}: AdminApplicationDetailClientProps) {
  const router = useRouter();
  const {
    adminCurrentApplication: app,
    adminIsLoading,
    adminError,
    fetchAdminApplicationById,
    updateAdminApplicationStatus,
    updateAdminApplicationData,
    clearAdminError,
  } = useApplications();
  const { user: currentUser } = useAuth();
  const isAuditor = currentUser?.role === "AUDITOR";
  const canDisburse =
    currentUser?.role === "SUPER_ADMIN" || currentUser?.role === "ACCOUNTANT";

  const [isEditMode, setIsEditMode] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    fetchAdminApplicationById(id);
  }, [id, fetchAdminApplicationById]);

  useEffect(() => {
    if (adminError) {
      console.error("Admin application error:", adminError);
      clearAdminError();
    }
  }, [adminError, clearAdminError]);

  const handleStatusUpdate = async (status: string, comment: string) => {
    try {
      await updateAdminApplicationStatus(id, status, comment);
    } catch (error) {
      throw error;
    }
  };

  const handleFieldUpdate = async (field: string, value: string | number) => {
    if (!app) return;
    try {
      const payload =
        app.type === "SME"
          ? { smeData: { [field]: value }, comment: `Updated ${field}` }
          : { payrollData: { [field]: value }, comment: `Updated ${field}` };
      await updateAdminApplicationData(id, payload);
    } catch (error) {
      throw error;
    }
  };

  if (adminIsLoading)
    return (
      <div className="p-8 text-center">Loading application details...</div>
    );
  if (!app)
    return <div className="p-8 text-center">Application not found</div>;

  const data = app.type === "SME" ? app.smeData : app.payrollData;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Applications
        </button>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
          {!isAuditor && (
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all sm:w-auto
                ${
                  isEditMode
                    ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700"
                }`}
            >
              {isEditMode ? <Eye size={16} /> : <Edit2 size={16} />}
              {isEditMode ? "View Mode" : "Edit Mode"}
            </button>
          )}

          {canDisburse && app.status === "APPROVED" && (
            <button
              type="button"
              onClick={() => setIsDisburseModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 sm:w-auto"
            >
              <Wallet size={16} />
              Disburse Loan
            </button>
          )}

          {!isAuditor && (
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-zinc-100 dark:text-slate-900 dark:hover:bg-zinc-200 sm:w-auto"
            >
              <ShieldCheck size={16} />
              Update Status
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <div
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between
            ${
              app.status === "APPROVED"
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400"
                : app.status === "REJECTED"
                  ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400"
                  : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} />
              <div>
                <p className="font-bold text-sm">
                  Current Status: {app.status}
                </p>
                <p className="text-xs opacity-80">
                  Last updated:{" "}
                  {new Date(app.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="bento-card p-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">
              Applicant Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-foreground/50 uppercase">
                  Full Name
                </p>
                <p className="break-words font-medium text-foreground">
                  {app.user.fullName}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-foreground/50 uppercase">Email</p>
                <p className="break-all font-medium text-foreground">{app.user.email}</p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-foreground/50 uppercase">Phone</p>
                <p className="font-medium text-foreground">
                  {app.user.primaryPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Application Data */}
          <div className="bento-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {app.type} Application Data
              </h3>
              {isEditMode && (
                <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                  Editing Enabled
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(data).map(([key, value]) => {
                if (
                  key === "id" ||
                  key === "applicationId" ||
                  key === "createdAt" ||
                  key === "updatedAt"
                )
                  return null;
                return (
                  <EditableField
                    key={key}
                    label={key.replace(/([A-Z])/g, " $1").trim()}
                    value={value as string | number}
                    fieldName={key}
                    type={typeof value === "number" ? "number" : "text"}
                    isEditing={isEditMode}
                    onSave={handleFieldUpdate}
                  />
                );
              })}
            </div>
          </div>

          {/* Documents */}
          <div className="bento-card p-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">
              Documents
            </h3>
            {app.documents.length === 0 ? (
              <p className="text-foreground/50 text-sm">
                No documents uploaded.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {app.documents.map((doc, idx: number) => (
                  <div
                    key={doc.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-foreground/50 uppercase">
                          {doc.documentType}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                      <button
                        onClick={() => {
                          setViewerIndex(idx);
                          setIsViewerOpen(true);
                        }}
                        className="px-2 py-1 text-xs text-primary-600 hover:text-primary-700"
                        title="View"
                      >
                        View
                      </button>
                      <a
                        href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `${API_BASE_URL}${doc.fileUrl}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-foreground/40 hover:text-primary-600 transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Collateral Section ── */}
          <CollateralSectionDetail applicationId={app.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bento-card p-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-bold mb-6 text-foreground">
              Audit Trail
            </h3>
            <ApplicationTimeline logs={app.auditLogs} />
          </div>
        </div>
      </div>

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleStatusUpdate}
        currentStatus={app.status}
      />

      <DisburseWithMethodModal
        isOpen={isDisburseModalOpen}
        onClose={() => setIsDisburseModalOpen(false)}
        applicationId={app.id}
        borrowerName={app.user.fullName}
        borrowerPhone={app.user.primaryPhone}
        amount={data?.loanAmount ?? 0}
        onSuccess={() => {
          setIsDisburseModalOpen(false);
          fetchAdminApplicationById(id);
        }}
      />

      {isViewerOpen && app && (
        <DocumentViewer
          documents={app.documents.map((d) => ({
            id: d.id,
            name: d.fileName,
            fileUrl: d.fileUrl,
            documentType: d.documentType,
          }))}
          initialIndex={viewerIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
}
