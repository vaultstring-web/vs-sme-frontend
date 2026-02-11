
'use client';

import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Switch,
  Paper,
  Card,
  CardContent,
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
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  DollarSign,
  Users,
  History,
  FileUp,
  Shield,
  TrendingUp,
  Calendar,
  Briefcase
} from 'lucide-react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@/context/ThemeContext';

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

interface SmeFormData {
  // Personal & Contact Info
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  
  // Business Details
  businessName: string;
  registrationNo: string;
  businessType: string;
  yearsInOperation: number;
  
  // Loan Request
  loanProduct: string;
  loanAmount: number;
  paybackPeriodMonths: number;
  purposeOfLoan: string;
  repaymentMethod: string;
  estimatedMonthlyTurnover: number;
  estimatedMonthlyProfit: number;
  
  // Group Lending
  isGroupLending: boolean;
  groupName: string;
  groupMemberCount: number;
  
  // Credit History
  hasOutstandingLoans: boolean;
  outstandingLoanDetails: string;
  hasDefaulted: boolean;
  defaultExplanation: string;
  
  // Documents
  idDocument: File | null;
  businessRegistrationDoc: File | null;
  financialStatementDoc: File | null;
  
  // Declarations
  agreeToTerms: boolean;
  consentToCreditCheck: boolean;
}

const businessTypes = ['Sole Proprietorship', 'Partnership', 'Private Limited Company', 'Cooperative', 'Other'];
const loanProducts = ['Working Capital Loan', 'Asset Financing', 'Invoice Financing', 'Trade Finance', 'Equipment Loan', 'Other'];
const repaymentMethods = ['Monthly', 'Quarterly', 'Bi-Annually', 'Bullet Payment', 'Custom Schedule'];

const steps = [
  { label: 'Personal Info', icon: User },
  { label: 'Business', icon: Building2 },
  { label: 'Loan Details', icon: DollarSign },
  { label: 'Group Lending', icon: Users },
  { label: 'Credit History', icon: History },
  { label: 'Documents', icon: FileUp },
  { label: 'Review', icon: Shield }
];

export default function SMELoanApplicationPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [formData, setFormData] = useState<SmeFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 0:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      case 1:
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!formData.businessType) newErrors.businessType = 'Business type is required';
        if (!formData.yearsInOperation) newErrors.yearsInOperation = 'Years in operation is required';
        break;
      case 2:
        if (!formData.loanProduct) newErrors.loanProduct = 'Loan product is required';
        if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
        else if (formData.loanAmount < 100000 || formData.loanAmount > 5000000)
          newErrors.loanAmount = 'Loan amount must be between MK100,000 and MK5,000,000';
        if (!formData.paybackPeriodMonths) newErrors.paybackPeriodMonths = 'Payback period is required';
        else if (formData.paybackPeriodMonths < 1 || formData.paybackPeriodMonths > 120)
          newErrors.paybackPeriodMonths = 'Payback period must be 1-120 months';
        if (!formData.purposeOfLoan.trim()) newErrors.purposeOfLoan = 'Purpose of loan is required';
        if (!formData.repaymentMethod) newErrors.repaymentMethod = 'Repayment method is required';
        break;
      case 3:
        if (formData.isGroupLending) {
          if (!formData.groupName.trim()) newErrors.groupName = 'Group name is required';
          if (!formData.groupMemberCount) newErrors.groupMemberCount = 'Number of members is required';
          else if (formData.groupMemberCount < 2 || formData.groupMemberCount > 20)
            newErrors.groupMemberCount = 'Group must have 2-20 members';
        }
        break;
      case 4:
        if (formData.hasOutstandingLoans && !formData.outstandingLoanDetails.trim())
          newErrors.outstandingLoanDetails = 'Please provide details of outstanding loans';
        if (formData.hasDefaulted && !formData.defaultExplanation.trim())
          newErrors.defaultExplanation = 'Please explain the default';
        break;
      case 5:
        if (!formData.idDocument) newErrors.idDocument = 'ID document is required';
        if (!formData.businessRegistrationDoc) newErrors.businessRegistrationDoc = 'Business registration document is required';
        break;
      case 6:
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

  const handleSaveDraft = () => {
    const draft = {
      ...formData,
      savedAt: new Date().toISOString(),
      step: activeStep
    };
    
    localStorage.setItem('smeLoanDraft', JSON.stringify(draft));
    setSnackbarMessage('Draft saved successfully!');
    setShowSnackbar(true);
  };

  const handleSubmit = async () => {
    if (validateStep(6)) {
      setIsSubmitting(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitSuccess(true);
        localStorage.removeItem('smeLoanDraft');
      } catch (error) {
        setSnackbarMessage('Submission failed. Please try again.');
        setShowSnackbar(true);
      } finally {
        setIsSubmitting(false);
      }
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
                  Personal Information
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Tell us about yourself
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                required 
                fullWidth 
                label="Full Name" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                error={!!errors.fullName} 
                helperText={errors.fullName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                    </InputAdornment>
                  ),
                }}
                {...baseTextFieldProps}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField 
                  required 
                  fullWidth 
                  label="Email Address" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  error={!!errors.email} 
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                      </InputAdornment>
                    ),
                  }}
                  {...baseTextFieldProps}
                />
                <TextField 
                  required 
                  fullWidth 
                  label="Phone Number" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  error={!!errors.phone} 
                  helperText={errors.phone}
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
              <TextField 
                required 
                fullWidth 
                label="Physical Address" 
                name="address" 
                multiline 
                rows={2} 
                value={formData.address} 
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                      <MapPin size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                    </InputAdornment>
                  ),
                }}
                {...baseTextFieldProps}
              />
              <TextField 
                required 
                fullWidth 
                label="City/Town" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange}
                {...baseTextFieldProps}
              />
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
                <Building2 size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Business Details
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Information about your business
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                required 
                fullWidth 
                label="Business Name" 
                name="businessName" 
                value={formData.businessName} 
                onChange={handleInputChange} 
                error={!!errors.businessName} 
                helperText={errors.businessName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Briefcase size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                    </InputAdornment>
                  ),
                }}
                {...baseTextFieldProps}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField 
                  fullWidth 
                  label="Registration Number" 
                  name="registrationNo" 
                  value={formData.registrationNo} 
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FileText size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                      </InputAdornment>
                    ),
                  }}
                  {...baseTextFieldProps}
                />
                <FormControl fullWidth required error={!!errors.businessType}>
                  <InputLabel>Business Type</InputLabel>
                  <Select 
                    name="businessType" 
                    value={formData.businessType} 
                    onChange={handleSelectChange('businessType')} 
                    label="Business Type"
                    {...baseSelectProps}
                  >
                    {businessTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                  {errors.businessType && <FormHelperText>{errors.businessType}</FormHelperText>}
                </FormControl>
              </Box>
              <TextField 
                required 
                fullWidth 
                label="Years in Operation" 
                name="yearsInOperation" 
                type="number" 
                value={formData.yearsInOperation || ''} 
                onChange={handleInputChange} 
                error={!!errors.yearsInOperation} 
                helperText={errors.yearsInOperation}
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
                <DollarSign size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Loan Request
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Financial details and requirements
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <FormControl fullWidth required error={!!errors.loanProduct}>
                  <InputLabel>Loan Product</InputLabel>
                  <Select 
                    name="loanProduct" 
                    value={formData.loanProduct} 
                    onChange={handleSelectChange('loanProduct')} 
                    label="Loan Product"
                    {...baseSelectProps}
                  >
                    {loanProducts.map((product) => (
                      <MenuItem key={product} value={product}>{product}</MenuItem>
                    ))}
                  </Select>
                  {errors.loanProduct && <FormHelperText>{errors.loanProduct}</FormHelperText>}
                </FormControl>
                <TextField 
                  required 
                  fullWidth 
                  label="Loan Amount (MWK)" 
                  name="loanAmount" 
                  type="number" 
                  value={formData.loanAmount || ''} 
                  onChange={handleInputChange} 
                  error={!!errors.loanAmount} 
                  helperText={errors.loanAmount || 'Range: MK100,000 - MK5,000,000'} 
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">MK</InputAdornment>, 
                    inputProps: { min: 100000, max: 5000000, step: 1000 } 
                  }}
                  {...baseTextFieldProps}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField 
                  required 
                  fullWidth 
                  label="Payback Period (Months)" 
                  name="paybackPeriodMonths" 
                  type="number" 
                  value={formData.paybackPeriodMonths || ''} 
                  onChange={handleInputChange} 
                  error={!!errors.paybackPeriodMonths} 
                  helperText={errors.paybackPeriodMonths || '1-120 months'} 
                  InputProps={{ inputProps: { min: 1, max: 120 } }}
                  {...baseTextFieldProps}
                />
                <FormControl fullWidth required error={!!errors.repaymentMethod}>
                  <InputLabel>Repayment Method</InputLabel>
                  <Select 
                    name="repaymentMethod" 
                    value={formData.repaymentMethod} 
                    onChange={handleSelectChange('repaymentMethod')} 
                    label="Repayment Method"
                    {...baseSelectProps}
                  >
                    {repaymentMethods.map((method) => (
                      <MenuItem key={method} value={method}>{method}</MenuItem>
                    ))}
                  </Select>
                  {errors.repaymentMethod && <FormHelperText>{errors.repaymentMethod}</FormHelperText>}
                </FormControl>
              </Box>
              <TextField 
                required 
                fullWidth 
                label="Purpose of Loan" 
                name="purposeOfLoan" 
                multiline 
                rows={3} 
                value={formData.purposeOfLoan} 
                onChange={handleInputChange} 
                error={!!errors.purposeOfLoan} 
                helperText={errors.purposeOfLoan}
                {...baseTextFieldProps}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField 
                  fullWidth 
                  label="Estimated Monthly Turnover (MWK)" 
                  name="estimatedMonthlyTurnover" 
                  type="number" 
                  value={formData.estimatedMonthlyTurnover || ''} 
                  onChange={handleInputChange} 
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">
                      <TrendingUp size={20} color={isDarkMode ? '#a1a1aa' : '#71717a'} />
                    </InputAdornment> 
                  }}
                  {...baseTextFieldProps}
                />
                <TextField 
                  fullWidth 
                  label="Estimated Monthly Profit (MWK)" 
                  name="estimatedMonthlyProfit" 
                  type="number" 
                  value={formData.estimatedMonthlyProfit || ''} 
                  onChange={handleInputChange} 
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">MK</InputAdornment> 
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
                <Users size={24} color={limeColors[500]} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600 }}>
                  Group Lending
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                  Optional group lending information
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: isDarkMode ? 'rgba(132, 204, 22, 0.05)' : 'rgba(132, 204, 22, 0.03)',
                border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 0.5 }}>
                    Group Lending Application
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                    Apply as part of a lending group
                  </Typography>
                </Box>
                <Switch 
                  checked={formData.isGroupLending} 
                  onChange={(e) => setFormData(prev => ({ ...prev, isGroupLending: e.target.checked }))} 
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: limeColors[500],
                      '& + .MuiSwitch-track': {
                        backgroundColor: limeColors[500],
                      },
                    },
                  }}
                />
              </Box>
              {formData.isGroupLending && (
                <Box sx={{ 
                  p: 3, 
                  borderRadius: '16px', 
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                  border: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}>
                  <TextField 
                    required 
                    fullWidth 
                    label="Group Name" 
                    name="groupName" 
                    value={formData.groupName} 
                    onChange={handleInputChange} 
                    error={!!errors.groupName} 
                    helperText={errors.groupName}
                    {...baseTextFieldProps}
                  />
                  <TextField 
                    required 
                    fullWidth 
                    label="Number of Group Members" 
                    name="groupMemberCount" 
                    type="number" 
                    value={formData.groupMemberCount || ''} 
                    onChange={handleInputChange} 
                    error={!!errors.groupMemberCount} 
                    helperText={errors.groupMemberCount || '2-20 members'} 
                    InputProps={{ inputProps: { min: 2, max: 20 } }}
                    {...baseTextFieldProps}
                  />
                </Box>
              )}
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
                  <Building2 size={32} color={limeColors[500]} style={{ margin: '0 auto 12px' }} />
                  <Typography variant="subtitle1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 0.5 }}>
                    Business Registration *
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', mb: 2 }}>
                    Registration certificate
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
                    {formData.businessRegistrationDoc ? 'Change File' : 'Upload'}
                    <VisuallyHiddenInput type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload('businessRegistrationDoc')} />
                  </Button>
                  {formData.businessRegistrationDoc && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: limeColors[500] }}>
                      ✓ {formData.businessRegistrationDoc.name}
                    </Typography>
                  )}
                  {errors.businessRegistrationDoc && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {errors.businessRegistrationDoc}
                    </Typography>
                  )}
                </Box>
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
                  Financial Statements (Optional)
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', mb: 2 }}>
                  Recent financial statements
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
                  {formData.financialStatementDoc ? 'Change File' : 'Upload'}
                  <VisuallyHiddenInput type="file" accept=".pdf,.xlsx,.xls" onChange={handleFileUpload('financialStatementDoc')} />
                </Button>
                {formData.financialStatementDoc && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 2, color: limeColors[500] }}>
                    ✓ {formData.financialStatementDoc.name}
                  </Typography>
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
                Loan Application Terms and Conditions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'I hereby apply for the loan facility indicated in this application form and declare that the information provided is true, complete, and accurate to the best of my knowledge.',
                  'I understand that any false or misleading information may result in the rejection of my application and/or legal action.',
                  'I authorize the financial institution to conduct credit checks and verify the information provided with relevant authorities and credit bureaus.',
                  'I consent to the processing of my personal data for the purpose of assessing this loan application and for related administrative purposes.',
                  'I understand that approval of this loan is subject to the institution\'s credit policies and I am not guaranteed approval.',
                  'I agree to repay the loan according to the terms and conditions that will be specified in the loan agreement.',
                  'I understand that defaulting on repayment may affect my credit rating and may result in legal action for recovery of the outstanding amount.'
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
            SME-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </Typography>
          
          <Divider sx={{ my: 4, borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)' }} />
          
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mb: 3 }}>
              Application Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Business Name
                </Typography>
                <Typography variant="body1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mt: 0.5 }}>
                  {formData.businessName}
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
                  Loan Product
                </Typography>
                <Typography variant="body1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 600, mt: 0.5 }}>
                  {formData.loanProduct}
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
            </Box>
          </Box>
          
          <Box sx={{ 
            mt: 4, 
            pt: 4, 
            borderTop: `1.5px solid ${isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'}`,
            textAlign: 'left'
          }}>
            <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', lineHeight: 1.6 }}>
              <strong style={{ color: isDarkMode ? 'white' : '#18181b' }}>Next Steps:</strong> Our team will review your application and contact you within 3-5 business days. 
              You will receive an email confirmation with your application details.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );

  if (submitSuccess) {
    return <SummaryDisplay />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ color: isDarkMode ? 'white' : '#18181b', fontWeight: 700, mb: 1 }}>
          SME Loan Application
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
              }
            }}
          >
            Save Draft
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
