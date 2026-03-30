import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import { Loan, LoanPayment } from '../types/api';

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyLoans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/loans/my');
      setLoans(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch loans');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLoanById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/loans/${id}`);
      setCurrentLoan(response.data);
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch loan details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllLoans = useCallback(async (params?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = params ? new URLSearchParams(params).toString() : '';
      const response = await apiClient.get(`/admin/loans${query ? `?${query}` : ''}`);
      setLoans(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch all loans');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordPayment = useCallback(async (loanId: string, paymentData: Partial<LoanPayment>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/admin/loans/${loanId}/payments`, paymentData);
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || 'Failed to record payment';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disburseLoan = useCallback(async (applicationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/admin/loans/disburse', { applicationId });
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || 'Failed to disburse loan';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restructureLoan = useCallback(async (loanId: string, data: { newMonths: number, newInterestRate: number, reason: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/admin/loans/${loanId}/restructure`, data);
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || 'Failed to restructure loan';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchComplianceReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/admin/loans/compliance');
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to fetch compliance report');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    loans,
    currentLoan,
    isLoading,
    error,
    fetchMyLoans,
    fetchLoanById,
    fetchAllLoans,
    recordPayment,
    disburseLoan,
    restructureLoan,
    fetchComplianceReport,
    clearError
  };
}
