'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

const PasswordResetRequest = () => {
    const { resetPasswordRequest, isLoading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        const emailErr = validateEmail(email);
        if (emailErr) {
            setValidationError(emailErr);
            return;
        }

        try {
            await resetPasswordRequest(email);
            setSuccess(true);
        } catch (err) {
            // handled by context
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-gray-100 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-light">
                    <svg className="h-6 w-6 text-success-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                <p className="text-gray-600">
                    We've sent password reset instructions to {email}
                </p>
                <div className="mt-6">
                    <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Return to log in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Enter your email address and we'll send you a recovery link.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {(error || validationError) && (
                    <div className="rounded-md bg-error-main/10 p-4">
                        <p className="text-sm text-error-main">{error || validationError}</p>
                    </div>
                )}

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
                            className="block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>

                <div className="text-center text-sm">
                    <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Back to log in
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default PasswordResetRequest;
