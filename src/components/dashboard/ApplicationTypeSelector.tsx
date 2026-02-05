// src/components/dashboard/ApplicationTypeSelector.tsx
'use client';

import { Building2, Users } from 'lucide-react';

interface ApplicationTypeSelectorProps {
  selectedType: 'sme' | 'payroll';
  onTypeChange: (type: 'sme' | 'payroll') => void;
}

export function ApplicationTypeSelector({ selectedType, onTypeChange }: ApplicationTypeSelectorProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-card border border-border rounded-xl">
      <button
        onClick={() => onTypeChange('sme')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          selectedType === 'sme'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'hover:bg-card/50 text-foreground/60'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span className="text-sm font-medium">SME</span>
      </button>
      <button
        onClick={() => onTypeChange('payroll')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
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