'use client';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getSession, setSession, clearSession, initializeSessionSync } from '../utils/sessionStorage';
import apiClient from '../lib/apiClient';

interface User {
    id: string;
    email: string;
    name: string;
    fullName: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthContextType extends AuthState {
    login: (data: { email: string; password: string }) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
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

    useEffect(() => {
        const { accessToken, user } = getSession();
        if (accessToken && user) {
            setState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }

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
            
            // Map backend profile to frontend user structure
            const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.fullName, // Using fullName as name
                fullName: profile.fullName,
                role: profile.role
            };
            
            setSession(accessToken, refreshToken, user);
            setState({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    const register = async (data: any) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await apiClient.post('/auth/register', data);
            const { accessToken, refreshToken, profile } = response.data;
            
            const user: User = {
                id: profile.id,
                email: profile.email,
                name: profile.fullName,
                fullName: profile.fullName,
                role: profile.role
            };
            
            setSession(accessToken, refreshToken, user);
            setState({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            clearSession();
            setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
    };

    const resetPasswordRequest = async (email: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await apiClient.post('/auth/password-reset/request', { email });
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Password reset request failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    const resetPasswordConfirm = async (data: { token: string; newPassword: string }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await apiClient.post('/auth/password-reset/confirm', data);
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Password reset failed';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, resetPasswordRequest, resetPasswordConfirm }}>
            {children}
        </AuthContext.Provider>
    );
};