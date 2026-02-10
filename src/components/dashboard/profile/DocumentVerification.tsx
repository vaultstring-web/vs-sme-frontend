"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/apiClient';
import { 
  FileText, CheckCircle2, Clock, AlertCircle, UploadCloud, 
  RefreshCcw, Loader2, Eye, Download, X, ZoomIn, ZoomOut, 
  ChevronLeft, ChevronRight, Maximize2, Minimize2 
} from 'lucide-react';

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
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch documents from backend
  const fetchDocuments = async () => {
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
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseViewer();
      } else if (e.key === 'ArrowLeft') {
        handlePrevDocument();
      } else if (e.key === 'ArrowRight') {
        handleNextDocument();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isViewerOpen, currentDocumentIndex, documents.length]);

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
    console.log('Reupload requested for:', documentType);
    alert(`Re-upload feature for ${documentType} would open here`);
  };

  const handleViewDocument = (index: number) => {
    setCurrentDocumentIndex(index);
    setIsViewerOpen(true);
    setZoom(100);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setZoom(100);
    setIsFullscreen(false);
  };

  const handleNextDocument = () => {
    if (currentDocumentIndex < documents.length - 1) {
      setCurrentDocumentIndex(currentDocumentIndex + 1);
      setZoom(100);
    }
  };

  const handlePrevDocument = () => {
    if (currentDocumentIndex > 0) {
      setCurrentDocumentIndex(currentDocumentIndex - 1);
      setZoom(100);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownloadDocument = async (fileUrl: string, fileName: string) => {
    try {
      const fullUrl = fileUrl.startsWith('http') 
        ? fileUrl 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${fileUrl}`;
      
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download document');
    }
  };

  const handleRefresh = () => {
    fetchDocuments();
  };

  const getFileType = (fileUrl: string): 'pdf' | 'image' | 'unknown' => {
    const url = fileUrl.toLowerCase();
    if (url.endsWith('.pdf')) return 'pdf';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    return 'unknown';
  };

  const currentDocument = documents[currentDocumentIndex];
  const currentFileUrl = currentDocument 
    ? (currentDocument.fileUrl.startsWith('http') 
        ? currentDocument.fileUrl 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${currentDocument.fileUrl}`)
    : '';
  const currentFileType = currentDocument ? getFileType(currentDocument.fileUrl) : 'unknown';

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
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            Upload Documents
          </button>
        </div>
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
                    
                    <button 
                      onClick={() => handleDownloadDocument(doc.fileUrl, doc.name)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    
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

      {/* Elegant Document Viewer Modal */}
      {isViewerOpen && currentDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Container */}
          <div className={`relative bg-background rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
            isFullscreen ? 'w-full h-full rounded-none' : 'w-11/12 h-5/6 max-w-6xl'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${getStatusStyles(currentDocument.status).bg}`}>
                  {getStatusStyles(currentDocument.status).icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{currentDocument.name}</h3>
                  <p className="text-xs text-slate-500">
                    {currentDocumentIndex + 1} of {documents.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls (only for images) */}
                {currentFileType === 'image' && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      disabled={zoom <= 50}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Zoom out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-12 text-center">
                      {zoom}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoom >= 200}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Zoom in"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-border mx-1"></div>
                  </>
                )}

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>

                {/* Download */}
                <button
                  onClick={() => handleDownloadDocument(currentDocument.fileUrl, currentDocument.name)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>

                {/* Close */}
                <button
                  onClick={handleCloseViewer}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Display Area */}
            <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-900/50">
              {currentFileType === 'image' && (
                <div className="w-full h-full overflow-auto custom-scrollbar flex items-center justify-center p-8">
                  <img
                    src={currentFileUrl}
                    alt={currentDocument.name}
                    className="transition-transform duration-200 shadow-lg rounded-lg"
                    style={{ 
                      transform: `scale(${zoom / 100})`,
                      maxWidth: '100%',
                      height: 'auto'
                    }}
                  />
                </div>
              )}

              {currentFileType === 'pdf' && (
                <iframe
                  src={currentFileUrl}
                  className="w-full h-full border-0"
                  title={currentDocument.name}
                />
              )}

              {currentFileType === 'unknown' && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <FileText className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Preview not available</p>
                  <p className="text-sm mt-2">Please download the file to view it</p>
                  <button
                    onClick={() => handleDownloadDocument(currentDocument.fileUrl, currentDocument.name)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Document
                  </button>
                </div>
              )}

              {/* Navigation Arrows */}
              {documents.length > 1 && (
                <>
                  <button
                    onClick={handlePrevDocument}
                    disabled={currentDocumentIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                    title="Previous (←)"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNextDocument}
                    disabled={currentDocumentIndex === documents.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                    title="Next (→)"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Footer with Document Info */}
            <div className="px-6 py-4 border-t border-border bg-card/50 backdrop-blur-sm rounded-b-2xl">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-500">Status: </span>
                    <span className={`font-semibold ${getStatusStyles(currentDocument.status).text}`}>
                      {getStatusStyles(currentDocument.status).label}
                    </span>
                  </div>
                  {currentDocument.updatedAt && (
                    <div>
                      <span className="text-slate-500">Uploaded: </span>
                      <span className="font-medium">{currentDocument.updatedAt}</span>
                    </div>
                  )}
                </div>
                
                {documents.length > 1 && (
                  <div className="flex gap-1">
                    {documents.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentDocumentIndex(idx);
                          setZoom(100);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentDocumentIndex 
                            ? 'bg-primary-500 w-6' 
                            : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                        }`}
                        title={documents[idx].name}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};