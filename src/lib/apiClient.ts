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
    if (port === '3000' || isPrivateIp(host)) {
      return 'http://localhost:3001';
    }
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-thrive.vaultstring.com';
}

export const API_BASE_URL = resolveApiBase();

const apiClient = axios.create({
  baseURL: API_BASE_URL + '/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const { accessToken } = getSession();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;  // ← backticks
    }
  }
  return config;
});

// Response interceptor - handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = getSession();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,  // ← backticks
          { refreshToken }
        );

        const { accessToken: newAccessToken, profile } = response.data;

        if (typeof window !== 'undefined') {
          const { user } = getSession();

          const updatedUser = profile ? {
            id: profile.id,
            email: profile.email,
            name: profile.fullName || profile.name,
            fullName: profile.fullName,
            role: profile.role,
            permissions: user?.permissions || []
          } : user;

          setSession(newAccessToken, refreshToken, updatedUser);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;  // ← backticks
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          clearSession();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;