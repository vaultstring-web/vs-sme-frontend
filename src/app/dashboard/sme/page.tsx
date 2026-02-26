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
  User,
  Building2,
  DollarSign,
  Users,
  History,
  FileUp,
  Shield
} from 'lucide-react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@/context/ThemeContext';
import { useApplications } from '@/hooks/useApplications';
import { useRouter } from 'next/navigation';
import { SmeFormData } from './types';

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

const businessTypes = ['Sole Proprietorship', 'Partnership', 'Private Limited Company', 'Cooperative', 'Other'];
const loanProducts = ['Working Capital Loan', 'Asset Financing', 'Invoice Financing', 'Trade Finance', 'Equipment Loan', 'Other'];
const repaymentMethods = ['Monthly', 'Quarterly', 'Bi-Annually', 'Bullet Payment', 'Custom Schedule'];

const steps = [
  { label: 'Business', icon: Building2 },
  { label: 'Loan Details', icon: DollarSign },
  { label: 'Group Lending', icon: Users },
  { label: 'Credit History', icon: History },
  { label: 'Documents', icon: FileUp },
  { label: 'Review', icon: Shield }
];

export default function SMELoanApplicationPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  const {
    createDraftApplication,
    updateSMEApplication,
    uploadDocument,
    submitApplication,
    isLoading,
    error,
    clearError
  } = useApplications();
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [formData, setFormData] = useState<SmeFormData>({
    businessName: '',
    registrationNo: '',
    businessType: '',
    yearsInOperation: 0,
    loanProduct: '',
    loanAmount: 0,
    paybackPeriodMonths: 0,
    purposeOfLoan: '',
    repaymentMethod: '',
    estimatedMonthlyTurnover: 0,
    estimatedMonthlyProfit: 0,
    isGroupLending: false,
    groupName: '',
    groupMemberCount: 0,
    hasOutstandingLoans: false,
    outstandingLoanDetails: '',
    hasDefaulted: false,
    defaultExplanation: '',
    idDocument: null,
    businessRegistrationDoc: null,
    financialStatementDoc: null,
    agreeToTerms: false,
    consentToCreditCheck: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('smeLoanDraft');
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
      case 0: // Business
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!formData.businessType) newErrors.businessType = 'Business type is required';
        if (!formData.yearsInOperation || formData.yearsInOperation <= 0) 
          newErrors.yearsInOperation = 'Years in operation is required';
        break;
      case 1: // Loan Details
        if (!formData.loanProduct) newErrors.loanProduct = 'Loan product is required';
        if (!formData.loanAmount || formData.loanAmount <= 0) newErrors.loanAmount = 'Loan amount is required';
        else if (formData.loanAmount < 100000 || formData.loanAmount > 5000000)
          newErrors.loanAmount = 'Loan amount must be between MK100,000 and MK5,000,000';
        if (!formData.paybackPeriodMonths || formData.paybackPeriodMonths <= 0) 
          newErrors.paybackPeriodMonths = 'Payback period is required';
        else if (formData.paybackPeriodMonths < 1 || formData.paybackPeriodMonths > 120)
          newErrors.paybackPeriodMonths = 'Payback period must be 1-120 months';
        if (!formData.purposeOfLoan.trim()) newErrors.purposeOfLoan = 'Purpose of loan is required';
        if (!formData.repaymentMethod) newErrors.repaymentMethod = 'Repayment method is required';
        break;
      case 2: // Group Lending
        if (formData.isGroupLending) {
          if (!formData.groupName.trim()) newErrors.groupName = 'Group name is required';
          if (!formData.groupMemberCount || formData.groupMemberCount <= 0) 
            newErrors.groupMemberCount = 'Number of members is required';
          else if (formData.groupMemberCount < 2 || formData.groupMemberCount > 20)
            newErrors.groupMemberCount = 'Group must have 2-20 members';
        }
        break;
      case 3: // Credit History
        if (formData.hasOutstandingLoans && !formData.outstandingLoanDetails.trim())
          newErrors.outstandingLoanDetails = 'Please provide details of outstanding loans';
        if (formData.hasDefaulted && !formData.defaultExplanation.trim())
          newErrors.defaultExplanation = 'Please explain the default';
        break;
      case 4: // Documents
        if (!formData.idDocument) newErrors.idDocument = 'ID document is required';
        if (!formData.businessRegistrationDoc) 
          newErrors.businessRegistrationDoc = 'Business registration document is required';
        break;
      case 5: // Review
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        if (!formData.consentToCreditCheck) 
          newErrors.consentToCreditCheck = 'You must consent to credit check';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target as { name: string; value: any };
    const inputElement = e.target as HTMLInputElement;
    const parsedValue = inputElement.type === 'number' ? parseFloat(value) || 0 : value;
    
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

  const handleSaveDraft = async (): Promise<string | null> => {
    try {
      // Prepare data for backend - filter out empty/undefined values
      const backendData: Record<string, any> = {
        businessName: formData.businessName?.trim() || null,
        registrationNo: formData.registrationNo?.trim() || null,
        businessType: formData.businessType || null,
        yearsInOperation: formData.yearsInOperation || null,
        loanProduct: formData.loanProduct || null,
        loanAmount: formData.loanAmount || null,
        paybackPeriodMonths: formData.paybackPeriodMonths || null,
        purposeOfLoan: formData.purposeOfLoan?.trim() || null,
        repaymentMethod: formData.repaymentMethod || null,
        estimatedMonthlyTurnover: formData.estimatedMonthlyTurnover || null,
        estimatedMonthlyProfit: formData.estimatedMonthlyProfit || null,
        hasOutstandingLoans: formData.hasOutstandingLoans,
        hasDefaulted: formData.hasDefaulted,
      };

      // Conditionally include group/loan details
      if (formData.isGroupLending) {
        backendData.groupName = formData.groupName?.trim() || null;
        backendData.groupMemberCount = formData.groupMemberCount || null;
      } else {
        backendData.groupName = null;
        backendData.groupMemberCount = null;
      }

      if (formData.hasOutstandingLoans) {
        backendData.outstandingLoanDetails = formData.outstandingLoanDetails?.trim() || null;
      } else {
        backendData.outstandingLoanDetails = null;
      }

      if (formData.hasDefaulted) {
        backendData.defaultExplanation = formData.defaultExplanation?.trim() || null;
      } else {
        backendData.defaultExplanation = null;
      }

      // Remove undefined values
      Object.keys(backendData).forEach(key => {
        if (backendData[key] === undefined) delete backendData[key];
      });

      let id = applicationId;

      if (!id) {
        // Step 1: Create an empty draft (no validation)
        const result = await createDraftApplication('SME');
        id = result.id;
        setApplicationId(id);
      }

      // Step 2: Update the draft with the actual data (unvalidated)
      await updateSMEApplication(id, backendData);

      // Save metadata to localStorage
      const draftMetadata = {
        formData: {
          ...formData,
          idDocument: formData.idDocument ? {
            name: formData.idDocument.name,
            type: formData.idDocument.type,
            size: formData.idDocument.size,
            lastModified: formData.idDocument.lastModified,
          } : null,
          businessRegistrationDoc: formData.businessRegistrationDoc ? {
            name: formData.businessRegistrationDoc.name,
            type: formData.businessRegistrationDoc.type,
            size: formData.businessRegistrationDoc.size,
            lastModified: formData.businessRegistrationDoc.lastModified,
          } : null,
          financialStatementDoc: formData.financialStatementDoc ? {
            name: formData.financialStatementDoc.name,
            type: formData.financialStatementDoc.type,
            size: formData.financialStatementDoc.size,
            lastModified: formData.financialStatementDoc.lastModified,
          } : null,
        },
        applicationId: id,
        savedAt: new Date().toISOString(),
        step: activeStep,
      };

      localStorage.setItem('smeLoanDraft', JSON.stringify(draftMetadata));

      setSnackbarMessage('Draft saved successfully!');
      setShowSnackbar(true);

      return id;
    } catch (error: any) {
      console.error('Save draft error:', error);
      setSnackbarMessage(error.message || 'Failed to save draft');
      setShowSnackbar(true);
      return null;
    }
  };

  const uploadDocuments = async (appId: string): Promise<boolean> => {
    try {
      const uploadTasks = [];
      
      if (formData.idDocument) {
        uploadTasks.push(
          uploadDocument(appId, formData.idDocument, 'ID_DOCUMENT')
        );
      }
      
      if (formData.businessRegistrationDoc) {
        uploadTasks.push(
          uploadDocument(appId, formData.businessRegistrationDoc, 'BUSINESS_REGISTRATION')
        );
      }
      
      if (formData.financialStatementDoc) {
        uploadTasks.push(
          uploadDocument(appId, formData.financialStatementDoc, 'FINANCIAL_STATEMENT')
        );
      }

      await Promise.all(uploadTasks);
      return true;
    } catch (error) {
      console.error('Document upload error:', error);
      throw new Error('Failed to upload documents');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsSubmitting(true);
    
    try {
      // First ensure we have an application ID by saving the draft
      let id = applicationId;
      if (!id) {
        id = await handleSaveDraft(); // Get ID directly from the function
        
        if (!id) {
          throw new Error('Failed to create application');
        }
      }

      // Upload all required documents
      await uploadDocuments(id);

      // Submit the application
      await submitApplication(id);

      // Clear local storage
      localStorage.removeItem('smeLoanDraft');
      
      setSubmitSuccess(true);
      setSnackbarMessage('Application submitted successfully!');
      setShowSnackbar(true);
      
      // Redirect to applications page after a brief delay
      setTimeout(() => {
        router.push('/dashboard/applications');
      }, 2000);
      
    } catch (error: any) {
      console.error('Submission error:', error);
      // Error will be shown via the error state from context
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

  const baseTextFieldProps = {
    fullWidth: true,
    variant: 'outlined' as const,
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

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: isDarkMode ? 'white' : '#18181b' }}>
              Business Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                {...baseTextFieldProps}
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                error={!!errors.businessName}
                helperText={errors.businessName}
                required
              />
              <TextField
                {...baseTextFieldProps}
                label="Business Registration Number"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleInputChange}
                helperText="Optional if not registered"
              />
              <FormControl fullWidth error={!!errors.businessType}>
                <InputLabel>Business Type</InputLabel>
                <Select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleSelectChange('businessType')}
                  label="Business Type"
                  required
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                  }}
                >
                  {businessTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
                {errors.businessType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.businessType}
                  </Typography>
                )}
              </FormControl>
              <TextField
                {...baseTextFieldProps}
                type="number"
                label="Years in Operation"
                name="yearsInOperation"
                value={formData.yearsInOperation || ''}
                onChange={handleInputChange}
                error={!!errors.yearsInOperation}
                helperText={errors.yearsInOperation}
                required
                inputProps={{ min: 0, step: 1 }}
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: isDarkMode ? 'white' : '#18181b' }}>
              Loan Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth error={!!errors.loanProduct}>
                <InputLabel>Loan Product</InputLabel>
                <Select
                  name="loanProduct"
                  value={formData.loanProduct}
                  onChange={handleSelectChange('loanProduct')}
                  label="Loan Product"
                  required
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                  }}
                >
                  {loanProducts.map((product) => (
                    <MenuItem key={product} value={product}>{product}</MenuItem>
                  ))}
                </Select>
                {errors.loanProduct && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.loanProduct}
                  </Typography>
                )}
              </FormControl>
              <TextField
                {...baseTextFieldProps}
                type="number"
                label="Loan Amount"
                name="loanAmount"
                value={formData.loanAmount || ''}
                onChange={handleInputChange}
                error={!!errors.loanAmount}
                helperText={errors.loanAmount || 'Amount between MK100,000 and MK5,000,000'}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">MK</InputAdornment>,
                }}
              />
              <TextField
                {...baseTextFieldProps}
                type="number"
                label="Payback Period (Months)"
                name="paybackPeriodMonths"
                value={formData.paybackPeriodMonths || ''}
                onChange={handleInputChange}
                error={!!errors.paybackPeriodMonths}
                helperText={errors.paybackPeriodMonths || '1-120 months'}
                required
                inputProps={{ min: 1, max: 120, step: 1 }}
              />
              <TextField
                {...baseTextFieldProps}
                label="Purpose of Loan"
                name="purposeOfLoan"
                value={formData.purposeOfLoan}
                onChange={handleInputChange}
                error={!!errors.purposeOfLoan}
                helperText={errors.purposeOfLoan}
                required
                multiline
                rows={3}
              />
              <FormControl fullWidth error={!!errors.repaymentMethod}>
                <InputLabel>Repayment Method</InputLabel>
                <Select
                  name="repaymentMethod"
                  value={formData.repaymentMethod}
                  onChange={handleSelectChange('repaymentMethod')}
                  label="Repayment Method"
                  required
                  sx={{
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                  }}
                >
                  {repaymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>{method}</MenuItem>
                  ))}
                </Select>
                {errors.repaymentMethod && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.repaymentMethod}
                  </Typography>
                )}
              </FormControl>
              <TextField
                {...baseTextFieldProps}
                type="number"
                label="Estimated Monthly Turnover"
                name="estimatedMonthlyTurnover"
                value={formData.estimatedMonthlyTurnover || ''}
                onChange={handleInputChange}
                helperText="Optional"
                InputProps={{
                  startAdornment: <InputAdornment position="start">MK</InputAdornment>,
                }}
              />
              <TextField
                {...baseTextFieldProps}
                type="number"
                label="Estimated Monthly Profit"
                name="estimatedMonthlyProfit"
                value={formData.estimatedMonthlyProfit || ''}
                onChange={handleInputChange}
                helperText="Optional"
                InputProps={{
                  startAdornment: <InputAdornment position="start">MK</InputAdornment>,
                }}
              />
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: isDarkMode ? 'white' : '#18181b' }}>
              Group Lending (Optional)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isGroupLending}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, isGroupLending: e.target.checked }));
                      if (!e.target.checked) {
                        setFormData(prev => ({ ...prev, groupName: '', groupMemberCount: 0 }));
                      }
                    }}
                    sx={{
                      color: limeColors[500],
                      '&.Mui-checked': {
                        color: limeColors[500],
                      },
                    }}
                  />
                }
                label="Apply as part of a group"
              />
              {formData.isGroupLending && (
                <>
                  <TextField
                    {...baseTextFieldProps}
                    label="Group Name"
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleInputChange}
                    error={!!errors.groupName}
                    helperText={errors.groupName}
                    required={formData.isGroupLending}
                  />
                  <TextField
                    {...baseTextFieldProps}
                    type="number"
                    label="Number of Group Members"
                    name="groupMemberCount"
                    value={formData.groupMemberCount || ''}
                    onChange={handleInputChange}
                    error={!!errors.groupMemberCount}
                    helperText={errors.groupMemberCount || '2-20 members'}
                    required={formData.isGroupLending}
                    inputProps={{ min: 2, max: 20, step: 1 }}
                  />
                </>
              )}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: isDarkMode ? 'white' : '#18181b' }}>
              Credit History
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasOutstandingLoans}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, hasOutstandingLoans: e.target.checked }));
                      if (!e.target.checked) {
                        setFormData(prev => ({ ...prev, outstandingLoanDetails: '' }));
                      }
                    }}
                    sx={{
                      color: limeColors[500],
                      '&.Mui-checked': {
                        color: limeColors[500],
                      },
                    }}
                  />
                }
                label="I have outstanding loans"
              />
              {formData.hasOutstandingLoans && (
                <TextField
                  {...baseTextFieldProps}
                  label="Outstanding Loan Details"
                  name="outstandingLoanDetails"
                  value={formData.outstandingLoanDetails}
                  onChange={handleInputChange}
                  error={!!errors.outstandingLoanDetails}
                  helperText={errors.outstandingLoanDetails || 'Provide lender, amount, and repayment status'}
                  required={formData.hasOutstandingLoans}
                  multiline
                  rows={3}
                />
              )}
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasDefaulted}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, hasDefaulted: e.target.checked }));
                      if (!e.target.checked) {
                        setFormData(prev => ({ ...prev, defaultExplanation: '' }));
                      }
                    }}
                    sx={{
                      color: limeColors[500],
                      '&.Mui-checked': {
                        color: limeColors[500],
                      },
                    }}
                  />
                }
                label="I have previously defaulted on a loan"
              />
              {formData.hasDefaulted && (
                <TextField
                  {...baseTextFieldProps}
                  label="Default Explanation"
                  name="defaultExplanation"
                  value={formData.defaultExplanation}
                  onChange={handleInputChange}
                  error={!!errors.defaultExplanation}
                  helperText={errors.defaultExplanation || 'Explain the circumstances'}
                  required={formData.hasDefaulted}
                  multiline
                  rows={3}
                />
              )}
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: isDarkMode ? 'white' : '#18181b' }}>
              Required Documents
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  ID Document (Required) *
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<FileUp size={18} />}
                  sx={{
                    borderColor: errors.idDocument ? 'error.main' : (isDarkMode ? 'rgba(132, 204, 22, 0.3)' : 'rgba(132, 204, 22, 0.2)'),
                    color: isDarkMode ? 'white' : '#18181b',
                    borderRadius: '12px',
                    textTransform: 'none',
                    py: 1.5,
                    px: 3,
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                >
                  {formData.idDocument ? formData.idDocument.name : 'Choose ID Document'}
                  <VisuallyHiddenInput type="file" onChange={handleFileUpload('idDocument')} accept=".pdf,.jpg,.jpeg,.png" />
                </Button>
                {errors.idDocument && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.idDocument}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Business Registration Document (Required) *
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<FileUp size={18} />}
                  sx={{
                    borderColor: errors.businessRegistrationDoc ? 'error.main' : (isDarkMode ? 'rgba(132, 204, 22, 0.3)' : 'rgba(132, 204, 22, 0.2)'),
                    color: isDarkMode ? 'white' : '#18181b',
                    borderRadius: '12px',
                    textTransform: 'none',
                    py: 1.5,
                    px: 3,
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                >
                  {formData.businessRegistrationDoc ? formData.businessRegistrationDoc.name : 'Choose Business Registration'}
                  <VisuallyHiddenInput type="file" onChange={handleFileUpload('businessRegistrationDoc')} accept=".pdf,.jpg,.jpeg,.png" />
                </Button>
                {errors.businessRegistrationDoc && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.businessRegistrationDoc}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Financial Statement (Optional)
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<FileUp size={18} />}
                  sx={{
                    borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.3)' : 'rgba(132, 204, 22, 0.2)',
                    color: isDarkMode ? 'white' : '#18181b',
                    borderRadius: '12px',
                    textTransform: 'none',
                    py: 1.5,
                    px: 3,
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                >
                  {formData.financialStatementDoc ? formData.financialStatementDoc.name : 'Choose Financial Statement'}
                  <VisuallyHiddenInput type="file" onChange={handleFileUpload('financialStatementDoc')} accept=".pdf,.jpg,.jpeg,.png" />
                </Button>
              </Box>
            </Box>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: isDarkMode ? 'white' : '#18181b' }}>
              Review & Submit
            </Typography>
            
            {/* Summary */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Application Summary</Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">Business Name</Typography>
                  <Typography variant="body2" fontWeight={600}>{formData.businessName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Business Type</Typography>
                  <Typography variant="body2" fontWeight={600}>{formData.businessType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Loan Product</Typography>
                  <Typography variant="body2" fontWeight={600}>{formData.loanProduct}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Loan Amount</Typography>
                  <Typography variant="body2" fontWeight={600}>MK {formData.loanAmount.toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Payback Period</Typography>
                  <Typography variant="body2" fontWeight={600}>{formData.paybackPeriodMonths} months</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">Repayment Method</Typography>
                  <Typography variant="body2" fontWeight={600}>{formData.repaymentMethod}</Typography>
                </Box>
              </Box>
            </Paper>

            {/* Declarations */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }));
                      if (errors.agreeToTerms) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.agreeToTerms;
                          return newErrors;
                        });
                      }
                    }}
                    sx={{
                      color: errors.agreeToTerms ? 'error.main' : limeColors[500],
                      '&.Mui-checked': {
                        color: limeColors[500],
                      },
                    }}
                  />
                }
                label="I agree to the terms and conditions"
              />
              {errors.agreeToTerms && (
                <Typography variant="caption" color="error">
                  {errors.agreeToTerms}
                </Typography>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.consentToCreditCheck}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, consentToCreditCheck: e.target.checked }));
                      if (errors.consentToCreditCheck) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.consentToCreditCheck;
                          return newErrors;
                        });
                      }
                    }}
                    sx={{
                      color: errors.consentToCreditCheck ? 'error.main' : limeColors[500],
                      '&.Mui-checked': {
                        color: limeColors[500],
                      },
                    }}
                  />
                }
                label="I consent to a credit check"
              />
              {errors.consentToCreditCheck && (
                <Typography variant="caption" color="error">
                  {errors.consentToCreditCheck}
                </Typography>
              )}
            </Box>

            {submitSuccess && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Application submitted successfully! Redirecting...
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '24px' }}>
          <CheckCircle size={64} color={limeColors[500]} style={{ marginBottom: 16 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Application Submitted!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Your SME loan application has been successfully submitted. We'll review it and get back to you soon.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/dashboard/applications')}
            sx={{
              bgcolor: limeColors[500],
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: limeColors[600],
              },
            }}
          >
            View My Applications
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 2, 
          fontWeight: 800,
          background: `linear-gradient(135deg, ${limeColors[500]} 0%, ${limeColors[600]} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        SME Loan Application
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
        Complete all steps to submit your application
      </Typography>

      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
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
              background: `linear-gradient(90deg, ${limeColors[500]} 0%, ${limeColors[400]} 100%)`,
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
              disabled={isSubmitting}
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