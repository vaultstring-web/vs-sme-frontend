import axios from 'axios';
import { getSession, setSession, clearSession } from '@/utils/sessionStorage';

function isPrivateIp(host: string): boolean {
  return (
    /^10\./.test(host) ||
    /^127\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
    host === 'localhost' ||
    host === '::1'
  );
}

function resolveApiBase(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const port = window.location.port;
    // If running the Next dev server on 3001 or on a private/local host, target local backend
    if (port === '3001' || isPrivateIp(host)) {
      return 'http://localhost:3000';
    }
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-thrive.vaultstring.com';
}

export const API_BASE_URL = resolveApiBase();

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
        
        const { accessToken: newAccessToken, profile } = response.data;
        
        // Update session with new access token (keep the same refresh token)
        if (typeof window !== 'undefined') {
          const { user } = getSession();
          
          // Update user profile if provided in response
          const updatedUser = profile ? {
            id: profile.id,
            email: profile.email,
            name: profile.fullName || profile.name,
            fullName: profile.fullName,
            role: profile.role
          } : user;
          
          setSession(newAccessToken, refreshToken, updatedUser);
        }
        
        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        if (typeof window !== 'undefined') {
          clearSession();
          // Redirect to login page
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
