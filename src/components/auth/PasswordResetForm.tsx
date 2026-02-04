'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { validatePassword, validateConfirmPassword } from '../../utils/validators';

interface PasswordResetFormProps {
    token: string;
}

const PasswordResetForm = ({ token }: PasswordResetFormProps) => {
    const { resetPasswordConfirm, isLoading, error: authError } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passErr = validatePassword(formData.password);
        const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);

        if (passErr || confirmErr) {
            setErrors({
                password: passErr || undefined,
                confirmPassword: confirmErr || undefined
            });
            return;
        }

        try {
            await resetPasswordConfirm({ token, password: formData.password });
            setMessage('Password has been successfully reset.');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            // handled by context
        }
    };

    if (message) {
        return (
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-gray-100 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-light">
                    <svg className="h-6 w-6 text-success-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Success!</h2>
                <p className="text-gray-600">{message}</p>
                <p className="mt-4 text-sm text-gray-500">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Please enter your new password below.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {authError && (
                    <div className="rounded-md bg-error-main/10 p-4">
                        <p className="text-sm text-error-main">{authError}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${errors.password ? 'border-error-main' : 'border-gray-300'
                                }`}
                        />
                        {errors.password && <p className="mt-1 text-sm text-error-main">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${errors.confirmPassword ? 'border-error-main' : 'border-gray-300'
                                }`}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-error-main">{errors.confirmPassword}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default PasswordResetForm;
