'use client';

import { ReactNode } from 'react';

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Responsive page title row: icon + title stack cleanly; actions full-width on mobile.
 */
export default function PageHeader({ title, subtitle, icon, actions, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
        {icon != null && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-600 sm:h-10 sm:w-10">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h1>
          {subtitle != null && <div className="mt-1 text-sm text-foreground/60">{subtitle}</div>}
        </div>
      </div>
      {actions != null && (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
