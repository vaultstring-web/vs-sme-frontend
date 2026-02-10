interface User {
    id: string;
    email: string;
    name: string;
    fullName: string;
    role: string;
}

interface Session {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
}

const SESSION_KEY = 'auth_session';
const SESSION_EVENT = 'session_change';

/**
 * Get the current session from localStorage
 */
export function getSession(): Session {
    if (typeof window === 'undefined') {
        return { accessToken: null, refreshToken: null, user: null };
    }

    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (!sessionData) {
            return { accessToken: null, refreshToken: null, user: null };
        }

        const parsed = JSON.parse(sessionData);
        return {
            accessToken: parsed.accessToken || null,
            refreshToken: parsed.refreshToken || null,
            user: parsed.user || null,
        };
    } catch (error) {
        console.error('Error reading session:', error);
        return { accessToken: null, refreshToken: null, user: null };
    }
}

/**
 * Set the session in localStorage
 */
export function setSession(
    accessToken: string,
    refreshToken: string,
    user: User | null
): void {
    if (typeof window === 'undefined') return;

    try {
        const sessionData = {
            accessToken,
            refreshToken,
            user,
            timestamp: Date.now(),
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        
        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new CustomEvent(SESSION_EVENT, { 
            detail: sessionData 
        }));
    } catch (error) {
        console.error('Error setting session:', error);
    }
}

/**
 * Update only the access token (useful for token refresh)
 */
export function updateAccessToken(accessToken: string): void {
    if (typeof window === 'undefined') return;

    try {
        const currentSession = getSession();
        if (currentSession.refreshToken) {
            setSession(accessToken, currentSession.refreshToken, currentSession.user);
        }
    } catch (error) {
        console.error('Error updating access token:', error);
    }
}

/**
 * Update only the user data
 */
export function updateUser(user: User): void {
    if (typeof window === 'undefined') return;

    try {
        const currentSession = getSession();
        if (currentSession.accessToken && currentSession.refreshToken) {
            setSession(currentSession.accessToken, currentSession.refreshToken, user);
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

/**
 * Clear the session from localStorage
 */
export function clearSession(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(SESSION_KEY);
        
        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new CustomEvent(SESSION_EVENT, { 
            detail: null 
        }));
    } catch (error) {
        console.error('Error clearing session:', error);
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    const { accessToken } = getSession();
    return !!accessToken;
}

/**
 * Initialize cross-tab session synchronization
 * Returns cleanup function to remove event listeners
 */
export function initializeSessionSync(onSessionChange: () => void): () => void {
    if (typeof window === 'undefined') {
        return () => {};
    }

    // Handle storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === SESSION_KEY) {
            onSessionChange();
        }
    };

    // Handle custom events from same tab
    const handleSessionChange = () => {
        onSessionChange();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SESSION_EVENT, handleSessionChange);

    // Return cleanup function
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener(SESSION_EVENT, handleSessionChange);
    };
}

/**
 * Get user from session
 */
export function getUser(): User | null {
    const { user } = getSession();
    return user;
}

/**
 * Get access token from session
 */
export function getAccessToken(): string | null {
    const { accessToken } = getSession();
    return accessToken;
}

/**
 * Get refresh token from session
 */
export function getRefreshToken(): string | null {
    const { refreshToken } = getSession();
    return refreshToken;
}