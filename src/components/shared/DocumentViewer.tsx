'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Minimize2, Maximize2, FileText } from 'lucide-react';
import { API_BASE_URL } from '@/lib/apiClient';

type Doc = {
  id?: string;
  name: string;
  fileUrl: string;
  documentType?: string;
};

function toAbsolute(url: string) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url}`;
}

function getType(url: string): 'image' | 'pdf' | 'unknown' {
  const u = url.toLowerCase();
  if (u.endsWith('.png') || u.endsWith('.jpg') || u.endsWith('.jpeg') || u.endsWith('.gif') || u.endsWith('.webp')) return 'image';
  if (u.endsWith('.pdf')) return 'pdf';
  return 'unknown';
}

export default function DocumentViewer({
  documents,
  initialIndex = 0,
  onClose,
}: {
  documents: Doc[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(100);
  const current = documents[index];
  const absUrl = useMemo(() => toAbsolute(current?.fileUrl || ''), [current]);
  const type = useMemo(() => getType(absUrl), [absUrl]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIndex(i => Math.min(documents.length - 1, i + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [documents.length, onClose]);

  useEffect(() => {
    setZoom(100);
  }, [index]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full h-full p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">{current.name}</span>
            <span className="text-white/60 text-xs">{current.documentType}</span>
          </div>
          <div className="flex items-center gap-2">
            {documents.length > 1 && (
              <>
                <button
                  onClick={() => setIndex(i => Math.max(0, i - 1))}
                  disabled={index === 0}
                  className="p-2 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIndex(i => Math.min(documents.length - 1, i + 1))}
                  disabled={index === documents.length - 1}
                  className="p-2 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            {type === 'image' && (
              <>
                <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-2 rounded bg-white/10 text-white hover:bg-white/20">
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button onClick={() => setZoom(100)} className="p-2 rounded bg-white/10 text-white hover:bg-white/20">
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-2 rounded bg-white/10 text-white hover:bg-white/20">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button onClick={() => setZoom(z => (z === 100 ? 150 : 100))} className="p-2 rounded bg-white/10 text-white hover:bg-white/20">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </>
            )}
            <a
              href={absUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-white/10 text-white hover:bg-white/20"
            >
              <Download className="w-5 h-5" />
            </a>
            <button onClick={onClose} className="p-2 rounded bg-white/10 text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg overflow-hidden flex items-center justify-center">
          {type === 'image' && (
            <img
              src={absUrl}
              alt={current.name}
              className="max-w-none"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          )}
          {type === 'pdf' && (
            <iframe
              src={absUrl}
              className="w-full h-full border-0"
              title={current.name}
            />
          )}
          {type === 'unknown' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <FileText className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Preview not available</p>
              <a
                href={absUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
