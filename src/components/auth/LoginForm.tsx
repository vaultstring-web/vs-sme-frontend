// src/components/auth/LoginForm
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

const LoginForm = () => {
    const { login, error: authError, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

     
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [localError, setLocalError] = useState<string | null>(null);

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

        try {
            await login({ email, password });
            router.push(returnUrl);
        } catch (err) {
            // Error handled by context
        }
    };

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
                    <div className="rounded-md bg-error-main/10 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-error-main">
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
                                className={`block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${errors.email ? 'border-error-main' : 'border-gray-300'
                                    }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-error-main">{errors.email}</p>
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
                                className={`block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${errors.password ? 'border-error-main' : 'border-gray-300'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                            {errors.password && (
                                <p className="mt-1 text-sm text-error-main">{errors.password}</p>
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
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? (
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
