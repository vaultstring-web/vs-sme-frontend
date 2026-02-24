'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  AlertTriangle,
  Edit2,
  Eye,
  Save,
  FileText
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import EditableField from './EditableField';
import StatusChangeModal from './StatusChangeModal';
import ApplicationTimeline from './ApplicationTimeline';

interface AdminApplicationDetailClientProps {
  id: string;
}

export default function AdminApplicationDetailClient({ id }: AdminApplicationDetailClientProps) {
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const fetchApplication = async () => {
    try {
      const response = await apiClient.get(`/admin/applications/${id}`);
      setApp(response.data.data);
    } catch (error) {
      console.error('Failed to fetch application:', error);
      // Redirect or show error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleStatusUpdate = async (status: string, comment: string) => {
    try {
      await apiClient.patch(`/admin/applications/${id}/status`, { status, comment });
      await fetchApplication(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  const handleFieldUpdate = async (field: string, value: string | number) => {
    try {
      const payload = app.type === 'SME' 
        ? { smeData: { [field]: value }, comment: `Updated ${field}` }
        : { payrollData: { [field]: value }, comment: `Updated ${field}` };
        
      await apiClient.patch(`/admin/applications/${id}/data`, payload);
      // Optimistic update or refresh
      await fetchApplication();
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading application details...</div>;
  if (!app) return <div className="p-8 text-center">Application not found</div>;

  const data = app.type === 'SME' ? app.smeData : app.payrollData;

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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border
              ${isEditMode 
                ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700'}`}
          >
            {isEditMode ? <Eye size={16} /> : <Edit2 size={16} />}
            {isEditMode ? 'View Mode' : 'Edit Mode'}
          </button>
          
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors text-sm font-medium shadow-sm"
          >
            <ShieldCheck size={16} />
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Application Form Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between
            ${app.status === 'APPROVED' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400' :
              app.status === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400' :
              'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-400'}`}>
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} />
              <div>
                <p className="font-bold text-sm">Current Status: {app.status}</p>
                <p className="text-xs opacity-80">Last updated: {new Date(app.updatedAt || app.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="bento-card p-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">Applicant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-foreground/50 uppercase">Full Name</p>
                <p className="font-medium text-foreground">{app.user.fullName}</p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-foreground/50 uppercase">Email</p>
                <p className="font-medium text-foreground">{app.user.email}</p>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <p className="text-xs text-foreground/50 uppercase">Phone</p>
                <p className="font-medium text-foreground">{app.user.primaryPhone}</p>
              </div>
            </div>
          </div>

          {/* Application Data (Dynamic Fields) */}
          <div className="bento-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {app.type} Application Data
              </h3>
              {isEditMode && <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Editing Enabled</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(data).map(([key, value]) => {
                if (key === 'id' || key === 'applicationId' || key === 'createdAt' || key === 'updatedAt') return null;
                // Simple assumption for editable fields vs read-only metadata
                return (
                  <EditableField
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').trim()}
                    value={value as string | number}
                    fieldName={key}
                    type={typeof value === 'number' ? 'number' : 'text'}
                    isEditing={isEditMode}
                    onSave={handleFieldUpdate}
                  />
                );
              })}
            </div>
          </div>

          {/* Documents */}
          <div className="bento-card p-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">Documents</h3>
            {app.documents.length === 0 ? (
              <p className="text-foreground/50 text-sm">No documents uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {app.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{doc.fileName}</p>
                        <p className="text-xs text-foreground/50 uppercase">{doc.documentType}</p>
                      </div>
                    </div>
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-foreground/40 hover:text-primary-600 transition-colors"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Timeline & Meta */}
        <div className="space-y-6">
          <div className="bento-card p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-6 text-foreground">Audit Trail</h3>
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
    </div>
  );
}
