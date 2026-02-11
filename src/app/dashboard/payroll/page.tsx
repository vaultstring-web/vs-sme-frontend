'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Radio,
  RadioGroup,
  FormLabel,
  FormHelperText,
  InputAdornment,
  Container,
  Snackbar,
  alpha
} from '@mui/material';
import {
  Save,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Upload,
  User,
  Calendar,
  Users,
  Phone,
  Building2,
  Briefcase,
  FileText,
  DollarSign,
  History,
  FileUp,
  Shield,
  MapPin,
  CreditCard,
  UserCog,
  FileCheck
} from 'lucide-react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@/context/ThemeContext';
import { useApplications } from '@/hooks/useApplications';
import { useRouter } from 'next/navigation';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface PayrollApplicationData {
  // Personal & Demographic Info
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  
  // Next of Kin Details
  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinPhone: string;
  
  // Employment & Income Information
  employerName: string;
  employerAddress: string;
  jobTitle: string;
  employeeNumber: string;
  dateOfEmployment: string;
  grossMonthlySalary: number;
  netMonthlySalary: number;
  
  // Loan Request
  loanAmount: number;
  paybackPeriodMonths: number;
  
  // Payroll Deduction Confirmation
  payrollDeductionConfirmed: boolean;
  employerLetter: File | null;
  
  // Credit History
  hasOutstandingLoans: boolean;
  outstandingLoanDetails: string;
  hasDefaulted: boolean;
  defaultExplanation: string;
  
  // Document Upload
  idDocument: File | null;
  payslip1: File | null;
  payslip2: File | null;
  payslip3: File | null;
  
  // Declarations & Consent
  agreeToTerms: boolean;
  consentToCreditCheck: boolean;
}

const genders = ['Male', 'Female', 'Other'];
const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
const relationships = ['Spouse', 'Parent', 'Sibling', 'Child', 'Relative', 'Friend'];

const steps = [
  { label: 'Personal Info', icon: User },
  { label: 'Next of Kin', icon: Users },
  { label: 'Employment', icon: Building2 },
  { label: 'Loan Details', icon: DollarSign },
  { label: 'Payroll Deduction', icon: CreditCard },
  { label: 'Credit History', icon: History },
  { label: 'Documents', icon: FileUp },
  { label: 'Review', icon: Shield }
];

// Document type constants for backend
const DOCUMENT_TYPES = {
  ID_DOCUMENT: 'ID_DOCUMENT',
  EMPLOYER_LETTER: 'EMPLOYER_LETTER',
  PAYSLIP_1: 'PAYSLIP_1',
  PAYSLIP_2: 'PAYSLIP_2',
  PAYSLIP_3: 'PAYSLIP_3'
} as const;

export default function PayrollLoanApplicationPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  const {
    createPayrollApplication,
    updatePayrollApplication,
    uploadDocument,
    submitApplication,
    isLoading,
    error,
    clearError
  } = useApplications();
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [formData, setFormData] = useState<PayrollApplicationData>({
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinPhone: '',
    employerName: '',
    employerAddress: '',
    jobTitle: '',
    employeeNumber: '',
    dateOfEmployment: '',
    grossMonthlySalary: 0,
    netMonthlySalary: 0,
    loanAmount: 0,
    paybackPeriodMonths: 0,
    payrollDeductionConfirmed: false,
    employerLetter: null,
    hasOutstandingLoans: false,
    outstandingLoanDetails: '',
    hasDefaulted: false,
    defaultExplanation: '',
    idDocument: null,
    payslip1: null,
    payslip2: null,
    payslip3: null,
    agreeToTerms: false,
    consentToCreditCheck: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('payrollLoanDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData || draft);
        if (draft.step !== undefined) setActiveStep(draft.step);
        if (draft.applicationId) setApplicationId(draft.applicationId);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // Show error from context
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setShowSnackbar(true);
      clearError();
    }
  }, [error, clearError]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 0:
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        else {
          const dob = new Date(formData.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          if (age < 18) newErrors.dateOfBirth = 'Must be at least 18 years old';
          if (age > 65) newErrors.dateOfBirth = 'Maximum age is 65 years';
        }
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
        break;
      
      case 1:
        if (!formData.nextOfKinName.trim()) newErrors.nextOfKinName = 'Next of kin name is required';
        if (!formData.nextOfKinRelationship) newErrors.nextOfKinRelationship = 'Relationship is required';
        if (!formData.nextOfKinPhone.trim()) newErrors.nextOfKinPhone = 'Phone number is required';
        break;
      
      case 2:
        if (!formData.employerName.trim()) newErrors.employerName = 'Employer name is required';
        if (!formData.employerAddress.trim()) newErrors.employerAddress = 'Employer address is required';
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        if (!formData.dateOfEmployment) newErrors.dateOfEmployment = 'Date of employment is required';
        else {
          const employmentDate = new Date(formData.dateOfEmployment);
          const today = new Date();
          const monthsEmployed = (today.getFullYear() - employmentDate.getFullYear()) * 12 + 
                                 (today.getMonth() - employmentDate.getMonth());
          if (monthsEmployed < 6) newErrors.dateOfEmployment = 'Must be employed for at least 6 months';
        }
        if (!formData.grossMonthlySalary) newErrors.grossMonthlySalary = 'Gross monthly salary is required';
        else if (formData.grossMonthlySalary <= 0) newErrors.grossMonthlySalary = 'Salary must be greater than 0';
        if (!formData.netMonthlySalary) newErrors.netMonthlySalary = 'Net monthly salary is required';
        else if (formData.netMonthlySalary <= 0) newErrors.netMonthlySalary = 'Salary must be greater than 0';
        else if (formData.netMonthlySalary > formData.grossMonthlySalary) 
          newErrors.netMonthlySalary = 'Net salary cannot exceed gross salary';
        break;
      
      case 3:
        if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
        else if (formData.loanAmount < 50000 || formData.loanAmount > 3000000)
          newErrors.loanAmount = 'Loan amount must be between MK50,000 and MK3,000,000';
        else if (formData.loanAmount > formData.netMonthlySalary * 24)
          newErrors.loanAmount = 'Loan cannot exceed 24x your net monthly salary';
        
        if (!formData.paybackPeriodMonths) newErrors.paybackPeriodMonths = 'Payback period is required';
        else if (formData.paybackPeriodMonths < 3 || formData.paybackPeriodMonths > 60)
          newErrors.paybackPeriodMonths = 'Payback period must be 3-60 months';
        break;
      
      case 4:
        if (!formData.payrollDeductionConfirmed)
          newErrors.payrollDeductionConfirmed = 'Payroll deduction confirmation is required for approval';
        if (formData.payrollDeductionConfirmed && !formData.employerLetter)
          newErrors.employerLetter = 'Employer letter is required for payroll deduction';
        break;
      
      case 5:
        if (formData.hasOutstandingLoans && !formData.outstandingLoanDetails.trim())
          newErrors.outstandingLoanDetails = 'Please provide details of outstanding loans';
        if (formData.hasDefaulted && !formData.defaultExplanation.trim())
          newErrors.defaultExplanation = 'Please explain the default';
        break;
      
      case 6:
        if (!formData.idDocument) newErrors.idDocument = 'ID document is required';
        if (!formData.payslip1) newErrors.payslip1 = 'Recent payslip is required';
        break;
      
      case 7:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        if (!formData.consentToCreditCheck) newErrors.consentToCreditCheck = 'You must consent to credit check';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target as { name: string; value: any };
    const inputElement = e.target as HTMLInputElement;
    let parsedValue = value;
    
    if (inputElement.type === 'number') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string) => (e: { target: { value: any } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Prepare data for backend - match the exact backend schema
  const prepareBackendData = () => ({
    dateOfBirth: formData.dateOfBirth, // already ISO string (YYYY-MM-DD)
    gender: formData.gender,
    maritalStatus: formData.maritalStatus,
    nextOfKinName: formData.nextOfKinName,
    nextOfKinRelationship: formData.nextOfKinRelationship,
    nextOfKinPhone: formData.nextOfKinPhone,
    employerName: formData.employerName,
    employerAddress: formData.employerAddress,
    jobTitle: formData.jobTitle,
    employeeNumber: formData.employeeNumber || undefined,
    dateOfEmployment: formData.dateOfEmployment,
    grossMonthlySalary: formData.grossMonthlySalary,
    netMonthlySalary: formData.netMonthlySalary,
    loanAmount: formData.loanAmount,
    paybackPeriodMonths: formData.paybackPeriodMonths,
    payrollDeductionConfirmed: formData.payrollDeductionConfirmed,
    hasOutstandingLoans: formData.hasOutstandingLoans,
    outstandingLoanDetails: formData.hasOutstandingLoans ? formData.outstandingLoanDetails : undefined,
    hasDefaulted: formData.hasDefaulted,
    defaultExplanation: formData.hasDefaulted ? formData.defaultExplanation : undefined,
  });

  const handleSaveDraft = async (): Promise<string> => {
  try {
    const backendData = prepareBackendData();
    let id = applicationId;

    if (!id) {
      const result = await createPayrollApplication(backendData);
      id = result.id;
      setApplicationId(id);
    } else {
      await updatePayrollApplication(id, backendData);
    }

    // Save to localStorage (optional, but keep as backup)
    const draft = { formData, applicationId: id, savedAt: new Date().toISOString(), step: activeStep };
    localStorage.setItem('payrollLoanDraft', JSON.stringify(draft));

    setSnackbarMessage('Draft saved successfully!');
    setShowSnackbar(true);

    return id;
  } catch (error) {
    console.error('Save draft error:', error);
    throw error;
  }
};

  const uploadDocuments = async (appId: string): Promise<void> => {
  const requiredTasks: Promise<any>[] = [];
  const optionalTasks: Promise<any>[] = [];

  // Required documents
  if (formData.idDocument) {
    requiredTasks.push(
      uploadDocument(appId, formData.idDocument, DOCUMENT_TYPES.ID_DOCUMENT)
    );
  }
  if (formData.payslip1) {
    requiredTasks.push(
      uploadDocument(appId, formData.payslip1, DOCUMENT_TYPES.PAYSLIP_1)
    );
  }
  if (formData.payrollDeductionConfirmed && formData.employerLetter) {
    requiredTasks.push(
      uploadDocument(appId, formData.employerLetter, DOCUMENT_TYPES.EMPLOYER_LETTER)
    );
  }

  // Optional documents
  if (formData.payslip2) {
    optionalTasks.push(
      uploadDocument(appId, formData.payslip2, DOCUMENT_TYPES.PAYSLIP_2)
        .catch(err => console.warn('Payslip 2 upload failed (optional):', err))
    );
  }
  if (formData.payslip3) {
    optionalTasks.push(
      uploadDocument(appId, formData.payslip3, DOCUMENT_TYPES.PAYSLIP_3)
        .catch(err => console.warn('Payslip 3 upload failed (optional):', err))
    );
  }
  // If employerLetter exists but payrollDeductionConfirmed = false, treat as optional
  if (!formData.payrollDeductionConfirmed && formData.employerLetter) {
    optionalTasks.push(
      uploadDocument(appId, formData.employerLetter, DOCUMENT_TYPES.EMPLOYER_LETTER)
        .catch(err => console.warn('Employer letter upload failed (optional):', err))
    );
  }

  // Wait for all required uploads – if any fails, this throws and stops submission
  await Promise.all(requiredTasks);
  // Fire off optional uploads but don't await them (or await with allSettled)
  await Promise.allSettled(optionalTasks);
};

  const handleSubmit = async () => {
  if (!validateStep(7)) return;
  setIsSubmitting(true);

  try {
    // Get the application ID – either existing or newly created
    const id = applicationId || await handleSaveDraft();

    if (!id) throw new Error('Failed to create application');

    // Upload documents
    await uploadDocuments(id);

    // Submit
    await submitApplication(id);

    // Cleanup and redirect
    localStorage.removeItem('payrollLoanDraft');
    setSubmitSuccess(true);
    setSnackbarMessage('Application submitted successfully!');
    setShowSnackbar(true);

    setTimeout(() => router.push('/dashboard/applications'), 2000);
  } catch (error) {
    // error handled via context/snackbar
  } finally {
    setIsSubmitting(false);
  }
};

  const progress = Math.round(((activeStep + 1) / steps.length) * 100);

  const limeColors = {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
  };

  const getStepContent = (step: number) => {
    const baseTextFieldProps = {
      sx: {
        '& .MuiOutlinedInput-root': {
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          '& fieldset': {
            borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)',
            borderWidth: '1.5px',
          },
          '&:hover fieldset': {
            borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.4)' : 'rgba(132, 204, 22, 0.3)',
          },
          '&.Mui-focused fieldset': {
            borderColor: limeColors[500],
            borderWidth: '2px',
          },
        },
        '& .MuiInputLabel-root': {
          color: isDarkMode ? '#a1a1aa' : '#71717a',
          fontWeight: 500,
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: limeColors[500],
        },
      }
    };

    const baseSelectProps = {
      sx: {
        '& .MuiSelect-select': {
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          '& fieldset': {
            borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)',
            borderWidth: '1.5px',
          },
          '&:hover fieldset': {
            borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.4)' : 'rgba(132, 204, 22, 0.3)',
          },
          '&.Mui-focused fieldset': {
            borderColor: limeColors[500],
            borderWidth: '2px',
          },
        },
        '& .MuiInputLabel-root': {
          color: isDarkMode ? '#a1a1aa' : '#71717a',
          fontWeight: 500,
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: limeColors[500],
        },
      }
    };

    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha(limeColors[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Personal & Demographic Information
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Basic personal details
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                required 
                fullWidth 
                label="Date of Birth" 
                name="dateOfBirth" 
                type="date" 
                value={formData.dateOfBirth} 
                onChange={handleInputChange} 
                error={!!errors.dateOfBirth} 
                helperText={errors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                    </InputAdornment>
                  ),
                }}
                {...baseTextFieldProps}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <FormControl fullWidth required error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleSelectChange('gender')} 
                    label="Gender"
                    {...baseSelectProps}
                  >
                    {genders.map((gender) => (
                      <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                    ))}
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth required error={!!errors.maritalStatus}>
                  <InputLabel>Marital Status</InputLabel>
                  <Select 
                    name="maritalStatus" 
                    value={formData.maritalStatus} 
                    onChange={handleSelectChange('maritalStatus')} 
                    label="Marital Status"
                    {...baseSelectProps}
                  >
                    {maritalStatuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                  {errors.maritalStatus && <FormHelperText>{errors.maritalStatus}</FormHelperText>}
                </FormControl>
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha(limeColors[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Next of Kin Details
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Emergency contact information
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                required 
                fullWidth 
                label="Next of Kin Name" 
                name="nextOfKinName" 
                value={formData.nextOfKinName} 
                onChange={handleInputChange} 
                error={!!errors.nextOfKinName} 
                helperText={errors.nextOfKinName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserCog size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                    </InputAdornment>
                  ),
                }}
                {...baseTextFieldProps}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <FormControl fullWidth required error={!!errors.nextOfKinRelationship}>
                  <InputLabel>Relationship</InputLabel>
                  <Select 
                    name="nextOfKinRelationship" 
                    value={formData.nextOfKinRelationship} 
                    onChange={handleSelectChange('nextOfKinRelationship')} 
                    label="Relationship"
                    {...baseSelectProps}
                  >
                    {relationships.map((rel) => (
                      <MenuItem key={rel} value={rel}>{rel}</MenuItem>
                    ))}
                  </Select>
                  {errors.nextOfKinRelationship && <FormHelperText>{errors.nextOfKinRelationship}</FormHelperText>}
                </FormControl>
                <TextField 
                  required 
                  fullWidth 
                  label="Phone Number" 
                  name="nextOfKinPhone" 
                  value={formData.nextOfKinPhone} 
                  onChange={handleInputChange} 
                  error={!!errors.nextOfKinPhone} 
                  helperText={errors.nextOfKinPhone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                      </InputAdornment>
                    ),
                  }}
                  {...baseTextFieldProps}
                />
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha(limeColors[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Employment & Income Information
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Current employment details
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                required 
                fullWidth 
                label="Employer Name" 
                name="employerName" 
                value={formData.employerName} 
                onChange={handleInputChange} 
                error={!!errors.employerName} 
                helperText={errors.employerName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Building2 size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                    </InputAdornment>
                  ),
                }}
                {...baseTextFieldProps}
              />
              <TextField 
                required 
                fullWidth 
                label="Employer Address" 
                name="employerAddress" 
                multiline 
                rows={2} 
                value={formData.employerAddress} 
                onChange={handleInputChange} 
                error={!!errors.employerAddress} 
                helperText={errors.employerAddress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                      <MapPin size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                    </InputAdornment>
                  ),
                }}
                {...baseTextFieldProps}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField 
                  required 
                  fullWidth 
                  label="Job Title" 
                  name="jobTitle" 
                  value={formData.jobTitle} 
                  onChange={handleInputChange} 
                  error={!!errors.jobTitle} 
                  helperText={errors.jobTitle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Briefcase size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                      </InputAdornment>
                    ),
                  }}
                  {...baseTextFieldProps}
                />
                <TextField 
                  fullWidth 
                  label="Employee Number" 
                  name="employeeNumber" 
                  value={formData.employeeNumber} 
                  onChange={handleInputChange}
                  {...baseTextFieldProps}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField 
                  required 
                  fullWidth 
                  label="Date of Employment" 
                  name="dateOfEmployment" 
                  type="date" 
                  value={formData.dateOfEmployment} 
                  onChange={handleInputChange} 
                  error={!!errors.dateOfEmployment} 
                  helperText={errors.dateOfEmployment}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                      </InputAdornment>
                    ),
                  }}
                  {...baseTextFieldProps}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField 
                  required 
                  fullWidth 
                  label="Gross Monthly Salary (MWK)" 
                  name="grossMonthlySalary" 
                  type="number" 
                  value={formData.grossMonthlySalary || ''} 
                  onChange={handleInputChange} 
                  error={!!errors.grossMonthlySalary} 
                  helperText={errors.grossMonthlySalary}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">MK</InputAdornment>, 
                    inputProps: { min: 0 } 
                  }}
                  {...baseTextFieldProps}
                />
                <TextField 
                  required 
                  fullWidth 
                  label="Net Monthly Salary (MWK)" 
                  name="netMonthlySalary" 
                  type="number" 
                  value={formData.netMonthlySalary || ''} 
                  onChange={handleInputChange} 
                  error={!!errors.netMonthlySalary} 
                  helperText={errors.netMonthlySalary}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">MK</InputAdornment>, 
                    inputProps: { min: 0 } 
                  }}
                  {...baseTextFieldProps}
                />
              </Box>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha(limeColors[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Loan Request
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Loan amount and repayment terms
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
              }}>
                <Typography variant="subtitle2" sx={{ color: limeColors[500], fontWeight: 600, mb: 1 }}>
                  Salary-based Limit: MK {(formData.netMonthlySalary * 24).toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Maximum loan amount based on 24x your net monthly salary
                </Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField 
                  required 
                  fullWidth 
                  label="Loan Amount (MWK)" 
                  name="loanAmount" 
                  type="number" 
                  value={formData.loanAmount || ''} 
                  onChange={handleInputChange} 
                  error={!!errors.loanAmount} 
                  helperText={errors.loanAmount || 'Range: MK50,000 - MK3,000,000'} 
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">MK</InputAdornment>, 
                    inputProps: { min: 50000, max: 3000000, step: 1000 } 
                  }}
                  {...baseTextFieldProps}
                />
                <TextField 
                  required 
                  fullWidth 
                  label="Payback Period (Months)" 
                  name="paybackPeriodMonths" 
                  type="number" 
                  value={formData.paybackPeriodMonths || ''} 
                  onChange={handleInputChange} 
                  error={!!errors.paybackPeriodMonths} 
                  helperText={errors.paybackPeriodMonths || '3-60 months'} 
                  InputProps={{ inputProps: { min: 3, max: 60 } }}
                  {...baseTextFieldProps}
                />
              </Box>
              <Box sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: alpha(limeColors[500], 0.05),
                border: `1.5px solid ${alpha(limeColors[500], 0.2)}`,
              }}>
                <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 1 }}>
                  Estimated Monthly Repayment
                </Typography>
                <Typography variant="h4" sx={{ color: limeColors[500], fontWeight: 700 }}>
                  MK {formData.loanAmount && formData.paybackPeriodMonths 
                    ? ((formData.loanAmount * 1.18) / formData.paybackPeriodMonths).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                    : '0'}
                </Typography>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Based on 18% annual interest rate
                </Typography>
              </Box>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha(limeColors[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CreditCard size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Payroll Deduction Confirmation
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Required for loan approval
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: isDarkMode ? 'rgba(132, 204, 22, 0.05)' : 'rgba(132, 204, 22, 0.03)',
                border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
              }}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={formData.payrollDeductionConfirmed} 
                      onChange={(e) => setFormData(prev => ({ ...prev, payrollDeductionConfirmed: e.target.checked }))} 
                      sx={{
                        color: limeColors[500],
                        '&.Mui-checked': {
                          color: limeColors[500],
                        },
                      }}
                    />
                  } 
                  label={
                    <Box>
                      <Typography sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 0.5 }}>
                        I authorize payroll deduction for loan repayment *
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                        This authorization allows your employer to deduct loan repayments directly from your salary
                      </Typography>
                    </Box>
                  } 
                />
                {errors.payrollDeductionConfirmed && <Typography color="error" variant="caption" sx={{ ml: 4, display: 'block' }}>{errors.payrollDeductionConfirmed}</Typography>}
              </Box>
              
              {formData.payrollDeductionConfirmed && (
                <Box sx={{ 
                  p: 4, 
                  borderRadius: '16px', 
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                  border: `2px dashed ${isDarkMode ? 'rgba(132, 204, 22, 0.3)' : 'rgba(132, 204, 22, 0.2)'}`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: limeColors[500],
                    bgcolor: alpha(limeColors[500], 0.05),
                  }
                }}>
                  <FileCheck size={32} color={limeColors[500]} style={{ margin: '0 auto 12px' }} />
                  <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 0.5 }}>
                    Employer Authorization Letter *
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', mb: 2 }}>
                    Letter from employer confirming payroll deduction authorization
                  </Typography>
                  <Button 
                    component="label" 
                    variant="contained" 
                    startIcon={<Upload size={18} />}
                    sx={{ 
                      bgcolor: limeColors[500],
                      color: 'white',
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: limeColors[600]
                      }
                    }}
                  >
                    {formData.employerLetter ? 'Change File' : 'Upload Letter'}
                    <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload('employerLetter')} />
                  </Button>
                  {formData.employerLetter && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: limeColors[500] }}>
                      ✓ {formData.employerLetter.name}
                    </Typography>
                  )}
                  {errors.employerLetter && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {errors.employerLetter}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        );

      case 5:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha(limeColors[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <History size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Credit History
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Previous loan information
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
              }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 2 }}>
                    Do you have any outstanding loans?
                  </FormLabel>
                  <RadioGroup 
                    row 
                    name="hasOutstandingLoans" 
                    value={formData.hasOutstandingLoans.toString()} 
                    onChange={(e) => setFormData(prev => ({ ...prev, hasOutstandingLoans: e.target.value === 'true' }))}
                  >
                    <FormControlLabel 
                      value="true" 
                      control={<Radio sx={{ color: limeColors[500], '&.Mui-checked': { color: limeColors[500] } }} />} 
                      label={<Typography sx={{ color: isDarkMode ? 'white' : '#18181b' }}>Yes</Typography>} 
                    />
                    <FormControlLabel 
                      value="false" 
                      control={<Radio sx={{ color: limeColors[500], '&.Mui-checked': { color: limeColors[500] } }} />} 
                      label={<Typography sx={{ color: isDarkMode ? 'white' : '#18181b' }}>No</Typography>} 
                    />
                  </RadioGroup>
                </FormControl>
                {formData.hasOutstandingLoans && (
                  <Box sx={{ mt: 3 }}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Details of Outstanding Loans" 
                      placeholder="Please include lender name, loan amount, current balance, and monthly repayment"
                      name="outstandingLoanDetails" 
                      multiline 
                      rows={4} 
                      value={formData.outstandingLoanDetails} 
                      onChange={handleInputChange} 
                      error={!!errors.outstandingLoanDetails} 
                      helperText={errors.outstandingLoanDetails}
                      {...baseTextFieldProps}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
              }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 2 }}>
                    Have you ever defaulted on a loan?
                  </FormLabel>
                  <RadioGroup 
                    row 
                    name="hasDefaulted" 
                    value={formData.hasDefaulted.toString()} 
                    onChange={(e) => setFormData(prev => ({ ...prev, hasDefaulted: e.target.value === 'true' }))}
                  >
                    <FormControlLabel 
                      value="true" 
                      control={<Radio sx={{ color: limeColors[500], '&.Mui-checked': { color: limeColors[500] } }} />} 
                      label={<Typography sx={{ color: isDarkMode ? 'white' : '#18181b' }}>Yes</Typography>} 
                    />
                    <FormControlLabel 
                      value="false" 
                      control={<Radio sx={{ color: limeColors[500], '&.Mui-checked': { color: limeColors[500] } }} />} 
                      label={<Typography sx={{ color: isDarkMode ? 'white' : '#18181b' }}>No</Typography>} 
                    />
                  </RadioGroup>
                </FormControl>
                {formData.hasDefaulted && (
                  <Box sx={{ mt: 3 }}>
                    <TextField 
                      required 
                      fullWidth 
                      label="Default Explanation" 
                      placeholder="Please explain the circumstances and resolution"
                      name="defaultExplanation" 
                      multiline 
                      rows={4} 
                      value={formData.defaultExplanation} 
                      onChange={handleInputChange} 
                      error={!!errors.defaultExplanation} 
                      helperText={errors.defaultExplanation}
                      {...baseTextFieldProps}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        );

      case 6:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha(limeColors[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileUp size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Document Upload
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Upload required documents
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box sx={{ 
                  p: 4, 
                  borderRadius: '16px', 
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                  border: `2px dashed ${isDarkMode ? 'rgba(132, 204, 22, 0.3)' : 'rgba(132, 204, 22, 0.2)'}`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: limeColors[500],
                    bgcolor: alpha(limeColors[500], 0.05),
                  }
                }}>
                  <User size={32} color={limeColors[500]} style={{ margin: '0 auto 12px' }} />
                  <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 0.5 }}>
                    ID Document *
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', mb: 2 }}>
                    National ID or Passport
                  </Typography>
                  <Button 
                    component="label" 
                    variant="contained" 
                    startIcon={<Upload size={18} />}
                    sx={{ 
                      bgcolor: limeColors[500],
                      color: 'white',
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: limeColors[600]
                      }
                    }}
                  >
                    {formData.idDocument ? 'Change File' : 'Upload'}
                    <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload('idDocument')} />
                  </Button>
                  {formData.idDocument && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: limeColors[500] }}>
                      ✓ {formData.idDocument.name}
                    </Typography>
                  )}
                  {errors.idDocument && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {errors.idDocument}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ 
                  p: 4, 
                  borderRadius: '16px', 
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                  border: `2px dashed ${isDarkMode ? 'rgba(132, 204, 22, 0.3)' : 'rgba(132, 204, 22, 0.2)'}`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: limeColors[500],
                    bgcolor: alpha(limeColors[500], 0.05),
                  }
                }}>
                  <FileText size={32} color={limeColors[500]} style={{ margin: '0 auto 12px' }} />
                  <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 0.5 }}>
                    Recent Payslip 1 *
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', mb: 2 }}>
                    Most recent payslip
                  </Typography>
                  <Button 
                    component="label" 
                    variant="contained" 
                    startIcon={<Upload size={18} />}
                    sx={{ 
                      bgcolor: limeColors[500],
                      color: 'white',
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: limeColors[600]
                      }
                    }}
                  >
                    {formData.payslip1 ? 'Change File' : 'Upload'}
                    <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload('payslip1')} />
                  </Button>
                  {formData.payslip1 && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: limeColors[500] }}>
                      ✓ {formData.payslip1.name}
                    </Typography>
                  )}
                  {errors.payslip1 && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {errors.payslip1}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box sx={{ 
                  p: 4, 
                  borderRadius: '16px', 
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                  border: `2px dashed ${isDarkMode ? 'rgba(132, 204, 22, 0.3)' : 'rgba(132, 204, 22, 0.2)'}`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: limeColors[500],
                    bgcolor: alpha(limeColors[500], 0.05),
                  }
                }}>
                  <FileText size={32} color={limeColors[500]} style={{ margin: '0 auto 12px' }} />
                  <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 0.5 }}>
                    Recent Payslip 2
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', mb: 2 }}>
                    Second most recent payslip
                  </Typography>
                  <Button 
                    component="label" 
                    variant="outlined" 
                    startIcon={<Upload size={18} />}
                    sx={{ 
                      borderColor: limeColors[500],
                      color: limeColors[500],
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        borderColor: limeColors[600],
                        bgcolor: alpha(limeColors[500], 0.1)
                      }
                    }}
                  >
                    {formData.payslip2 ? 'Change File' : 'Upload'}
                    <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload('payslip2')} />
                  </Button>
                  {formData.payslip2 && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: limeColors[500] }}>
                      ✓ {formData.payslip2.name}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ 
                  p: 4, 
                  borderRadius: '16px', 
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                  border: `2px dashed ${isDarkMode ? 'rgba(132, 204, 22, 0.3)' : 'rgba(132, 204, 22, 0.2)'}`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: limeColors[500],
                    bgcolor: alpha(limeColors[500], 0.05),
                  }
                }}>
                  <FileText size={32} color={limeColors[500]} style={{ margin: '0 auto 12px' }} />
                  <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 0.5 }}>
                    Recent Payslip 3
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', mb: 2 }}>
                    Third most recent payslip
                  </Typography>
                  <Button 
                    component="label" 
                    variant="outlined" 
                    startIcon={<Upload size={18} />}
                    sx={{ 
                      borderColor: limeColors[500],
                      color: limeColors[500],
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        borderColor: limeColors[600],
                        bgcolor: alpha(limeColors[500], 0.1)
                      }
                    }}
                  >
                    {formData.payslip3 ? 'Change File' : 'Upload'}
                    <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload('payslip3')} />
                  </Button>
                  {formData.payslip3 && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: limeColors[500] }}>
                      ✓ {formData.payslip3.name}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Alert severity="info" sx={{ 
                borderRadius: '12px',
                bgcolor: isDarkMode ? 'rgba(132, 204, 22, 0.1)' : 'rgba(132, 204, 22, 0.05)',
                border: `1px solid ${alpha(limeColors[500], 0.2)}`,
              }}>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  <strong>Note:</strong> Upload clear scans/photos of documents. Allowed formats: PDF, JPG, PNG. 
                  Maximum file size: 5MB each.
                </Typography>
              </Alert>
            </Box>
          </Box>
        );

      case 7:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                bgcolor: alpha(limeColors[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Terms & Declarations
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Review and accept terms
                </Typography>
              </Box>
            </Box>
            <Paper 
              sx={{ 
                p: 4, 
                mb: 3, 
                borderRadius: '16px',
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
                maxHeight: '400px', 
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: isDarkMode ? '#3f3f46' : '#cbd5e1',
                  borderRadius: '10px',
                },
              }}
            >
              <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 700, mb: 3 }}>
                Payroll Loan Application Terms and Conditions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'I hereby apply for the payroll loan facility and declare that all information provided is true, complete, and accurate.',
                  'I authorize the financial institution to conduct credit checks and verify my employment and income details with my employer.',
                  'I consent to the processing of my personal data for loan assessment, administration, and regulatory purposes.',
                  'I authorize my employer to deduct loan repayments directly from my salary as per the agreed schedule.',
                  'I understand that loan approval is subject to credit assessment and employer verification, and is not guaranteed.',
                  'I agree to repay the loan according to the terms specified in the loan agreement, including all applicable interest and charges.',
                  'I acknowledge that defaulting on repayment will affect my credit rating and may result in legal action for recovery.',
                  'I understand that my employer will be notified of loan approval and repayment schedule for payroll deduction purposes.',
                  'I confirm that I have disclosed all existing loans and financial obligations in this application.',
                  'I agree to notify the lender of any changes in my employment status or financial circumstances during the loan term.'
                ].map((term, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ 
                      minWidth: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      bgcolor: alpha(limeColors[500], 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: limeColors[500],
                      fontWeight: 700,
                      fontSize: '12px',
                      mt: 0.5
                    }}>
                      {index + 1}
                    </Box>
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#d4d4d8' : '#52525b', lineHeight: 1.6 }}>
                      {term}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '12px', 
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                border: `1.5px solid ${errors.agreeToTerms ? '#ef4444' : (isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)')}`,
              }}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={formData.agreeToTerms} 
                      onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))} 
                      sx={{
                        color: limeColors[500],
                        '&.Mui-checked': {
                          color: limeColors[500],
                        },
                      }}
                    />
                  } 
                  label={
                    <Typography sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 500 }}>
                      I have read and agree to the Terms and Conditions *
                    </Typography>
                  } 
                />
                {errors.agreeToTerms && <Typography color="error" variant="caption" sx={{ ml: 4, display: 'block' }}>{errors.agreeToTerms}</Typography>}
              </Box>
              <Box sx={{ 
                p: 3, 
                borderRadius: '12px', 
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                border: `1.5px solid ${errors.consentToCreditCheck ? '#ef4444' : (isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)')}`,
              }}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={formData.consentToCreditCheck} 
                      onChange={(e) => setFormData(prev => ({ ...prev, consentToCreditCheck: e.target.checked }))} 
                      sx={{
                        color: limeColors[500],
                        '&.Mui-checked': {
                          color: limeColors[500],
                        },
                      }}
                    />
                  } 
                  label={
                    <Typography sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 500 }}>
                      I consent to credit checks and verification of provided information *
                    </Typography>
                  } 
                />
                {errors.consentToCreditCheck && <Typography color="error" variant="caption" sx={{ ml: 4, display: 'block' }}>{errors.consentToCreditCheck}</Typography>}
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  // SummaryDisplay component remains unchanged
  const SummaryDisplay = () => (
    <Container maxWidth="md">
      <Box sx={{ 
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 5, 
            width: '100%',
            borderRadius: '24px',
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'white',
            border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
            textAlign: 'center'
          }}
        >
          <Box sx={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            bgcolor: alpha(limeColors[500], 0.15),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle size={48} color={limeColors[500]} />
          </Box>
          <Typography variant="h4" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 700, mb: 2 }}>
            Application Submitted!
          </Typography>
          <Typography variant="body1" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', mb: 1 }}>
            Your application reference number:
          </Typography>
          <Typography variant="h6" sx={{ color: limeColors[500], fontWeight: 700, mb: 4 }}>
            PAY-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </Typography>
          
          <Divider sx={{ my: 4, borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)' }} />
          
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 3 }}>
              Application Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Employer
                </Typography>
                <Typography variant="body1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mt: 0.5 }}>
                  {formData.employerName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Loan Amount
                </Typography>
                <Typography variant="body1" sx={{ color: limeColors[500], fontWeight: 700, mt: 0.5 }}>
                  MK {formData.loanAmount.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Payback Period
                </Typography>
                <Typography variant="body1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mt: 0.5 }}>
                  {formData.paybackPeriodMonths} months
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Net Monthly Salary
                </Typography>
                <Typography variant="body1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mt: 0.5 }}>
                  MK {formData.netMonthlySalary.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            mt: 4, 
            pt: 4, 
            borderTop: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
            textAlign: 'left'
          }}>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', lineHeight: 1.6 }}>
              <strong style={{ color: isDarkMode ? 'white' : '#18181b' }}>Next Steps:</strong> Our team will verify your employment details with your employer 
              and review your application. You will receive a response within 2-3 business days. 
              If approved, your employer will be notified for payroll deduction setup.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );

  // If submission succeeded, show the summary page
  if (submitSuccess) {
    return <SummaryDisplay />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 700, mb: 1 }}>
          Payroll Deduction Loan Application
        </Typography>
        <Typography variant="body1" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
          Complete all steps to submit your application
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', fontWeight: 600 }}>
            Step {activeStep + 1} of {steps.length}
          </Typography>
          <Typography variant="body2" sx={{ color: limeColors[500], fontWeight: 700 }}>
            {progress}% Complete
          </Typography>
        </Box>
        <Box sx={{ 
          height: 12, 
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)', 
          borderRadius: '100px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Box 
            sx={{ 
              height: '100%', 
              bgcolor: `linear-gradient(90deg, ${limeColors[500]} 0%, ${limeColors[400]} 100%)`,
              width: `${progress}%`,
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '100px',
              boxShadow: `0 0 20px ${alpha(limeColors[500], 0.4)}`
            }}
          />
        </Box>
      </Box>

      {/* Custom Stepper */}
      <Box sx={{ 
        mb: 5,
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '24px',
          left: '5%',
          right: '5%',
          height: '2px',
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          zIndex: 0
        }
      }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          
          return (
            <Box 
              key={step.label} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1,
                position: 'relative',
                zIndex: 1
              }}
            >
              <Box sx={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                bgcolor: isCompleted ? limeColors[500] : isActive ? alpha(limeColors[500], 0.15) : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'),
                border: `2px solid ${isActive || isCompleted ? limeColors[500] : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                transition: 'all 0.3s ease',
                boxShadow: isActive ? `0 0 20px ${alpha(limeColors[500], 0.4)}` : 'none'
              }}>
                {isCompleted ? (
                  <CheckCircle size={24} color="white" />
                ) : (
                  <Icon size={24} color={isActive ? limeColors[500] : (isDarkMode ? '#52525b' : '#a1a1aa')} />
                )}
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isActive || isCompleted ? (isDarkMode ? 'white' : '#18181b') : (isDarkMode ? '#71717a' : '#a1a1aa'),
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'center',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {step.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, sm: 4, md: 5 }, 
          mb: 4, 
          borderRadius: '24px',
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'white',
          border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
          minHeight: '500px'
        }}
      >
        {getStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              startIcon={<ArrowLeft size={18} />}
              sx={{ 
                color: isDarkMode ? 'white' : '#18181b',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: limeColors[500],
                  bgcolor: alpha(limeColors[500], 0.05)
                }
              }}
              variant="outlined"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleSaveDraft}
            startIcon={<Save size={18} />}
            variant="outlined"
            disabled={isLoading}
            sx={{ 
              color: limeColors[500],
              borderColor: limeColors[500],
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              '&:hover': {
                borderColor: limeColors[600],
                bgcolor: alpha(limeColors[500], 0.1)
              },
              '&.Mui-disabled': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Save Draft'}
          </Button>
        </Box>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
              endIcon={isSubmitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <CheckCircle size={18} />}
              sx={{
                bgcolor: limeColors[500],
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                boxShadow: `0 4px 20px ${alpha(limeColors[500], 0.4)}`,
                '&:hover': {
                  bgcolor: limeColors[600],
                  boxShadow: `0 6px 25px ${alpha(limeColors[500], 0.5)}`
                },
                '&.Mui-disabled': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowRight size={18} />}
              sx={{
                bgcolor: limeColors[500],
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                boxShadow: `0 4px 20px ${alpha(limeColors[500], 0.4)}`,
                '&:hover': {
                  bgcolor: limeColors[600],
                  boxShadow: `0 6px 25px ${alpha(limeColors[500], 0.5)}`
                }
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            bgcolor: limeColors[500],
            color: 'white',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: `0 4px 20px ${alpha(limeColors[500], 0.4)}`
          }
        }}
      />
    </Container>
  );
}