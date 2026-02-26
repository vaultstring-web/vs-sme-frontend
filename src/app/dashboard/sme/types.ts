export interface SmeFormData {
  // Business Details
  businessName: string;
  registrationNo: string;
  businessType: string;
  yearsInOperation: number;
  
  // Loan Requests
  loanProduct: string;
  loanAmount: number;
  paybackPeriodMonths: number;
  purposeOfLoan: string;
  repaymentMethod: string;
  estimatedMonthlyTurnover: number;
  estimatedMonthlyProfit: number;
  
  // Group Lending
  isGroupLending: boolean;
  groupName: string;
  groupMemberCount: number;
  
  // Credit History
  hasOutstandingLoans: boolean;
  outstandingLoanDetails: string;
  hasDefaulted: boolean;
  defaultExplanation: string;
  
  // Documents
  idDocument: File | null;
  businessRegistrationDoc: File | null;
  financialStatementDoc: File | null;
  
  // Declarations
  agreeToTerms: boolean;
  consentToCreditCheck: boolean;
}