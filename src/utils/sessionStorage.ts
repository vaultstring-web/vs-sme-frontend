const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const setSession = (token: string, user: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'));
    }
};

export const getSession = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);
        const user = userStr ? JSON.parse(userStr) : null;
        return { token, user };
    }
    return { token: null, user: null };
};

export const clearSession = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
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
