// src/components/dashboard/HeaderSection.tsx
'use client';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ApplicationTypeSelector } from '@/components/dashboard/ApplicationTypeSelector';

interface HeaderSectionProps {
  applicationType: 'sme' | 'payroll';
  onTypeChange: (type: 'sme' | 'payroll') => void;
}

export default function HeaderSection({ applicationType, onTypeChange }: HeaderSectionProps) {
  const { user } = useContext(AuthContext)!;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        {user ? (
          <>
            <p className="text-lg text-foreground">Welcome back, {user.fullName}</p>
            <p className="text-sm text-foreground/60">{user.email}</p>
          </>
        ) : (
          <p className="text-lg text-foreground">Welcome back!</p>
        )}
      </div>
      <div className="lg:w-auto">
        <ApplicationTypeSelector 
          selectedType={applicationType}
          onTypeChange={onTypeChange}
        />
      </div>
    </div>
  );
}
