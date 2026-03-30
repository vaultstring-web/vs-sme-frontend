// API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  nationalId: string;
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

// Role Types
export type Role = 
  | "APPLICANT" 
  | "LOAN_OFFICER" 
  | "ACCOUNTANT" 
  | "LOAN_MANAGER" 
  | "SUPER_ADMIN" 
  | "AUDITOR";

// Permission Types
export type Permission =
  | 'applications:view:all'
  | 'applications:view:own'
  | 'applications:approve'
  | 'applications:reject'
  | 'applications:recommend:approve'
  | 'applications:recommend:reject'
  | 'applications:edit:documents'
  | 'applications:request:documents'
  | 'loans:view:all'
  | 'loans:view:own'
  | 'loans:disburse'
  | 'loans:authorize:disbursement'
  | 'loans:restructure'
  | 'loans:write_off'
  | 'payments:record'
  | 'payments:edit'
  | 'payments:reverse'
  | 'payments:view:all'
  | 'payments:view:own'
  | 'documents:upload'
  | 'documents:verify'
  | 'documents:request'
  | 'users:manage'
  | 'users:change:role'
  | 'audit:view'
  | 'system:configure';

// API Response Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  profile: {
    id: string;
    email: string;
    fullName: string;
    nationalId: string;
    role: Role;
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
  | "LOAN_MANAGER_APPROVED"
  | "LOAN_MANAGER_REJECTED"
  | "APPROVED"
  | "APPROVED_FOR_DISBURSEMENT"
  | "REJECTED"
  | "DISBURSED"
  | "REPAYED"
  | "DEFAULTED"
  | "RESTRUCTURED";
export type ApplicationType = "SME" | "PAYROLL";
export type PriorityLevel = "low" | "normal" | "high";

export interface User {
  id: string;
  fullName: string;
  email: string;
  nationalId: string;
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
  comment?: string;
  timestamp: string;
  actor: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  application?: {
    id: string;
    type: string;
  };
  beforeValue?: Record<string, unknown>;
  afterValue?: Record<string, unknown>;
}

// Loan Management Types
export type LoanStatus = "ACTIVE" | "REPAYED" | "DEFAULTED" | "RESTRUCTURED";
export type ScheduleStatus = "PENDING" | "PAID" | "LATE" | "PARTIAL";

export interface PaymentSchedule {
  id: string;
  loanId: string;
  dueDate: string;
  amountDue: number;
  principalDue: number;
  interestDue: number;
  paidAmount: number;
  status: ScheduleStatus;
  paidDate?: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  scheduleId?: string;
  amount: number;
  paymentDate: string;
  method: string;
  referenceNo?: string;
  recordedBy: string;
  recorder?: { fullName: string };
  notes?: string;
}

export interface Loan {
  id: string;
  applicationId: string;
  userId: string;
  user?: User;
  totalPrincipal: number;
  totalInterest: number;
  totalRepayable: number;
  remainingBalance: number;
  interestRate: number;
  status: LoanStatus;
  startDate: string;
  endDate?: string;
  application?: {
    id: string;
    type: ApplicationType;
  };
  schedule?: PaymentSchedule[];
  payments?: LoanPayment[];
  createdAt: string;
  updatedAt: string;
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
  amount?: number;
  userId?: string;
  user: User;
  assignedReviewer?: Reviewer | null;
  priority?: PriorityLevel;
  notes?: string;
  documents: ApplicationDocument[];
  auditLogs: AuditLog[];
  smeData?: SMEApplicationData;
  payrollData?: PayrollApplicationData;
  
  // Manager Assessment
  managerId?: string | null;
  manager?: User | null;
  managerNotes?: string | null;
  managerAssessment?: string | null;
  managerRecommended?: string | null; // "APPROVE" | "REJECT"
  managerRecommendedAt?: string | null;
  managerRiskScore?: number | null;
  
  // CEO Approval
  approvedById?: string | null;
  approvedBy?: User | null;
  approvalNotes?: string | null;
  approvedAt?: string | null;
  
  // CEO Disbursement Authorization
  disbursalAuthorizedById?: string | null;
  disbursalAuthorizedBy?: User | null;
  disbursalAuthorizedAt?: string | null;
  authorizedAmount?: number | null;
  
  // Rejection
  rejectedById?: string | null;
  rejectedBy?: User | null;
  rejectionReason?: string | null;
  rejectedAt?: string | null;
  
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
