// src/app/dashboard/types.ts

import { Application } from '@/context/ApplicationsContext';

export interface DashboardStats {
  totalApplications: number;
  draftCount: number;
  submittedCount: number;
  underReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  defaultedCount: number;
  smeCount: number;
  payrollCount: number;
  totalDisbursed: number;
  approvalRate: number; // 0-100
}

export interface ActiveLoan {
  id: string;
  reference: string; // truncated id or custom format
  amount: number;
  status: Application['status'];
  submittedAt: string | null;
  type: Application['type'];
  employerName?: string;
  businessName?: string;
}

export interface RecentApplication {
  id: string;
  reference: string;
  type: Application['type'];
  amount: number;
  status: Application['status'];
  submittedAt: string | null;
  createdAt: string;
}