// API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  nationalIdOrPassport: string;
  primaryPhone: string;
  secondaryPhone?: string;
  physicalAddress: string;
  postalAddress?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// API Response Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  profile: {
    id: string;
    email: string;
    fullName: string;
    role: "APPLICANT" | "ADMIN_TIER1" | "ADMIN_TIER2";
  };
}

export interface ErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

// Admin Application Types
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED"
  | "REPAYED"
  | "DEFAULTED";
export type ApplicationType = "SME" | "PAYROLL";
export type PriorityLevel = "low" | "normal" | "high";

export interface User {
  id: string;
  fullName: string;
  email: string;
  primaryPhone: string;
  secondaryPhone?: string;
}

export interface Reviewer {
  id: string;
  fullName: string;
  email?: string;
}

export interface ApplicationDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  notes?: string;
  timestamp: string;
  actor: {
    id: string;
    fullName: string;
  };
  beforeValue?: Record<string, any>;
  afterValue?: Record<string, any>;
}

export interface SMEApplicationData {
  id?: string;
  applicationId?: string;
  businessName: string;
  businessRegistration: string;
  yearsInOperation: number;
  monthlyRevenue: number;
  loanAmount: number;
  loanPurpose: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PayrollApplicationData {
  id?: string;
  applicationId?: string;
  employerName: string;
  monthlyIncome: number;
  employmentStatus: string;
  loanAmount: number;
  loanPurpose: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  amount: number;
  user: User;
  assignedReviewer?: Reviewer | null;
  priority?: PriorityLevel;
  notes?: string;
  documents: ApplicationDocument[];
  auditLogs: AuditLog[];
  smeData?: SMEApplicationData;
  payrollData?: PayrollApplicationData;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface ApplicationListResponse {
  data: Application[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ActivityLog extends AuditLog {
  application: {
    id: string;
    type: ApplicationType;
    status: ApplicationStatus;
    user: User;
  };
}

export interface ActivityListResponse {
  data: ActivityLog[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface StatsResponse {
  byStatus: Array<{
    status: ApplicationStatus;
    _count: {
      _all: number;
    };
  }>;
  totalApplications: number;
  pendingReview: number;
  avgProcessingTime: number;
}
