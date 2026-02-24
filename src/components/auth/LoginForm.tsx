// src/components/auth/LoginForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

const LoginForm = () => {
    const { login, error: authError, isLoading, isAuthenticated, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [localError, setLocalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Handle redirect when authenticated
    useEffect(() => {
        if (isAuthenticated && !isLoading && user) {
            // Determine the default dashboard based on user role
            const defaultDashboard = user.role === 'ADMIN_TIER1' || user.role === 'ADMIN_TIER2'
                ? '/admin/dashboard'
                : '/dashboard';
            
            // Use returnUrl from query param if present, otherwise role-based default
            const returnUrl = searchParams.get('returnUrl') || defaultDashboard;
            
            // Small delay to ensure state is stable
            const timer = setTimeout(() => {
                router.push(returnUrl);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, isLoading, user, router, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setErrors({});
        setLocalError(null);

        const emailError = validateEmail(email);
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }

        if (!password) {
            setErrors({ password: 'Password is required' });
            return;
        }

        // Prevent double submission
        if (isSubmitting) return;
        
        setIsSubmitting(true);

        try {
            await login({ email, password });
            // Don't redirect here - let the useEffect handle it
        } catch (err: any) {
            setLocalError(err.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading while checking auth
    if (isLoading && !isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    // If already authenticated, show redirecting message
    if (isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
            <div className="text-center">
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                    Welcome back
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in to your account
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {(authError || localError) && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    {authError || localError}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                className={`block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                                className={`block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="flex w-full justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading || isSubmitting ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </div>

                <div className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-500">
                        Sign up
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;