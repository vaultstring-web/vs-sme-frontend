'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, File, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Document type definitions (must match backend)
export type DocumentType = 
  | 'NATIONAL_ID_FRONT'
  | 'NATIONAL_ID_BACK'
  | 'PROFILE_PICTURE'
  | 'PROOF_OF_ADDRESS'
  | 'ADDITIONAL_DOCUMENT';

interface DocumentRequirement {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
  accept: string;
  maxSize: number; // in bytes
  multiple?: boolean;
}

const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    type: 'NATIONAL_ID_FRONT',
    label: 'National ID (Front)',
    description: 'Front side of your national ID or passport',
    required: true,
    accept: 'image/*,.pdf',
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  {
    type: 'NATIONAL_ID_BACK',
    label: 'National ID (Back)',
    description: 'Back side of your national ID (if applicable)',
    required: false,
    accept: 'image/*,.pdf',
    maxSize: 5 * 1024 * 1024,
  },
  {
    type: 'PROFILE_PICTURE',
    label: 'Profile Picture',
    description: 'Recent clear photo of yourself',
    required: true,
    accept: 'image/*',
    maxSize: 2 * 1024 * 1024, // 2MB
  },
  {
    type: 'PROOF_OF_ADDRESS',
    label: 'Proof of Address',
    description: 'Utility bill or official document showing your address',
    required: true,
    accept: 'image/*,.pdf',
    maxSize: 5 * 1024 * 1024,
  },
  {
    type: 'ADDITIONAL_DOCUMENT',
    label: 'Additional Documents',
    description: 'Any other supporting documents (optional)',
    required: false,
    accept: 'image/*,.pdf,.doc,.docx',
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  },
];

// Map document type to form field name expected by backend
const DOCUMENT_TYPE_TO_FIELD: Record<DocumentType, string> = {
  NATIONAL_ID_FRONT: 'nationalIdFront',
  NATIONAL_ID_BACK: 'nationalIdBack',
  PROFILE_PICTURE: 'profilePicture',
  PROOF_OF_ADDRESS: 'proofOfAddress',
  ADDITIONAL_DOCUMENT: 'additionalDocuments',
};

interface SelectedFile {
  id: string;
  file: File;
  type: DocumentType;
  preview?: string;
}

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void; // Callback to refresh document list
  existingDocuments?: { type: DocumentType; name: string }[]; // Optional, to show already uploaded
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  existingDocuments = [],
}) => {
  const { uploadDocuments, isLoading: authLoading } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fileInputRefs = useRef<Record<DocumentType, HTMLInputElement | null>>({} as any);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const requirement = DOCUMENT_REQUIREMENTS.find(r => r.type === type)!;

    // Clear previous validation error for this type
    setValidationErrors(prev => ({ ...prev, [type]: '' }));

    Array.from(files).forEach(file => {
      // Size validation
      if (file.size > requirement.maxSize) {
        setValidationErrors(prev => ({
          ...prev,
          [type]: `File too large (max ${requirement.maxSize / (1024 * 1024)}MB)`,
        }));
        return;
      }

      // Type validation (basic)
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isDoc = file.name.match(/\.(doc|docx)$/i);
      const allowedTypes = requirement.accept.split(',');
      const isValid = allowedTypes.some(pattern => {
        if (pattern === 'image/*' && isImage) return true;
        if (pattern === '.pdf' && isPdf) return true;
        if (pattern === '.doc,.docx' && isDoc) return true;
        if (pattern === '.doc' && file.name.endsWith('.doc')) return true;
        if (pattern === '.docx' && file.name.endsWith('.docx')) return true;
        return false;
      });

      if (!isValid) {
        setValidationErrors(prev => ({
          ...prev,
          [type]: `File type not allowed. Accepted: ${requirement.accept}`,
        }));
        return;
      }

      const id = `${type}-${Date.now()}-${Math.random()}`;
      const preview = isImage ? URL.createObjectURL(file) : undefined;

      // For non-multiple, replace existing files of same type
      if (!requirement.multiple) {
        setSelectedFiles(prev => prev.filter(f => f.type !== type));
      }

      setSelectedFiles(prev => [...prev, { id, file, type, preview }]);
    });

    e.target.value = ''; // Reset input so same file can be selected again
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const validateRequired = (): boolean => {
    const missing: Record<string, string> = {};
    DOCUMENT_REQUIREMENTS.forEach(req => {
      if (req.required) {
        const hasFile = selectedFiles.some(f => f.type === req.type);
        if (!hasFile) {
          missing[req.type] = `${req.label} is required`;
        }
      }
    });
    setValidationErrors(missing);
    return Object.keys(missing).length === 0;
  };

  const handleUpload = async () => {
    if (!validateRequired()) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate progress (actual upload progress is not easily trackable with fetch)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      const formData = new FormData();
      selectedFiles.forEach(item => {
        const field = DOCUMENT_TYPE_TO_FIELD[item.type];
        formData.append(field, item.file, item.file.name);
      });

      await uploadDocuments(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Wait a bit to show completion
      setTimeout(() => {
        onUploadComplete();
        onClose();
        // Reset state
        setSelectedFiles([]);
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || 'Upload failed');
      setIsUploading(false);
    }
  };

  const getExistingCount = (type: DocumentType) => {
    return existingDocuments.filter(doc => doc.type === type).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Upload KYC Documents</h2>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {error && (
            <div className="p-4 rounded-lg bg-error-main/10 border border-error-main/20 text-error-main text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {DOCUMENT_REQUIREMENTS.map(req => {
            const hasExisting = getExistingCount(req.type) > 0;
            const filesForType = selectedFiles.filter(f => f.type === req.type);
            const validationError = validationErrors[req.type];

            return (
              <div key={req.type} className="border border-border rounded-xl p-4 bg-card/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {req.label}
                      {req.required && (
                        <span className="text-xs px-2 py-0.5 bg-error-main/10 text-error-main rounded-full font-bold">
                          REQUIRED
                        </span>
                      )}
                      {hasExisting && (
                        <span className="text-xs px-2 py-0.5 bg-success-main/10 text-success-main rounded-full font-bold">
                          Uploaded
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{req.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Max size: {req.maxSize / (1024 * 1024)}MB • Accepted: {req.accept}
                    </p>
                  </div>

                  <input
                    ref={el => { fileInputRefs.current[req.type] = el; }}
                    type="file"
                    accept={req.accept}
                    multiple={req.multiple}
                    onChange={(e) => handleFileChange(e, req.type)}
                    className="hidden"
                    id={`file-${req.type}`}
                  />
                  <label
                    htmlFor={`file-${req.type}`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    {filesForType.length > 0 ? 'Add more' : 'Select file'}
                  </label>
                </div>

                {/* Selected files list */}
                {filesForType.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {filesForType.map(file => (
                      <div key={file.id} className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          {file.preview ? (
                            <img src={file.preview} alt="preview" className="w-8 h-8 object-cover rounded" />
                          ) : (
                            <File className="w-5 h-5 text-slate-400" />
                          )}
                          <span className="text-sm truncate max-w-50">{file.file.name}</span>
                          <span className="text-xs text-slate-500">
                            {(file.file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-slate-500 hover:text-error-main transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {validationError && (
                  <p className="text-xs text-error-main font-medium mt-2">{validationError}</p>
                )}
              </div>
            );
          })}

          {/* Info note */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">📋 Note</p>
            <p>Uploading new documents will add them to your profile. If you need to replace an existing document, please remove the old one first (not yet supported).</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-card/50">
          <div className="text-sm text-slate-500">
            {selectedFiles.length} file(s) selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="relative px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-30"
            >
              {isUploading ? (
                <>
                  <span className="opacity-0">Upload</span>
                  <span className="absolute inset-0 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadProgress}%
                  </span>
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};