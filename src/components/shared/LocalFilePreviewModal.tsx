'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, FileText } from 'lucide-react';

function getKind(file: File): 'image' | 'pdf' | 'unknown' {
  if (file.type?.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  const n = file.name?.toLowerCase?.() ?? '';
  if (n.endsWith('.pdf')) return 'pdf';
  if (n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.gif') || n.endsWith('.webp')) return 'image';
  return 'unknown';
}

export default function LocalFilePreviewModal({
  file,
  title,
  onClose,
}: {
  file: File;
  title?: string;
  onClose: () => void;
}) {
  const kind = useMemo(() => getKind(file), [file]);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    // Create a local blob URL for in-browser preview.
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[85vh] bg-background rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {title || file.name}
            </div>
            <div className="text-xs text-foreground/60 truncate">
              {file.name} • {(file.size / 1024).toFixed(1)} KB
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 bg-white dark:bg-zinc-950">
          {kind === 'image' && objectUrl && (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={objectUrl}
                alt={title || file.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {kind === 'pdf' && objectUrl && (
            <iframe
              src={objectUrl}
              className="w-full h-full border-0"
              title={title || file.name}
            />
          )}

          {kind === 'unknown' && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
              <FileText className="w-14 h-14 mb-3" />
              <div className="text-base font-medium text-foreground">Preview not available</div>
              <div className="mt-1 text-sm text-foreground/60">
                This file type can’t be previewed in the browser. Please confirm the file name before uploading.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

