'use client';
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import apiClient from '../lib/apiClient';

// Application types matching backend
export type ApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'DISBURSED' 
  | 'REPAYED' 
  | 'DEFAULTED';

export type ApplicationType = 'SME' | 'PAYROLL';

export interface SMEData {
  businessName: string;
  loanAmount: number;
  loanProduct: string;
}

export interface PayrollData {
  employerName: string;
  loanAmount: number;
  jobTitle: string;
}

export interface Application {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  createdAt: string;
  submittedAt: string | null;
  smeData?: SMEData | null;
  payrollData?: PayrollData | null;
}

export interface ApplicationDetail extends Application {
  userId: string;
  smeData?: any;
  payrollData?: any;
  documents?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    documentType: string;
    uploadedAt: string;
  }>;
}

export interface ApplicationsFilters {
  status?: ApplicationStatus;
  type?: ApplicationType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface ApplicationsMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

interface ApplicationsState {
  applications: Application[];
  currentApplication: ApplicationDetail | null;
  meta: ApplicationsMeta;
  isLoading: boolean;
  error: string | null;
}

interface ApplicationsContextType extends ApplicationsState {
  fetchApplications: (filters?: ApplicationsFilters) => Promise<void>;
  fetchApplicationById: (id: string) => Promise<void>;
  createSMEApplication: (data: any) => Promise<{ id: string }>;
  createPayrollApplication: (data: any) => Promise<{ id: string }>;
  createDraftApplication: (type: ApplicationType) => Promise<{ id: string }>;
  updateSMEApplication: (id: string, data: any) => Promise<void>;
  updatePayrollApplication: (id: string, data: any) => Promise<void>;
  uploadDocument: (applicationId: string, file: File, documentType: string) => Promise<void>;
  submitApplication: (id: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  setCurrentApplication: (application: ApplicationDetail | null) => void;
  clearError: () => void;
  refreshApplications: () => Promise<void>;
}

export const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ApplicationsState>({
    applications: [],
    currentApplication: null,
    meta: {
      total: 0,
      page: 1,
      totalPages: 0,
      limit: 10,
    },
    isLoading: false,
    error: null,
  });

  const [currentFilters, setCurrentFilters] = useState<ApplicationsFilters>({});

  const fetchApplications = useCallback(async (filters: ApplicationsFilters = {}) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get(`/applications?${params.toString()}`);
      
      setState(prev => ({
        ...prev,
        applications: response.data.data,
        meta: response.data.meta,
        isLoading: false,
      }));

      setCurrentFilters(filters);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch applications';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const refreshApplications = useCallback(async () => {
    await fetchApplications(currentFilters);
  }, [currentFilters, fetchApplications]);

  const fetchApplicationById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiClient.get(`/applications/${id}`);
      
      setState(prev => ({
        ...prev,
        currentApplication: response.data.app,
        isLoading: false,
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch application';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const createSMEApplication = useCallback(async (data: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiClient.post('/applications/sme', data);
      setState(prev => ({ ...prev, isLoading: false }));
      return { id: response.data.data.id };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create SME application';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const createPayrollApplication = useCallback(async (data: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiClient.post('/applications/payroll', data);
      setState(prev => ({ ...prev, isLoading: false }));
      return { id: response.data.data.id };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create payroll application';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const createDraftApplication = useCallback(async (type: ApplicationType) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiClient.post('/applications/draft', { type });
      setState(prev => ({ ...prev, isLoading: false }));
      return { id: response.data.data.id };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create draft application';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const setCurrentApplication = useCallback((application: ApplicationDetail | null) => {
    setState(prev => ({ ...prev, currentApplication: application }));
  }, []);

  // FIXED: Backend uses /applications/:id (not /applications/:id/sme)
  // The route handler checks the application type and updates accordingly
  const updateSMEApplication = useCallback(async (id: string, data: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Backend route is PATCH /applications/:id/draft or PATCH /applications/:id
      // Both use the same handler (saveDraftApplication)
      await apiClient.patch(`/applications/${id}`, data);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update SME application';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const updatePayrollApplication = useCallback(async (id: string, data: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Backend route is PATCH /applications/:id/draft or PATCH /applications/:id
      await apiClient.patch(`/applications/${id}`, data);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update payroll application';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const uploadDocument = useCallback(async (applicationId: string, file: File, documentType: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      await apiClient.post(`/applications/${applicationId}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload document';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const submitApplication = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Backend expects PATCH not POST for submit
      await apiClient.patch(`/applications/${id}/submit`);
      setState(prev => ({ ...prev, isLoading: false }));
      // Refresh the applications list after submission
      await refreshApplications();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit application';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, [refreshApplications]);

  const deleteApplication = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await apiClient.delete(`/applications/${id}`);
      setState(prev => ({ ...prev, isLoading: false }));
      // Refresh the applications list after deletion
      await refreshApplications();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete application';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, [refreshApplications]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <ApplicationsContext.Provider
      value={{
        ...state,
        fetchApplications,
        fetchApplicationById,
        createSMEApplication,
        createPayrollApplication,
        createDraftApplication,
        updateSMEApplication,
        updatePayrollApplication,
        uploadDocument,
        submitApplication,
        deleteApplication,
        clearError,
        setCurrentApplication,
        refreshApplications,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};