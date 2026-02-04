import axios from 'axios';
import { getSession } from '@/utils/sessionStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const { accessToken } = getSession();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Response interceptor - handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { refreshToken } = getSession();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          { refreshToken }
        );
        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, profile } = response.data;
        
        // Update session
        if (typeof window !== 'undefined') {
          // Need to update setSession function to handle both tokens
          // We'll update this in sessionStorage.ts
        }
        
        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        if (typeof window !== 'undefined') {
          // Clear session and redirect to login
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;