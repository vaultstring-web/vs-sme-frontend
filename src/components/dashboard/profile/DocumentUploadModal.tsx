'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Upload, File, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LocalFilePreviewModal from '@/components/shared/LocalFilePreviewModal';
import Modal from '@/components/ui/Modal';

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
  previewUrl?: string; // local object URL for preview (image/pdf thumbnails)
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
  const [previewing, setPreviewing] = useState<SelectedFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fileInputRefs = useRef<Record<DocumentType, HTMLInputElement | null>>({} as any);

  // Cleanup local object URLs on unmount/close.
  // Without this, closing the modal after selecting files can leak blob URLs.
  // (We also revoke URLs when removing a single file.)
  useEffect(() => {
    return () => {
      for (const f of selectedFiles) {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      }
    };
  }, [selectedFiles]);

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
      const previewUrl = (isImage || isPdf) ? URL.createObjectURL(file) : undefined;

      // For non-multiple, replace existing files of same type
      if (!requirement.multiple) {
        setSelectedFiles(prev => {
          for (const f of prev) {
            if (f.type === type && f.previewUrl) URL.revokeObjectURL(f.previewUrl);
          }
          return prev.filter(f => f.type !== type);
        });
      }

      setSelectedFiles(prev => [...prev, { id, file, type, previewUrl }]);
    });

    e.target.value = ''; // Reset input so same file can be selected again
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
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
    <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload KYC Documents"
      maxWidthClassName="max-w-3xl"
      className="border border-border bg-background"
      contentClassName="!p-4 sm:!p-6"
      footer={
        <>
          <div className="w-full text-sm text-slate-500 sm:mr-auto sm:w-auto">
            {selectedFiles.length} file(s) selected
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="min-h-11 w-full rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleUpload()}
            disabled={isUploading || selectedFiles.length === 0}
            className="relative min-h-11 w-full min-w-[7.5rem] rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isUploading ? (
              <>
                <span className="opacity-0">Upload</span>
                <span className="absolute inset-0 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadProgress}%
                </span>
              </>
            ) : (
              'Upload'
            )}
          </button>
        </>
      }
    >
      <div className="custom-scrollbar space-y-6">
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
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
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
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:w-auto sm:shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    {filesForType.length > 0 ? 'Add more' : 'Select file'}
                  </label>
                </div>

                {/* Selected files list */}
                {filesForType.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {filesForType.map(file => (
                      <div key={file.id} className="flex flex-col gap-2 rounded-lg bg-slate-50 p-2 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {file.previewUrl && file.file.type.startsWith('image/') ? (
                            <img src={file.previewUrl} alt="preview" className="w-8 h-8 object-cover rounded" />
                          ) : (
                            <File className="w-5 h-5 text-slate-400" />
                          )}
                          <span className="max-w-[10rem] truncate text-sm sm:max-w-xs">{file.file.name}</span>
                          <span className="text-xs text-slate-500">
                            {(file.file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewing(file)}
                            className="rounded-md px-2 py-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/20"
                            aria-label={`Preview ${file.file.name}`}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md p-2 text-slate-500 transition-colors hover:text-error-main"
                            aria-label={`Remove ${file.file.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
    </Modal>

      {previewing && (
        <LocalFilePreviewModal
          file={previewing.file}
          title={`${previewing.type.replaceAll('_', ' ')} preview`}
          onClose={() => setPreviewing(null)}
        />
      )}
    </>
  );
};