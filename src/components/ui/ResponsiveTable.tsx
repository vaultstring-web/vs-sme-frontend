'use client';

import { ReactNode } from 'react';

export interface ResponsiveTableProps {
  children?: ReactNode;
  table?: ReactNode;
  mobileContent?: ReactNode;
  mobileCards?: ReactNode;
  minWidth?: number;
  className?: string;
}

/**
 * Wraps a wide table in horizontal scroll and optional mobile cards.
 */
export default function ResponsiveTable({
  children,
  table,
  mobileContent,
  mobileCards,
  minWidth = 720,
  className = '',
}: ResponsiveTableProps) {
  const desktopTable = table ?? (children != null ? <table className="w-full" style={{ minWidth: `${minWidth}px` }}>{children}</table> : null);
  const mobile = mobileContent ?? mobileCards;

  return (
    <div className={className}>
      {mobile != null && <div className="space-y-3 md:hidden">{mobile}</div>}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {desktopTable}
      </div>
    </div>
  );
}
