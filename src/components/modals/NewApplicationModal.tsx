'use client';

import { X, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewApplicationModal({ isOpen, onClose }: NewApplicationModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with theme-aware background */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container: Uses your .bento-card class */}
      <div className="bento-card relative w-full max-w-md p-6 bg-card shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">New Application</h2>
            <p className="text-sm text-foreground/60 mt-1">Select your preferred loan product</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        {/* Selection Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <Link 
            href="/dashboard/sme"
            onClick={onClose}
            className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary-500 hover:bg-primary-500/5 transition-all"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-foreground group-hover:text-primary-600 transition-colors">SME Loan</span>
              <span className="text-xs text-foreground/50">Business capital and startup funding</span>
            </div>
          </Link>

          <Link 
            href="/dashboard/payroll"
            onClick={onClose}
            className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary-500 hover:bg-primary-500/5 transition-all"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-foreground group-hover:text-primary-600 transition-colors">Payroll Loan</span>
              <span className="text-xs text-foreground/50">Personal loans via salary deduction</span>
            </div>
          </Link>
        </div>

        {/* Footer info */}
        {/* <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-foreground/40">
            Need help deciding? <Link href="/support" className="text-primary-600 hover:underline">Contact Support</Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}