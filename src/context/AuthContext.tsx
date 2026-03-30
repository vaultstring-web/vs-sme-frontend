'use client';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getSession, setSession, clearSession, initializeSessionSync, setLoggedInCookie, clearLoggedInCookie } from '../utils/sessionStorage';
import apiClient from '../lib/apiClient';
import { RegisterRequest, PasswordResetConfirm, Role, Permission } from '../types/api';
import { 
  getUserPermissions, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions 
} from '../lib/permissions';

interface User {
    id: string;
    email: string;
    name: string;
    fullName: string;
    role: Role;
    permissions: Permission[];
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthContextType extends AuthState {
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isLoanManager: boolean;
    isAccountant: boolean;
    isLoanOfficer: boolean;
    isAuditor: boolean;
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
    login: (data: { email: string; password: string }) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    resetPasswordRequest: (email: string) => Promise<void>;
    resetPasswordConfirm: (data: PasswordResetConfirm) => Promise<void>;
    changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
    uploadDocuments: (formData: FormData) => Promise<void>;
    clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });

    // 🛡️ Promise cache for duplicate API calls
    const pendingRegistrations = new Map<string, Promise<void>>();

    const uploadDocuments = async (formData: FormData) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await apiClient.post('/auth/users/me/documents', formData, {
                headers: {
                    'Content-Type': undefined
                }
            });
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error.response?.data?.message || error.message || 'Document upload failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await apiClient.post('/auth/change-password', data);
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error.response?.data?.message || error.message || 'Password change failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await apiClient.get('/auth/users/me');
            const userData = response.data.user;
            
            // Type cast role to ensure it's a valid Role type
            const role = userData.role as Role;
            
            const user: User = {
                id: userData.id,
                email: userData.email,
                name: userData.fullName || userData.name,
                fullName: userData.fullName,
                role,
                permissions: getUserPermissions(role)
            };
            
            setState(prev => ({ 
                ...prev, 
                user, 
                isAuthenticated: true, 
                isLoading: false 
            }));
            
            const { accessToken, refreshToken } = getSession();
            if (accessToken && refreshToken) {
                setSession(accessToken, refreshToken, user);
            }
        } catch (err) {
            console.error('Failed to fetch current user:', err);
            clearSession();
            setState(prev => ({ 
                ...prev, 
                user: null, 
                isAuthenticated: false, 
                isLoading: false 
            }));
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const { accessToken, user } = getSession();
            
            if (accessToken) {
                if (user) {
                    setState(prev => ({ 
                        ...prev, 
                        user, 
                        isAuthenticated: true, 
                        isLoading: true 
                    }));
                    await fetchCurrentUser();
                } else {
                    await fetchCurrentUser();
                }
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        initializeAuth();

        return initializeSessionSync(() => {
            const { accessToken, user } = getSession();
            if (accessToken && user) {
                setState(prev => ({ ...prev, user, isAuthenticated: true }));
            } else {
                setState(prev => ({ ...prev, user: null, isAuthenticated: false }));
            }
        });
    }, []);

    const login = async (data: { email: string; password: string }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await apiClient.post('/auth/login', data);
            const { accessToken, refreshToken, profile } = response.data;
            
            // Type cast role to ensure it's a valid Role type
            const role = profile.role as Role;
            
            const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.fullName,
                fullName: profile.fullName,
                role,
                permissions: getUserPermissions(role)
            };
            
            setSession(accessToken, refreshToken, user);
            setLoggedInCookie();
            setState({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    const register = async (data: RegisterRequest) => {
        // 🛡️ Prevent duplicate registration calls with identical payload
        const key = JSON.stringify(data);
        if (pendingRegistrations.has(key)) {
            return pendingRegistrations.get(key);
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const promise = (async () => {
            try {
                const response = await apiClient.post('/auth/register', data);
                const { accessToken, refreshToken, profile } = response.data;
                
                // Type cast role to ensure it's a valid Role type
                const role = profile.role as Role;
                
                const user: User = {
                    id: profile.id,
                    email: profile.email,
                    name: profile.fullName,
                    fullName: profile.fullName,
                    role,
                    permissions: getUserPermissions(role)
                };
                
                setSession(accessToken, refreshToken, user);
                setLoggedInCookie();
                setState({ user, isAuthenticated: true, isLoading: false, error: null });
            } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } }; message?: string };
                const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
                setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
                throw err;
            } finally {
                pendingRegistrations.delete(key);
            }
        })();

        pendingRegistrations.set(key, promise);
        return promise;
    };

    const logout = async () => {
        try {
            const { refreshToken } = getSession();
            await apiClient.post('/auth/logout', { refreshToken });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            clearSession();
            clearLoggedInCookie();
            setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
    };

    const resetPasswordRequest = async (email: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await apiClient.post('/auth/password-reset/request', { email });
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error.response?.data?.message || error.message || 'Password reset request failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    const resetPasswordConfirm = async (data: PasswordResetConfirm) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await apiClient.post('/auth/password-reset/confirm', data);
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error.response?.data?.message || error.message || 'Password reset failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    // Role checks
    const isSuperAdmin = state.user?.role === 'SUPER_ADMIN';
    const isLoanManager = state.user?.role === 'LOAN_MANAGER';
    const isAccountant = state.user?.role === 'ACCOUNTANT';
    const isLoanOfficer = state.user?.role === 'LOAN_OFFICER';
    const isAuditor = state.user?.role === 'AUDITOR';
    
    // Legacy admin check (SUPER_ADMIN, LOAN_MANAGER, ACCOUNTANT are considered admins)
    const isAdmin = isSuperAdmin || isLoanManager || isAccountant;

    // Permission checking helpers
    const checkPermission = (permission: Permission): boolean => {
        if (!state.user) return false;
        return hasPermission(state.user.role, permission);
    };

    const checkAnyPermission = (permissions: Permission[]): boolean => {
        if (!state.user) return false;
        return hasAnyPermission(state.user.role, permissions);
    };

    const checkAllPermissions = (permissions: Permission[]): boolean => {
        if (!state.user) return false;
        return hasAllPermissions(state.user.role, permissions);
    };

    return (
        <AuthContext.Provider value={{ 
            ...state, 
            isAdmin,
            isSuperAdmin,
            isLoanManager,
            isAccountant,
            isLoanOfficer,
            isAuditor,
            hasPermission: checkPermission,
            hasAnyPermission: checkAnyPermission,
            hasAllPermissions: checkAllPermissions,
            login, 
            register, 
            uploadDocuments,
            logout, 
            resetPasswordRequest, 
            resetPasswordConfirm,
            changePassword,
            fetchCurrentUser,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
};