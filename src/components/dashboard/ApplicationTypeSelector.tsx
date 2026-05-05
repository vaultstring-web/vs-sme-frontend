// src/components/dashboard/ApplicationTypeSelector.tsx
'use client';

import { Building2, Users } from 'lucide-react';

interface ApplicationTypeSelectorProps {
  selectedType: 'sme' | 'payroll';
  onTypeChange: (type: 'sme' | 'payroll') => void;
}

export function ApplicationTypeSelector({ selectedType, onTypeChange }: ApplicationTypeSelectorProps) {
  return (
    <div className="flex w-full flex-wrap items-stretch gap-2 rounded-xl border border-border bg-card p-1">
      <button
        type="button"
        onClick={() => onTypeChange('sme')}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 transition-all sm:flex-none ${
          selectedType === 'sme'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'hover:bg-card/50 text-foreground/60'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span className="text-sm font-medium">SME</span>
      </button>
      <button
        type="button"
        onClick={() => onTypeChange('payroll')}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 transition-all sm:flex-none ${
          selectedType === 'payroll'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'hover:bg-card/50 text-foreground/60'
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">Payroll</span>
      </button>
    </div>
  );
}