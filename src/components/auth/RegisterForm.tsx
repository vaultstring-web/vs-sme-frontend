'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validators';

const RegisterForm = () => {
    const { register, error: authError, isLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        marketing: false
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    // Password Strength
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        let score = 0;
        const pass = formData.password;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        setStrength(score); // 0-4
    }, [formData.password]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error on change if touched
        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name);
    }

    const validateField = (name: string) => {
        let error = '';
        switch (name) {
            case 'email':
                error = validateEmail(formData.email) || '';
                break;
            case 'password':
                error = validatePassword(formData.password) || '';
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(formData.password, formData.confirmPassword) || '';
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailErr = validateEmail(formData.email);
        const passErr = validatePassword(formData.password);
        const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);
        const termsErr = !formData.agreeTerms ? 'You must agree to the terms' : '';

        if (emailErr || passErr || confirmErr || termsErr) {
            setErrors({
                email: emailErr || '',
                password: passErr || '',
                confirmPassword: confirmErr || '',
                agreeTerms: termsErr
            });
            return;
        }

        try {
            await register({ email: formData.email, password: formData.password });
            router.push('/dashboard');
        } catch (err) {
            // handled by context
        }
    };

    const getStrengthColor = () => {
        if (strength <= 1) return 'bg-error-main';
        if (strength === 2) return 'bg-warning-main';
        if (strength === 3) return 'bg-info-main';
        return 'bg-success-main';
    }

    return (
        <div className="w-full max-w-md space-y-6 bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
            <div className="text-center">
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                    Step 1 of 3
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                    Create Account
                </h2>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 w-1/3 rounded-full" />
                </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {authError && (
                    <div className="rounded-md bg-error-main/10 p-4">
                        <p className="text-sm text-error-main">{authError}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${errors.email ? 'border-error-main' : 'border-gray-300'
                                }`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-error-main">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${errors.password ? 'border-error-main' : 'border-gray-300'
                                }`}
                        />
                        {/* Strength Bar */}
                        <div className="mt-2 flex gap-1 h-1">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`flex-1 rounded-full ${i < strength ? getStrengthColor() : 'bg-gray-200'}`} />
                            ))}
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-error-main">{errors.password}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                            8+ chars, 1 uppercase, 1 number, 1 special char
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-gray-900 placeholder:text-gray-400 ${errors.confirmPassword ? 'border-error-main' : 'border-gray-300'
                                }`}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-error-main">{errors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                name="agreeTerms"
                                type="checkbox"
                                required
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                                I agree to the <a href="#" className="text-primary-600 hover:text-primary-500">Terms</a> and <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
                            </label>
                            {errors.agreeTerms && <p className="mt-1 text-sm text-error-main">{errors.agreeTerms}</p>}
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                name="marketing"
                                type="checkbox"
                                checked={formData.marketing}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="marketing" className="font-medium text-gray-700">
                                I want to receive updates and special offers
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
