"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/apiClient';
import { 
  FileText, CheckCircle2, Clock, AlertCircle, UploadCloud, 
  RefreshCcw, Loader2, Eye, Download
} from 'lucide-react';

import { DocumentUploadModal, DocumentType } from './DocumentUploadModal';
import DocumentViewer from '@/components/shared/DocumentViewer';
import { API_BASE_URL } from '@/lib/apiClient';

// Define Document interface based on backend response
interface BackendDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  uploadedAt: string;
  isVerified?: boolean;
  verifiedAt?: string | null;
}

// Frontend Document interface
interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status?: 'verified' | 'pending' | 'rejected' | 'missing';
  updatedAt?: string;
  fileUrl: string;
  isVerified?: boolean;
  verifiedAt?: string | null;
}

export const DocumentVerification = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Fetch documents from backend
  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.get('/auth/users/me/documents');
      const backendDocs: BackendDocument[] = response.data.documents || [];

      const transformedDocs: DocumentItem[] = backendDocs.map((doc) => {
        let displayName = doc.fileName;
        switch (doc.documentType) {
          case 'NATIONAL_ID_FRONT':
            displayName = 'National ID (Front)';
            break;
          case 'NATIONAL_ID_BACK':
            displayName = 'National ID (Back)';
            break;
          case 'PROFILE_PICTURE':
            displayName = 'Profile Picture';
            break;
          case 'PROOF_OF_ADDRESS':
            displayName = 'Proof of Residence';
            break;
          case 'ADDITIONAL_DOCUMENT':
            displayName = 'Additional Document';
            break;
          default:
            displayName = doc.documentType
              .split('_')
              .map(word => word.charAt(0) + word.slice(1).toLowerCase())
              .join(' ');
        }

        let status: DocumentItem['status'] = undefined;
        if (doc.isVerified !== undefined) {
          if (doc.isVerified) {
            status = 'verified';
          } else if (doc.verifiedAt) {
            status = 'rejected';
          } else {
            status = 'pending';
          }
        }

        return {
          id: doc.id,
          name: displayName,
          type: doc.documentType,
          status,
          updatedAt: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : undefined,
          fileUrl: doc.fileUrl,
          isVerified: doc.isVerified,
          verifiedAt: doc.verifiedAt,
        };
      });

      setDocuments(transformedDocs);
    } catch (err: any) {
      console.error('Failed to fetch documents:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load documents';
      setError(errorMessage);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Keyboard navigation handled inside shared DocumentViewer

  const getStatusStyles = (status?: DocumentItem['status']) => {
    if (!status) {
      return { 
        icon: <FileText className="w-5 h-5 text-slate-400" />, 
        text: 'text-slate-400', 
        bg: 'bg-slate-100 dark:bg-slate-800', 
        label: 'Uploaded' 
      };
    }

    switch (status) {
      case 'verified': 
        return { 
          icon: <CheckCircle2 className="w-5 h-5 text-success-main" />, 
          text: 'text-success-main', 
          bg: 'bg-success-main/10', 
          label: 'Verified' 
        };
      case 'pending': 
        return { 
          icon: <Clock className="w-5 h-5 text-blue-500" />, 
          text: 'text-blue-500', 
          bg: 'bg-blue-500/10', 
          label: 'Pending Review' 
        };
      case 'rejected': 
        return { 
          icon: <AlertCircle className="w-5 h-5 text-error-main" />, 
          text: 'text-error-main', 
          bg: 'bg-error-main/10', 
          label: 'Rejected' 
        };
      case 'missing': 
        return { 
          icon: <UploadCloud className="w-5 h-5 text-slate-400" />, 
          text: 'text-slate-400', 
          bg: 'bg-slate-100 dark:bg-slate-800', 
          label: 'Not Uploaded' 
        };
      default: 
        return { 
          icon: <FileText className="w-5 h-5 text-slate-400" />, 
          text: 'text-slate-400', 
          bg: 'bg-slate-100 dark:bg-slate-800', 
          label: 'Uploaded' 
        };
    }
  };

  const handleReupload = (documentType: string) => {
    // Open upload modal pre-filtered to this document type
    setIsUploadModalOpen(true);
    // Note: Future enhancement could pass documentType to focus on specific field
  };

  const handleViewDocument = (index: number) => {
    setCurrentDocumentIndex(index);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  // removed local viewer download/zoom/fullscreen handlers; shared viewer handles this

  const handleRefresh = () => {
    fetchDocuments();
  };

  // removed local viewer file type and current url helpers; shared viewer handles this

  if (isLoading) {
    return (
      <section className="bento-card p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bento-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold">KYC Documents</h2>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-error-main/10 border border-error-main/20 text-center">
          <AlertCircle className="w-8 h-8 text-error-main mx-auto mb-2" />
          <p className="text-error-main font-medium">{error}</p>
          <div className="flex gap-3 justify-center mt-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Try again
            </button>
            <button 
              onClick={() => setError(null)}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (documents.length === 0) {
    return (
      <section className="bento-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold">KYC Documents</h2>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="text-center p-8 border-2 border-dashed border-border rounded-xl">
          <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-medium text-slate-600 dark:text-slate-400 mb-1">No documents uploaded yet</h3>
          <p className="text-sm text-slate-500 mb-4">
            Upload your verification documents to complete your profile and access all features.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Documents
          </button>
        </div>

        {/* Upload Modal - Correctly placed outside viewer */}
        {isUploadModalOpen && (
          <DocumentUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUploadComplete={fetchDocuments}
            existingDocuments={documents.map(d => ({ 
              type: d.type as DocumentType, 
              name: d.name 
            }))}
          />
        )}
      </section>
    );
  }

  return (
    <>
      <section className="bento-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold">KYC Documents</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-slate-500">
              {documents.length} Document{documents.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              Upload More
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {documents.map((doc, index) => {
            const style = getStatusStyles(doc.status);
            return (
              <div key={doc.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${style.bg} transition-transform group-hover:scale-110`}>
                    {style.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{doc.name}</h4>
                    <p className="text-xs text-slate-500">
                      Uploaded: {doc.updatedAt || 'Date not available'}
                    </p>
                    {doc.verifiedAt && (
                      <p className="text-xs text-slate-500 mt-1">
                        Verified: {new Date(doc.verifiedAt).toLocaleDateString()}
                      </p>
                    )}
                    {doc.isVerified === false && !doc.verifiedAt && (
                      <p className="text-xs text-slate-500 mt-1">
                        Status: Pending verification
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {doc.status && doc.status !== 'missing' && (
                    <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                      {style.label}
                    </span>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDocument(index)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white text-xs font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-sm hover:shadow-md"
                      title="View document"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    
                    <a 
                      href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `${API_BASE_URL}${doc.fileUrl}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                    
                    {doc.status === 'rejected' && (
                      <button 
                        onClick={() => handleReupload(doc.type)}
                        className="flex items-center gap-2 px-3 py-2 bg-error-main hover:bg-error-main/90 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                      >
                        <RefreshCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Re-upload</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Messages */}
        {documents.some(doc => doc.status === 'pending') && (
          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold">Documents Under Review</p>
                <p className="mt-1">Some of your documents are pending verification. This process usually takes 1-3 business days.</p>
              </div>
            </div>
          </div>
        )}

        {documents.some(doc => doc.status === 'rejected') && (
          <div className="mt-6 p-4 rounded-lg bg-error-main/10 border border-error-main/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error-main mt-0.5 shrink-0" />
              <div className="text-sm text-error-main">
                <p className="font-semibold">Action Required</p>
                <p className="mt-1">Some documents have been rejected. Please re-upload clear, valid documents to complete your verification.</p>
              </div>
            </div>
          </div>
        )}

        {documents.every(doc => doc.status === 'verified') && (
          <div className="mt-6 p-4 rounded-lg bg-success-main/10 border border-success-main/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success-main mt-0.5 shrink-0" />
              <div className="text-sm text-success-main">
                <p className="font-semibold">Verification Complete</p>
                <p className="mt-1">All your documents have been verified and approved. Thank you for completing the KYC process.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {isViewerOpen && (
        <DocumentViewer
          documents={documents.map(d => ({ id: d.id, name: d.name, fileUrl: d.fileUrl, documentType: d.type }))}
          initialIndex={currentDocumentIndex}
          onClose={() => setIsViewerOpen(false)}
        />
      )}

      {/* Document Upload Modal - CORRECTLY PLACED OUTSIDE VIEWER MODAL */}
      {isUploadModalOpen && (
        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadComplete={fetchDocuments}
          existingDocuments={documents.map(d => ({ 
            type: d.type as DocumentType, 
            name: d.name 
          }))}
        />
      )}
    </>
  );
};
