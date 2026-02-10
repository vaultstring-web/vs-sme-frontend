'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validators';

const STEPS = [
    { id: 1, title: 'Personal', description: 'Basic info' },
    { id: 2, title: 'Contact', description: 'How to reach you' },
    { id: 3, title: 'Security', description: 'Protect account' },
    { id: 4, title: 'Documents', description: 'Upload verification' }
];

// Document type definitions
type DocumentType = 'NATIONAL_ID_FRONT' | 'NATIONAL_ID_BACK' | 'PROFILE_PICTURE' | 'PROOF_OF_ADDRESS' | 'ADDITIONAL_DOCUMENT';
type UploadedFile = {
    id: string;
    file: File;
    type: DocumentType;
    preview: string;
    progress: number;
    error?: string;
};

const DOCUMENT_REQUIREMENTS = [
    {
        type: 'NATIONAL_ID_FRONT' as DocumentType,
        label: 'National ID Front',
        description: 'Front side of your national ID or passport',
        required: true,
        accept: 'image/*,.pdf',
        maxSize: 5 * 1024 * 1024, // 5MB
    },
    {
        type: 'NATIONAL_ID_BACK' as DocumentType,
        label: 'National ID Back',
        description: 'Back side of your national ID (if applicable)',
        required: false,
        accept: 'image/*,.pdf',
        maxSize: 5 * 1024 * 1024,
    },
    {
        type: 'PROFILE_PICTURE' as DocumentType,
        label: 'Profile Picture',
        description: 'Recent clear photo of yourself',
        required: true,
        accept: 'image/*',
        maxSize: 2 * 1024 * 1024, // 2MB
    },
    {
        type: 'PROOF_OF_ADDRESS' as DocumentType,
        label: 'Proof of Address',
        description: 'Utility bill or official document showing your address',
        required: true,
        accept: 'image/*,.pdf',
        maxSize: 5 * 1024 * 1024,
    },
    {
        type: 'ADDITIONAL_DOCUMENT' as DocumentType,
        label: 'Additional Documents',
        description: 'Any other supporting documents (optional)',
        required: false,
        accept: 'image/*,.pdf,.doc,.docx',
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: true,
    },
];

const RegisterForm = () => {
    const { register, uploadDocuments, error: authError, isLoading } = useAuth();
    const router = useRouter();
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
    
    // UI State
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    // Documents State
    const [documents, setDocuments] = useState<UploadedFile[]>([]);

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

    const DOCUMENT_TYPE_TO_FIELD: Record<DocumentType, string> = {
        NATIONAL_ID_FRONT: 'nationalIdFront',
        NATIONAL_ID_BACK: 'nationalIdBack',
        PROFILE_PICTURE: 'profilePicture',
        PROOF_OF_ADDRESS: 'proofOfAddress',
        ADDITIONAL_DOCUMENT: 'additionalDocuments',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newUploadErrors: { [key: string]: string } = { ...uploadErrors };
        delete newUploadErrors[type];
        setUploadErrors(newUploadErrors);

        const requirement = DOCUMENT_REQUIREMENTS.find(doc => doc.type === type);
        if (!requirement) return;

        const newFiles: UploadedFile[] = [];

        Array.from(files).forEach((file, index) => {
            // Check file size
            if (file.size > requirement.maxSize) {
                setUploadErrors(prev => ({
                    ...prev,
                    [type]: `File too large. Maximum size is ${requirement.maxSize / (1024 * 1024)}MB`
                }));
                return;
            }

            // Check file type
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            const isImage = file.type.startsWith('image/');
            const isPDF = file.type === 'application/pdf';
            const isDocument = ['doc', 'docx'].includes(fileExtension || '');
            
            if (!isImage && !isPDF && !isDocument) {
                setUploadErrors(prev => ({
                    ...prev,
                    [type]: 'Only images, PDFs, and documents are allowed'
                }));
                return;
            }

            const id = `${type}-${Date.now()}-${index}`;
            const preview = isImage ? URL.createObjectURL(file) : '';

            // Remove existing files of same type if not multiple
            if (!requirement.multiple) {
                setDocuments(prev => prev.filter(doc => doc.type !== type));
            }

            newFiles.push({
                id,
                file,
                type,
                preview,
                progress: 0,
            });
        });

        setDocuments(prev => [...prev.filter(doc => doc.type !== type || requirement.multiple), ...newFiles]);
        e.target.value = ''; // Reset input
    };

    const removeDocument = (id: string) => {
        setDocuments(prev => {
            const doc = prev.find(d => d.id === id);
            if (doc?.preview) {
                URL.revokeObjectURL(doc.preview);
            }
            return prev.filter(d => d.id !== id);
        });
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
        } else if (step === 4) {
            // Validate required documents
            DOCUMENT_REQUIREMENTS.forEach(req => {
                if (req.required) {
                    const hasDocument = documents.some(doc => doc.type === req.type);
                    if (!hasDocument) {
                        newErrors[req.type] = `${req.label} is required`;
                    }
                }
            });
        }
        
        if (step === 4) {
            setUploadErrors(newErrors);
        } else {
            setErrors(newErrors);
        }
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const simulateUploadProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + Math.random() * 10;
            });
        }, 200);
        return interval;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (currentStep === 4) {
            if (!validateStep(4)) return;
            
            setIsUploading(true);
            const progressInterval = simulateUploadProgress();

            try {
                // STEP 1: Register user (gets tokens/session)
                await register(formData);
                
                // STEP 2: Prepare FormData with CORRECT field names
                const uploadData = new FormData();
                documents.forEach(doc => {
                    const field = DOCUMENT_TYPE_TO_FIELD[doc.type];
                    uploadData.append(field, doc.file, doc.file.name);
                });
                
                // DEBUG: Log FormData contents
                console.log('📤 Uploading documents:', {
                    fileCount: documents.length,
                    entries: Array.from(uploadData.entries()).map(([key, value]) => ({
                        field: key,
                        fileName: (value as File).name,
                        size: (value as File).size,
                        type: (value as File).type
                    }))
                });
                
                // STEP 3: Upload documents using auth context method
                await uploadDocuments(uploadData);
                
                // Success flow
                clearInterval(progressInterval);
                setUploadProgress(100);
                setTimeout(() => router.push('/dashboard'), 500);
                
            } catch (err) {
                clearInterval(progressInterval);
                setIsUploading(false);
                console.error('Registration/document upload failed:', err);
            }
        }
    };


    const getDocumentCount = (type: DocumentType) => {
        return documents.filter(doc => doc.type === type).length;
    };

    const getAcceptedFiles = (type: DocumentType) => {
        const requirement = DOCUMENT_REQUIREMENTS.find(doc => doc.type === type);
        return requirement?.accept || '';
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

                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <header>
                                    <h2 className="text-2xl font-bold text-gray-900">Document Verification</h2>
                                    <p className="text-gray-500 text-sm font-medium">Upload required documents for identity verification.</p>
                                </header>

                                <div className="space-y-6">
                                    {isUploading ? (
                                        <div className="py-8 text-center space-y-4">
                                            <div className="relative w-20 h-20 mx-auto">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="h-16 w-16 border-4 border-primary-100 rounded-full"></div>
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div 
                                                        className="h-16 w-16 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"
                                                        style={{ 
                                                            background: `conic-gradient(transparent ${uploadProgress * 3.6}deg, #e5e7eb ${uploadProgress * 3.6}deg)`
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-primary-700">{uploadProgress.toFixed(0)}%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Uploading your documents</p>
                                                <p className="text-sm text-gray-500">Please wait while we process your files...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4">
                                                {DOCUMENT_REQUIREMENTS.map((req) => (
                                                    <DocumentUpload 
                                                        key={req.type}
                                                        requirement={req}
                                                        files={documents.filter(doc => doc.type === req.type)}
                                                        onFileChange={(e) => handleFileChange(e, req.type)}
                                                        onRemove={(id) => removeDocument(id)}
                                                        error={uploadErrors[req.type]}
                                                        ref={(el) => { fileInputRefs.current[req.type] = el; }}
                                                        getAcceptedFiles={getAcceptedFiles}
                                                        getDocumentCount={getDocumentCount}
                                                    />
                                                ))}
                                            </div>

                                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                                <div className="flex items-start gap-3">
                                                    <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="text-sm text-blue-700">
                                                        <p className="font-semibold">Document Requirements</p>
                                                        <ul className="mt-1 list-disc list-inside space-y-0.5">
                                                            <li>Files must be clear and legible</li>
                                                            <li>Maximum file size: 10MB per document</li>
                                                            <li>Accepted formats: JPG, PNG, PDF, DOC, DOCX</li>
                                                            <li>All documents will be encrypted for security</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
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
                                disabled={isUploading}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Back
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button 
                                type="button" 
                                onClick={nextStep}
                                disabled={isUploading}
                                className="flex-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-500 shadow-lg shadow-primary-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        ) : currentStep === 3 ? (
                            <button 
                                type="button" 
                                onClick={nextStep}
                                disabled={isLoading}
                                className="flex-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-500 shadow-lg shadow-primary-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue to Documents
                            </button>
                        ) : (
                            <button 
                                type="submit" 
                                disabled={isLoading || isUploading || documents.length === 0}
                                className="flex-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-500 shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center active:scale-95 transition-all"
                            >
                                {isUploading ? (
                                    <>
                                        <Spinner />
                                        <span className="ml-2">Uploading...</span>
                                    </>
                                ) : 'Complete Registration'}
                            </button>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Already have an account? {' '}
                            <Link href="/login" className="text-primary-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- New Document Upload Component ---
interface DocumentUploadProps {
    requirement: typeof DOCUMENT_REQUIREMENTS[0];
    files: UploadedFile[];
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (id: string) => void;
    error?: string;
    getAcceptedFiles: (type: DocumentType) => string;
    getDocumentCount: (type: DocumentType) => number;
}

const DocumentUpload = React.forwardRef<HTMLInputElement, DocumentUploadProps>(
    ({ requirement, files, onFileChange, onRemove, error, getAcceptedFiles, getDocumentCount }, ref) => {
        const isUploaded = files.length > 0;
        const maxFiles = requirement.multiple ? 5 : 1;
        const currentCount = getDocumentCount(requirement.type);
        
        return (
            <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                error ? 'border-error-main bg-error-main/5' : 
                isUploaded ? 'border-success-main bg-success-main/5' : 'border-gray-100'
            }`}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{requirement.label}</h3>
                            {requirement.required && (
                                <span className="text-xs px-2 py-1 bg-error-main/10 text-error-main rounded-full font-bold">
                                    REQUIRED
                                </span>
                            )}
                            {!requirement.required && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-bold">
                                    OPTIONAL
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{requirement.description}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                            {files.map((file) => (
                                <div key={file.id} className="group relative">
                                    {file.preview ? (
                                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                            <img 
                                                src={file.preview} 
                                                alt={file.file.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => onRemove(file.id)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-error-main text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-xs text-gray-600 truncate max-w-30">
                                                {file.file.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => onRemove(file.id)}
                                                className="ml-1 text-gray-400 hover:text-error-main"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {error && (
                            <p className="text-xs text-error-main font-semibold mt-2">{error}</p>
                        )}

                        {requirement.multiple && currentCount > 0 && (
                            <p className="text-xs text-gray-500 mt-2">
                                {currentCount} of {maxFiles} files uploaded
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            ref={ref}
                            type="file"
                            accept={getAcceptedFiles(requirement.type)}
                            multiple={requirement.multiple}
                            onChange={onFileChange}
                            className="hidden"
                            id={`file-upload-${requirement.type}`}
                        />
                        <label
                            htmlFor={`file-upload-${requirement.type}`}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                                isUploaded 
                                    ? 'bg-success-main/10 text-success-main hover:bg-success-main/20' 
                                    : 'bg-primary-600 text-white hover:bg-primary-500'
                            } ${(requirement.multiple && currentCount >= maxFiles) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            {isUploaded ? 'Change' : 'Upload'}
                        </label>
                    </div>
                </div>
            </div>
        );
    }
);

DocumentUpload.displayName = 'DocumentUpload';

// --- Existing Sub-Components (keep as is) ---
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