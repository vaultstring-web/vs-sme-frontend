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
        role: 'APPLICANT' | 'ADMIN_TIER1' | 'ADMIN_TIER2';
    };
}

export interface ErrorResponse {
    message: string;
    error?: string;
    statusCode?: number;
}