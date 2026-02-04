'use client';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getSession, setSession, clearSession, initializeSessionSync } from '../utils/sessionStorage';
import apiClient from '../lib/apiClient';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthContextType extends AuthState {
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    resetPasswordRequest: (email: string) => Promise<void>;
    resetPasswordConfirm: (data: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });

    // Initialize session from storage
    useEffect(() => {
        const { token, user } = getSession();
        if (token && user) {
            // Validate token validity if needed, for now just trust storage
            setState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));

            // Setup axios interceptor dynamically? 
            // Ideally apiClient should read from storage, or we update it here.
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }

        // Sync across tabs
        return initializeSessionSync(() => {
            const { token, user } = getSession();
            if (token && user) {
                setState(prev => ({ ...prev, user, isAuthenticated: true }));
            } else {
                setState(prev => ({ ...prev, user: null, isAuthenticated: false }));
            }
        });
    }, []);

    const login = async (data: any) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            // Mock API call for demonstration if real API is not ready
            // In real app: const res = await apiClient.post('/auth/login', data);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

            if (data.email === 'test@example.com' || data.email) { // Accept any email for demo
                const mockUser = { id: '1', email: data.email, name: 'Test User' };
                const mockToken = 'mock-jwt-token';
                setSession(mockToken, mockUser);
                setState({ user: mockUser, isAuthenticated: true, isLoading: false, error: null });
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false, error: err.message || 'Login failed' }));
            throw err;
        }
    };

    const register = async (data: any) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            // Mock API
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockUser = { id: '2', email: data.email, name: 'New User' };
            const mockToken = 'mock-jwt-token-reg';
            setSession(mockToken, mockUser);
            setState({ user: mockUser, isAuthenticated: true, isLoading: false, error: null });
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false, error: err.message || 'Registration failed' }));
            throw err;
        }
    };

    const logout = () => {
        clearSession();
        setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        // Redirect logic usually handled by the component calling logout or ProtectedRoute
    };

    const resetPasswordRequest = async (email: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false, error: err.message }));
            throw err;
        }
    };

    const resetPasswordConfirm = async (data: any) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false, error: err.message }));
            throw err;
        }
    }

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, resetPasswordRequest, resetPasswordConfirm }}>
            {children}
        </AuthContext.Provider>
    );
};
