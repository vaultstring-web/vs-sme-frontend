'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  //User,
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import apiClient, { API_BASE_URL } from '@/lib/apiClient';
import Link from 'next/link';
import DocumentViewer from '@/components/shared/DocumentViewer';

interface UserDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  uploadedAt: string;
  isVerified: boolean;
  verifiedAt?: string;
}

interface Application {
  id: string;
  type: 'SME' | 'PAYROLL';
  status: string;
  createdAt: string;
  submittedAt?: string;
}

interface UserDetail {
  id: string;
  email: string;
  fullName: string;
  nationalIdOrPassport: string;
  primaryPhone: string;
  secondaryPhone?: string;
  physicalAddress: string;
  postalAddress?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  documents: UserDocument[];
  applications: Application[];
}

interface AdminUserDetailClientProps {
  id: string;
}

export default function AdminUserDetailClient({ id }: AdminUserDetailClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [detailRes, docsRes] = await Promise.all([
        apiClient.get(`/auth/admin/users/${encodeURIComponent(id)}`),
        apiClient.get(`/auth/users/${encodeURIComponent(id)}/documents`)
      ]);
      const userCore = detailRes.data?.user;
      const documents = docsRes.data?.documents ?? [];
      setUser({ ...userCore, documents });
    } catch (err: unknown) {
      console.error('Failed to fetch user details:', err);
      const errorMessage = (err as any)?.response?.data?.message || 'Failed to load user details';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-zinc-400">Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-lg font-medium text-slate-900 dark:text-zinc-100">{error || 'User not found'}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'REJECTED': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'UNDER_REVIEW': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Users
        </button>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.role.startsWith('ADMIN') 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
              : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
          }`}>
            {user.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bento-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">{user.fullName}</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">User ID: {user.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase">Email Address</p>
                  <p className="text-sm text-slate-900 dark:text-zinc-100">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase">Phone Number</p>
                  <p className="text-sm text-slate-900 dark:text-zinc-100">{user.primaryPhone}</p>
                  {user.secondaryPhone && (
                    <p className="text-sm text-slate-500 dark:text-zinc-400">{user.secondaryPhone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase">National ID / Passport</p>
                  <p className="text-sm text-slate-900 dark:text-zinc-100">{user.nationalIdOrPassport}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase">Physical Address</p>
                  <p className="text-sm text-slate-900 dark:text-zinc-100">{user.physicalAddress}</p>
                  {user.postalAddress && (
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{user.postalAddress}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase">Member Since</p>
                  <p className="text-sm text-slate-900 dark:text-zinc-100">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Documents & Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* KYC Documents */}
          <div className="bento-card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              KYC Documents
            </h3>

            {user.documents.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-xl">
                <p className="text-slate-500 dark:text-zinc-500">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.documents.map((doc) => (
                  <div key={doc.id} className="p-4 border border-slate-100 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                        <FileText className="w-6 h-6 text-primary-500" />
                      </div>
                      {doc.isVerified ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full uppercase">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate mb-1">
                      {doc.documentType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mb-4">
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const idx = user.documents.findIndex(d => d.id === doc.id);
                          setViewerIndex(Math.max(0, idx));
                          setIsViewerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </button>
                      <a
                        href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `${API_BASE_URL}${doc.fileUrl}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-600 dark:text-zinc-300 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications */}
          <div className="bento-card p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Applications
            </h3>

            {user.applications.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-xl">
                <p className="text-slate-500 dark:text-zinc-500">No applications found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-foreground/50 uppercase bg-slate-50 dark:bg-zinc-800/50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Submitted</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {user.applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-4 py-4">
                          <span className="font-medium text-slate-900 dark:text-zinc-100">{app.type} Loan</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(app.status)}`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 dark:text-zinc-400">
                          {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Not submitted'}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link 
                            href={`/admin/applications/detail?id=${app.id}`}
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {isViewerOpen && user && (
        <DocumentViewer
          documents={user.documents.map(d => ({ id: d.id, name: d.fileName, fileUrl: d.fileUrl, documentType: d.documentType }))}
          initialIndex={viewerIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
}
