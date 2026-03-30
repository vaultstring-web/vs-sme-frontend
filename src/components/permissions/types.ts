import { ReactNode } from 'react';
import { Permission, Role } from '@/types/api';

export interface CanProps {
  permission?: Permission | Permission[];
  role?: Role | Role[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export interface CannotProps {
  permission?: Permission | Permission[];
  role?: Role | Role[];
  children: ReactNode;
  fallback?: ReactNode;
}
