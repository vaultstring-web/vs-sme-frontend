const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

export const setSession = (accessToken: string, refreshToken: string, user: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
    }
};

export const getSession = () => {
    if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);
        const user = userStr ? JSON.parse(userStr) : null;
        return { accessToken, refreshToken, user };
    }
    return { accessToken: null, refreshToken: null, user: null };
};

export const clearSession = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.dispatchEvent(new Event('storage'));
    }
};

export const initializeSessionSync = (callback: () => void) => {
    if (typeof window !== 'undefined') {
        const handleStorageChange = () => {
            callback();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }
    return () => { };
};