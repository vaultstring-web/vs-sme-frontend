'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validators';

const STEPS = [
    { id: 1, title: 'Personal', description: 'Basic info' },
    { id: 2, title: 'Contact', description: 'How to reach you' },
    { id: 3, title: 'Security', description: 'Protect account' }
];

const RegisterForm = () => {
    const { register, error: authError, isLoading } = useAuth();
    const router = useRouter();
    
    // UI State
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        nationalIdOrPassport: '',
        primaryPhone: '',
        secondaryPhone: '',
        physicalAddress: '',
        postalAddress: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        marketing: false
    });

    // Dynamic Password Strength Logic
    useEffect(() => {
        const pass = formData.password;
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        setStrength(score);
    }, [formData.password]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateStep = (step: number) => {
        const newErrors: { [key: string]: string } = {};
        if (step === 1) {
            if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
            if (!formData.nationalIdOrPassport.trim()) newErrors.nationalIdOrPassport = 'ID/Passport is required';
            const emailErr = validateEmail(formData.email);
            if (emailErr) newErrors.email = emailErr;
        } else if (step === 2) {
            if (!formData.primaryPhone.trim()) newErrors.primaryPhone = 'Phone is required';
            if (!formData.physicalAddress.trim()) newErrors.physicalAddress = 'Address is required';
        } else if (step === 3) {
            const passErr = validatePassword(formData.password);
            if (passErr) newErrors.password = passErr;
            const matchErr = validateConfirmPassword(formData.password, formData.confirmPassword);
            if (matchErr) newErrors.confirmPassword = matchErr;
            if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(3)) return;
        try {
            await register(formData);
            router.push('/dashboard');
        } catch (err) { /* context handles this */ }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Progress Stepper */}
            <div className="mb-8 px-4">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10" />
                    <div 
                        className="absolute top-1/2 left-0 h-0.5 bg-primary-500 transition-all duration-500 -z-10" 
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                currentStep >= step.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white text-gray-400 border-2 border-gray-100'
                            }`}>
                                {currentStep > step.id ? '✓' : step.id}
                            </div>
                            <span className={`mt-2 text-[10px] uppercase tracking-wider font-bold ${currentStep >= step.id ? 'text-primary-700' : 'text-gray-400'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                    {authError && (
                        <div className="mb-6 p-4 bg-error-main/10 border border-error-main/20 rounded-xl text-error-main text-sm font-medium">
                            {authError}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <header>
                                    <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
                                    <p className="text-gray-500 text-sm font-medium">Let's get your basic account information set up.</p>
                                </header>
                                
                                <div className="space-y-4">
                                    <FormGroup label="Full Name" error={errors.fullName}>
                                        <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Chikondi Phiri" className={inputClass(!!errors.fullName)} />
                                    </FormGroup>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormGroup label="Email" error={errors.email}>
                                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="chiko@example.com" className={inputClass(!!errors.email)} />
                                        </FormGroup>
                                        <FormGroup label="ID / Passport" error={errors.nationalIdOrPassport}>
                                            <input name="nationalIdOrPassport" value={formData.nationalIdOrPassport} onChange={handleChange} placeholder="12345678" className={inputClass(!!errors.nationalIdOrPassport)} />
                                        </FormGroup>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <header>
                                    <h2 className="text-2xl font-bold text-gray-900">Contact Info</h2>
                                    <p className="text-gray-500 text-sm font-medium">How should we reach you?</p>
                                </header>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormGroup label="Primary Phone" error={errors.primaryPhone}>
                                            <input name="primaryPhone" type="tel" value={formData.primaryPhone} onChange={handleChange} placeholder="+265..." className={inputClass(!!errors.primaryPhone)} />
                                        </FormGroup>
                                        <FormGroup label="Secondary (Optional)">
                                            <input name="secondaryPhone" type="tel" value={formData.secondaryPhone} onChange={handleChange} placeholder="Optional" className={inputClass(false)} />
                                        </FormGroup>
                                    </div>
                                    <FormGroup label="Physical Address" error={errors.physicalAddress}>
                                        <textarea name="physicalAddress" rows={2} value={formData.physicalAddress} onChange={handleChange} placeholder="City, Street, Building..." className={inputClass(!!errors.physicalAddress)} />
                                    </FormGroup>
                                    <FormGroup label="Postal Address (Optional)">
                                        <input name="postalAddress" value={formData.postalAddress} onChange={handleChange} placeholder="P.O Box..." className={inputClass(false)} />
                                    </FormGroup>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <header>
                                    <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                                    <p className="text-gray-500 text-sm font-medium">Protect your account with a strong password.</p>
                                </header>

                                <div className="space-y-4">
                                    <FormGroup label="Password" error={errors.password}>
                                        <PasswordInput 
                                            name="password" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            isVisible={showPassword}
                                            toggleVisible={() => setShowPassword(!showPassword)}
                                            hasError={!!errors.password}
                                        />
                                        <StrengthIndicator strength={strength} />
                                    </FormGroup>

                                    <FormGroup label="Confirm Password" error={errors.confirmPassword}>
                                        <PasswordInput 
                                            name="confirmPassword" 
                                            value={formData.confirmPassword} 
                                            onChange={handleChange} 
                                            isVisible={showConfirmPassword}
                                            toggleVisible={() => setShowConfirmPassword(!showConfirmPassword)}
                                            hasError={!!errors.confirmPassword}
                                        />
                                    </FormGroup>

                                    <div className="pt-2 space-y-3">
                                        <Checkbox 
                                            name="agreeTerms" 
                                            checked={formData.agreeTerms} 
                                            onChange={handleChange} 
                                            label={<>I agree to the <Link href="/terms" className="text-primary-600 font-bold hover:underline">Terms of Service</Link></>} 
                                            error={errors.agreeTerms} 
                                        />
                                        <Checkbox 
                                            name="marketing" 
                                            checked={formData.marketing} 
                                            onChange={handleChange} 
                                            label="I'd like to receive product updates" 
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-10 flex gap-4">
                        {currentStep > 1 && (
                            <button 
                                type="button" 
                                onClick={prevStep} 
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                            >
                                Back
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button 
                                type="button" 
                                onClick={nextStep} 
                                className="flex-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-500 shadow-lg shadow-primary-200 transition-all active:scale-95"
                            >
                                Continue
                            </button>
                        ) : (
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="flex-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-500 shadow-lg shadow-primary-200 disabled:opacity-50 flex justify-center items-center active:scale-95 transition-all"
                            >
                                {isLoading ? <Spinner /> : 'Create Account'}
                            </button>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Already have an account? {' '}
                            <Link href="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const FormGroup = ({ label, error, children }: any) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
        {children}
        <AnimatePresence>
            {error && (
                <motion.span 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-xs text-error-main font-semibold"
                >
                    {error}
                </motion.span>
            )}
        </AnimatePresence>
    </div>
);

const PasswordInput = ({ name, value, onChange, isVisible, toggleVisible, hasError }: any) => (
    <div className="relative group">
        <input
            name={name}
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={onChange}
            className={`${inputClass(hasError)} pr-12`}
            placeholder="••••••••"
        />
        <button
            type="button"
            onClick={toggleVisible}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 group-focus-within:text-primary-500 transition-colors"
            tabIndex={-1}
        >
            {isVisible ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
        </button>
    </div>
);

const Checkbox = ({ name, checked, onChange, label, error }: any) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-start gap-3">
            <input 
                type="checkbox" 
                id={name} 
                name={name} 
                checked={checked} 
                onChange={onChange} 
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500/20 transition-all cursor-pointer" 
            />
            <label htmlFor={name} className="text-sm text-gray-600 font-medium leading-tight cursor-pointer selection:bg-transparent">
                {label}
            </label>
        </div>
        {error && <span className="text-[10px] text-error-main font-bold ml-8">{error}</span>}
    </div>
);

const StrengthIndicator = ({ strength }: { strength: number }) => {
    const labels = ['Too Weak', 'Could be better', 'Good password', 'Strong password'];
    const colors = ['bg-gray-200', 'bg-error-main', 'bg-warning-main', 'bg-info-main', 'bg-success-main'];
    return (
        <div className="mt-2">
            <div className="flex gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? colors[strength] : 'bg-gray-100'}`} />
                ))}
            </div>
            <span className={`text-[10px] font-bold mt-1.5 block uppercase tracking-wider ${strength > 0 ? 'opacity-100' : 'opacity-0'}`} style={{ color: `var(--color-${colors[strength].split('-')[1]}-main)` }}>
                {labels[strength - 1]}
            </span>
        </div>
    );
};

const Spinner = () => <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />;

const inputClass = (hasError: boolean) => `
    w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 outline-none text-gray-900 font-medium placeholder:text-gray-300
    ${hasError ? 'border-error-main bg-error-main/5' : 'border-gray-100 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5'}
`;

export default RegisterForm;