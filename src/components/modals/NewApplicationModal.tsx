'use client';

import { Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewApplicationModal({ isOpen, onClose }: NewApplicationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Application"
      subtitle="Select your preferred loan product"
    >
      <div className="grid grid-cols-1 gap-4">
        <Link
          href="/dashboard/sme?new=true"
          onClick={onClose}
          className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary-500 hover:bg-primary-500/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="min-w-0 text-left">
            <span className="block font-bold text-foreground transition-colors group-hover:text-primary-600">
              SME Loan
            </span>
            <span className="text-xs text-foreground/50">Business capital and startup funding</span>
          </div>
        </Link>

        <Link
          href="/dashboard/payroll?new=true"
          onClick={onClose}
          className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-all hover:border-primary-500 hover:bg-primary-500/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div className="min-w-0 text-left">
            <span className="block font-bold text-foreground transition-colors group-hover:text-primary-600">
              Payroll Loan
            </span>
            <span className="text-xs text-foreground/50">Personal loans via salary deduction</span>
          </div>
        </Link>
      </div>
    </Modal>
  );
}
