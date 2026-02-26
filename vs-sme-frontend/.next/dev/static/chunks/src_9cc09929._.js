(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/utils/sessionStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSession",
    ()=>clearSession,
    "getAccessToken",
    ()=>getAccessToken,
    "getRefreshToken",
    ()=>getRefreshToken,
    "getSession",
    ()=>getSession,
    "getUser",
    ()=>getUser,
    "initializeSessionSync",
    ()=>initializeSessionSync,
    "isAuthenticated",
    ()=>isAuthenticated,
    "setSession",
    ()=>setSession,
    "updateAccessToken",
    ()=>updateAccessToken,
    "updateUser",
    ()=>updateUser
]);
const SESSION_KEY = 'auth_session';
const SESSION_EVENT = 'session_change';
function getSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (!sessionData) {
            return {
                accessToken: null,
                refreshToken: null,
                user: null
            };
        }
        const parsed = JSON.parse(sessionData);
        return {
            accessToken: parsed.accessToken || null,
            refreshToken: parsed.refreshToken || null,
            user: parsed.user || null
        };
    } catch (error) {
        console.error('Error reading session:', error);
        return {
            accessToken: null,
            refreshToken: null,
            user: null
        };
    }
}
function setSession(accessToken, refreshToken, user) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const sessionData = {
            accessToken,
            refreshToken,
            user,
            timestamp: Date.now()
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
function updateAccessToken(accessToken) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const currentSession = getSession();
        if (currentSession.refreshToken) {
            setSession(accessToken, currentSession.refreshToken, currentSession.user);
        }
    } catch (error) {
        console.error('Error updating access token:', error);
    }
}
function updateUser(user) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const currentSession = getSession();
        if (currentSession.accessToken && currentSession.refreshToken) {
            setSession(currentSession.accessToken, currentSession.refreshToken, user);
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}
function clearSession() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
function isAuthenticated() {
    const { accessToken } = getSession();
    return !!accessToken;
}
function initializeSessionSync(onSessionChange) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Handle storage events from other tabs
    const handleStorageChange = (e)=>{
        if (e.key === SESSION_KEY) {
            onSessionChange();
        }
    };
    // Handle custom events from same tab
    const handleSessionChange = ()=>{
        onSessionChange();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SESSION_EVENT, handleSessionChange);
    // Return cleanup function
    return ()=>{
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener(SESSION_EVENT, handleSessionChange);
    };
}
function getUser() {
    const { user } = getSession();
    return user;
}
function getAccessToken() {
    const { accessToken } = getSession();
    return accessToken;
}
function getRefreshToken() {
    const { refreshToken } = getSession();
    return refreshToken;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/apiClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$13$2e$4$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/axios@1.13.4/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/sessionStorage.ts [app-client] (ecmascript)");
;
;
function isPrivateIp(host) {
    return /^10\./.test(host) || /^127\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) || host === 'localhost' || host === '::1';
}
function resolveApiBase() {
    if ("TURBOPACK compile-time truthy", 1) {
        const host = window.location.hostname;
        const port = window.location.port;
        // If running the Next dev server on 3001 or on a private/local host, target local backend
        if (port === '3001' || isPrivateIp(host)) {
            return 'http://localhost:3000';
        }
    }
    return ("TURBOPACK compile-time value", "http://localhost:3000") || 'https://api-thrive.vaultstring.com';
}
const API_BASE_URL = resolveApiBase();
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$13$2e$4$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL + '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Request interceptor - attach auth token
apiClient.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const { accessToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
});
// Response interceptor - handle token refresh on 401
apiClient.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const { refreshToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
            if (!refreshToken) {
                throw new Error('No refresh token');
            }
            // Call refresh token endpoint
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$13$2e$4$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/api/auth/refresh-token`, {
                refreshToken
            });
            const { accessToken: newAccessToken, profile } = response.data;
            // Update session with new access token (keep the same refresh token)
            if ("TURBOPACK compile-time truthy", 1) {
                const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
                // Update user profile if provided in response
                const updatedUser = profile ? {
                    id: profile.id,
                    email: profile.email,
                    name: profile.fullName || profile.name,
                    fullName: profile.fullName,
                    role: profile.role
                } : user;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSession"])(newAccessToken, refreshToken, updatedUser);
            }
            // Update the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            // Refresh failed - logout user
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearSession"])();
                // Redirect to login page
                window.location.href = '/login';
            }
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/sessionStorage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const AuthProvider = ({ children })=>{
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
    });
    // 🛡️ Promise cache for duplicate API calls
    const pendingRegistrations = new Map();
    const uploadDocuments = async (formData)=>{
        setState((prev)=>({
                ...prev,
                isLoading: true,
                error: null
            }));
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/users/me/documents', formData, {
                headers: {
                    'Content-Type': undefined
                }
            });
            setState((prev_1)=>({
                    ...prev_1,
                    isLoading: false
                }));
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Document upload failed';
            setState((prev_0)=>({
                    ...prev_0,
                    isLoading: false,
                    error: errorMessage
                }));
            throw err;
        }
    };
    const changePassword = async (data)=>{
        setState((prev_2)=>({
                ...prev_2,
                isLoading: true,
                error: null
            }));
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/change-password', data);
            setState((prev_4)=>({
                    ...prev_4,
                    isLoading: false
                }));
        } catch (err_0) {
            const errorMessage_0 = err_0.response?.data?.message || err_0.message || 'Password change failed';
            setState((prev_3)=>({
                    ...prev_3,
                    isLoading: false,
                    error: errorMessage_0
                }));
            throw err_0;
        }
    };
    const fetchCurrentUser = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/auth/users/me');
            const userData = response.data.user;
            const user = {
                id: userData.id,
                email: userData.email,
                name: userData.fullName || userData.name,
                fullName: userData.fullName,
                role: userData.role
            };
            setState((prev_6)=>({
                    ...prev_6,
                    user,
                    isAuthenticated: true,
                    isLoading: false
                }));
            const { accessToken, refreshToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
            if (accessToken && refreshToken) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSession"])(accessToken, refreshToken, user);
            }
        } catch (err_1) {
            console.error('Failed to fetch current user:', err_1);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearSession"])();
            setState((prev_5)=>({
                    ...prev_5,
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                }));
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const initializeAuth = {
                "AuthProvider.useEffect.initializeAuth": async ()=>{
                    const { accessToken: accessToken_0, user: user_0 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
                    if (accessToken_0) {
                        if (user_0) {
                            setState({
                                "AuthProvider.useEffect.initializeAuth": (prev_7)=>({
                                        ...prev_7,
                                        user: user_0,
                                        isAuthenticated: true,
                                        isLoading: true
                                    })
                            }["AuthProvider.useEffect.initializeAuth"]);
                            await fetchCurrentUser();
                        } else {
                            await fetchCurrentUser();
                        }
                    } else {
                        setState({
                            "AuthProvider.useEffect.initializeAuth": (prev_8)=>({
                                    ...prev_8,
                                    isLoading: false
                                })
                        }["AuthProvider.useEffect.initializeAuth"]);
                    }
                }
            }["AuthProvider.useEffect.initializeAuth"];
            initializeAuth();
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeSessionSync"])({
                "AuthProvider.useEffect": ()=>{
                    const { accessToken: accessToken_1, user: user_1 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
                    if (accessToken_1 && user_1) {
                        setState({
                            "AuthProvider.useEffect": (prev_9)=>({
                                    ...prev_9,
                                    user: user_1,
                                    isAuthenticated: true
                                })
                        }["AuthProvider.useEffect"]);
                    } else {
                        setState({
                            "AuthProvider.useEffect": (prev_10)=>({
                                    ...prev_10,
                                    user: null,
                                    isAuthenticated: false
                                })
                        }["AuthProvider.useEffect"]);
                    }
                }
            }["AuthProvider.useEffect"]);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (data_0)=>{
        setState((prev_11)=>({
                ...prev_11,
                isLoading: true,
                error: null
            }));
        try {
            const response_0 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/login', data_0);
            const { accessToken: accessToken_2, refreshToken: refreshToken_0, profile } = response_0.data;
            const user_2 = {
                id: profile.id,
                email: profile.email,
                name: profile.fullName,
                fullName: profile.fullName,
                role: profile.role
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSession"])(accessToken_2, refreshToken_0, user_2);
            setState({
                user: user_2,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (err_2) {
            const errorMessage_1 = err_2.response?.data?.message || err_2.message || 'Login failed';
            setState((prev_12)=>({
                    ...prev_12,
                    isLoading: false,
                    error: errorMessage_1
                }));
            throw err_2;
        }
    };
    const register = async (data_1)=>{
        // 🛡️ Prevent duplicate registration calls with identical payload
        const key = JSON.stringify(data_1);
        if (pendingRegistrations.has(key)) {
            return pendingRegistrations.get(key);
        }
        setState((prev_13)=>({
                ...prev_13,
                isLoading: true,
                error: null
            }));
        const promise = (async ()=>{
            try {
                const response_1 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/register', data_1);
                const { accessToken: accessToken_3, refreshToken: refreshToken_1, profile: profile_0 } = response_1.data;
                const user_3 = {
                    id: profile_0.id,
                    email: profile_0.email,
                    name: profile_0.fullName,
                    fullName: profile_0.fullName,
                    role: profile_0.role
                };
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSession"])(accessToken_3, refreshToken_1, user_3);
                setState({
                    user: user_3,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
            } catch (err_3) {
                const errorMessage_2 = err_3.response?.data?.message || err_3.message || 'Registration failed';
                setState((prev_14)=>({
                        ...prev_14,
                        isLoading: false,
                        error: errorMessage_2
                    }));
                throw err_3;
            } finally{
                pendingRegistrations.delete(key);
            }
        })();
        pendingRegistrations.set(key, promise);
        return promise;
    };
    const logout = async ()=>{
        try {
            const { refreshToken: refreshToken_2 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSession"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/logout', {
                refreshToken: refreshToken_2
            });
        } catch (err_4) {
            console.error('Logout error:', err_4);
        } finally{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$sessionStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearSession"])();
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        }
    };
    const resetPasswordRequest = async (email)=>{
        setState((prev_15)=>({
                ...prev_15,
                isLoading: true,
                error: null
            }));
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/password-reset/request', {
                email
            });
            setState((prev_17)=>({
                    ...prev_17,
                    isLoading: false
                }));
        } catch (err_5) {
            const errorMessage_3 = err_5.response?.data?.message || err_5.message || 'Password reset request failed';
            setState((prev_16)=>({
                    ...prev_16,
                    isLoading: false,
                    error: errorMessage_3
                }));
            throw err_5;
        }
    };
    const resetPasswordConfirm = async (data_2)=>{
        setState((prev_18)=>({
                ...prev_18,
                isLoading: true,
                error: null
            }));
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/password-reset/confirm', data_2);
            setState((prev_20)=>({
                    ...prev_20,
                    isLoading: false
                }));
        } catch (err_6) {
            const errorMessage_4 = err_6.response?.data?.message || err_6.message || 'Password reset failed';
            setState((prev_19)=>({
                    ...prev_19,
                    isLoading: false,
                    error: errorMessage_4
                }));
            throw err_6;
        }
    };
    const clearError = ()=>{
        setState((prev_21)=>({
                ...prev_21,
                error: null
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            ...state,
            login,
            register,
            uploadDocuments,
            logout,
            resetPasswordRequest,
            resetPasswordConfirm,
            changePassword,
            fetchCurrentUser,
            clearError
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.tsx",
        lineNumber: 346,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "TL95UxYyfeP0u6Fkr+VABvDx9D8=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/ApplicationsContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApplicationsContext",
    ()=>ApplicationsContext,
    "ApplicationsProvider",
    ()=>ApplicationsProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const ApplicationsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ApplicationsProvider = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(35);
    if ($[0] !== "964aa68fea9989d7762e4c916cab9a272459b8289ed662d992eec7a00b889c0e") {
        for(let $i = 0; $i < 35; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "964aa68fea9989d7762e4c916cab9a272459b8289ed662d992eec7a00b889c0e";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = {
            total: 0,
            page: 1,
            totalPages: 0,
            limit: 10
        };
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = [];
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = {
            applications: t1,
            currentApplication: null,
            meta: t2,
            isLoading: false,
            error: null,
            adminApplications: t3,
            adminCurrentApplication: null,
            adminMeta: {
                total: 0,
                page: 1,
                totalPages: 0,
                limit: 10
            },
            adminIsLoading: false,
            adminError: null
        };
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t4);
    let t5;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {};
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    const [currentFilters, setCurrentFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t5);
    let t6;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = async (t7)=>{
            const filters = t7 === undefined ? {} : t7;
            setState(_temp);
            ;
            try {
                const params = new URLSearchParams();
                if (filters.status) {
                    params.append("status", filters.status);
                }
                if (filters.type) {
                    params.append("type", filters.type);
                }
                if (filters.startDate) {
                    params.append("startDate", filters.startDate);
                }
                if (filters.endDate) {
                    params.append("endDate", filters.endDate);
                }
                if (filters.page) {
                    params.append("page", filters.page.toString());
                }
                if (filters.limit) {
                    params.append("limit", filters.limit.toString());
                }
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/applications?${params.toString()}`);
                setState((prev_1)=>({
                        ...prev_1,
                        applications: response.data.data,
                        meta: response.data.meta,
                        isLoading: false
                    }));
                setCurrentFilters(filters);
            } catch (t8) {
                const err = t8;
                const errorMessage = err.response?.data?.message || err.message || "Failed to fetch applications";
                setState((prev_0)=>({
                        ...prev_0,
                        isLoading: false,
                        error: errorMessage
                    }));
                throw err;
            }
        };
        $[6] = t6;
    } else {
        t6 = $[6];
    }
    const fetchApplications = t6;
    let t7;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = async (t8)=>{
            const filters_0 = t8 === undefined ? {} : t8;
            setState(_temp2);
            ;
            try {
                const params_0 = new URLSearchParams();
                if (filters_0.status) {
                    params_0.append("status", filters_0.status);
                }
                if (filters_0.type) {
                    params_0.append("type", filters_0.type);
                }
                if (filters_0.startDate) {
                    params_0.append("startDate", filters_0.startDate);
                }
                if (filters_0.endDate) {
                    params_0.append("endDate", filters_0.endDate);
                }
                if (filters_0.page) {
                    params_0.append("page", filters_0.page.toString());
                }
                if (filters_0.limit) {
                    params_0.append("limit", filters_0.limit.toString());
                }
                const response_0 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/admin/applications?${params_0.toString()}`);
                setState((prev_4)=>({
                        ...prev_4,
                        adminApplications: response_0.data.data,
                        adminMeta: response_0.data.meta,
                        adminIsLoading: false
                    }));
            } catch (t9) {
                const err_0 = t9;
                const errorMessage_0 = err_0.response?.data?.message || err_0.message || "Failed to fetch admin applications";
                setState((prev_3)=>({
                        ...prev_3,
                        adminIsLoading: false,
                        adminError: errorMessage_0
                    }));
                throw err_0;
            }
        };
        $[7] = t7;
    } else {
        t7 = $[7];
    }
    const fetchAdminApplications = t7;
    let t8;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = async (id)=>{
            setState(_temp3);
            ;
            try {
                const response_1 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/admin/applications/${id}`);
                setState((prev_7)=>({
                        ...prev_7,
                        adminCurrentApplication: response_1.data.data,
                        adminIsLoading: false
                    }));
            } catch (t9) {
                const err_1 = t9;
                const errorMessage_1 = err_1.response?.data?.message || err_1.message || "Failed to fetch admin application";
                setState((prev_6)=>({
                        ...prev_6,
                        adminIsLoading: false,
                        adminError: errorMessage_1
                    }));
                throw err_1;
            }
        };
        $[8] = t8;
    } else {
        t8 = $[8];
    }
    const fetchAdminApplicationById = t8;
    let t9;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = async (id_0, status, comment)=>{
            setState(_temp4);
            ;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/admin/applications/${id_0}/status`, {
                    status,
                    comment
                });
                await fetchAdminApplicationById(id_0);
                setState(_temp5);
            } catch (t10) {
                const err_2 = t10;
                const errorMessage_2 = err_2.response?.data?.message || err_2.message || "Failed to update status";
                setState((prev_9)=>({
                        ...prev_9,
                        adminIsLoading: false,
                        adminError: errorMessage_2
                    }));
                throw err_2;
            }
        };
        $[9] = t9;
    } else {
        t9 = $[9];
    }
    const updateAdminApplicationStatus = t9;
    let t10;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = async (id_1, payload)=>{
            setState(_temp6);
            ;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/admin/applications/${id_1}/data`, payload);
                await fetchAdminApplicationById(id_1);
                setState(_temp7);
            } catch (t11) {
                const err_3 = t11;
                const errorMessage_3 = err_3.response?.data?.message || err_3.message || "Failed to update application data";
                setState((prev_12)=>({
                        ...prev_12,
                        adminIsLoading: false,
                        adminError: errorMessage_3
                    }));
                throw err_3;
            }
        };
        $[10] = t10;
    } else {
        t10 = $[10];
    }
    const updateAdminApplicationData = t10;
    let t11;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = ()=>{
            setState(_temp8);
        };
        $[11] = t11;
    } else {
        t11 = $[11];
    }
    const clearAdminError = t11;
    let t12;
    if ($[12] !== currentFilters) {
        t12 = async ()=>{
            await fetchApplications(currentFilters);
        };
        $[12] = currentFilters;
        $[13] = t12;
    } else {
        t12 = $[13];
    }
    const refreshApplications = t12;
    let t13;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = async (id_2)=>{
            setState(_temp9);
            ;
            try {
                const response_2 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/applications/${id_2}`);
                setState((prev_17)=>({
                        ...prev_17,
                        currentApplication: response_2.data.app,
                        isLoading: false
                    }));
            } catch (t14) {
                const err_4 = t14;
                const errorMessage_4 = err_4.response?.data?.message || err_4.message || "Failed to fetch application";
                setState((prev_16)=>({
                        ...prev_16,
                        isLoading: false,
                        error: errorMessage_4
                    }));
                throw err_4;
            }
        };
        $[14] = t13;
    } else {
        t13 = $[14];
    }
    const fetchApplicationById = t13;
    let t14;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = async (data)=>{
            setState(_temp10);
            ;
            try {
                const response_3 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/applications/sme", data);
                setState(_temp11);
                return {
                    id: response_3.data.data.id
                };
            } catch (t15) {
                const err_5 = t15;
                const errorMessage_5 = err_5.response?.data?.message || err_5.message || "Failed to create SME application";
                setState((prev_19)=>({
                        ...prev_19,
                        isLoading: false,
                        error: errorMessage_5
                    }));
                throw err_5;
            }
        };
        $[15] = t14;
    } else {
        t14 = $[15];
    }
    const createSMEApplication = t14;
    let t15;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = async (data_0)=>{
            setState(_temp12);
            ;
            try {
                const response_4 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/applications/payroll", data_0);
                setState(_temp13);
                return {
                    id: response_4.data.data.id
                };
            } catch (t16) {
                const err_6 = t16;
                const errorMessage_6 = err_6.response?.data?.message || err_6.message || "Failed to create payroll application";
                setState((prev_22)=>({
                        ...prev_22,
                        isLoading: false,
                        error: errorMessage_6
                    }));
                throw err_6;
            }
        };
        $[16] = t15;
    } else {
        t15 = $[16];
    }
    const createPayrollApplication = t15;
    let t16;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = async (type)=>{
            setState(_temp14);
            ;
            try {
                const response_5 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/applications/draft", {
                    type
                });
                setState(_temp15);
                return {
                    id: response_5.data.data.id
                };
            } catch (t17) {
                const err_7 = t17;
                const errorMessage_7 = err_7.response?.data?.message || err_7.message || "Failed to create draft application";
                setState((prev_25)=>({
                        ...prev_25,
                        isLoading: false,
                        error: errorMessage_7
                    }));
                throw err_7;
            }
        };
        $[17] = t16;
    } else {
        t16 = $[17];
    }
    const createDraftApplication = t16;
    let t17;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = (application)=>{
            setState((prev_27)=>({
                    ...prev_27,
                    currentApplication: application
                }));
        };
        $[18] = t17;
    } else {
        t17 = $[18];
    }
    const setCurrentApplication = t17;
    let t18;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = async (id_3, data_1)=>{
            setState(_temp16);
            ;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/applications/${id_3}`, data_1);
                setState(_temp17);
            } catch (t19) {
                const err_8 = t19;
                const errorMessage_8 = err_8.response?.data?.message || err_8.message || "Failed to update SME application";
                setState((prev_29)=>({
                        ...prev_29,
                        isLoading: false,
                        error: errorMessage_8
                    }));
                throw err_8;
            }
        };
        $[19] = t18;
    } else {
        t18 = $[19];
    }
    const updateSMEApplication = t18;
    let t19;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = async (id_4, data_2)=>{
            setState(_temp18);
            ;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/applications/${id_4}`, data_2);
                setState(_temp19);
            } catch (t20) {
                const err_9 = t20;
                const errorMessage_9 = err_9.response?.data?.message || err_9.message || "Failed to update payroll application";
                setState((prev_32)=>({
                        ...prev_32,
                        isLoading: false,
                        error: errorMessage_9
                    }));
                throw err_9;
            }
        };
        $[20] = t19;
    } else {
        t19 = $[20];
    }
    const updatePayrollApplication = t19;
    let t20;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = async (applicationId, file, documentType)=>{
            setState(_temp20);
            ;
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("documentType", documentType);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/applications/${applicationId}/documents/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                setState(_temp21);
            } catch (t21) {
                const err_10 = t21;
                const errorMessage_10 = err_10.response?.data?.message || err_10.message || "Failed to upload document";
                setState((prev_35)=>({
                        ...prev_35,
                        isLoading: false,
                        error: errorMessage_10
                    }));
                throw err_10;
            }
        };
        $[21] = t20;
    } else {
        t20 = $[21];
    }
    const uploadDocument = t20;
    let t21;
    if ($[22] !== refreshApplications) {
        t21 = async (id_5)=>{
            setState(_temp22);
            ;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/applications/${id_5}/submit`);
                setState(_temp23);
                await refreshApplications();
            } catch (t22) {
                const err_11 = t22;
                const errorMessage_11 = err_11.response?.data?.message || err_11.message || "Failed to submit application";
                setState((prev_38)=>({
                        ...prev_38,
                        isLoading: false,
                        error: errorMessage_11
                    }));
                throw err_11;
            }
        };
        $[22] = refreshApplications;
        $[23] = t21;
    } else {
        t21 = $[23];
    }
    const submitApplication = t21;
    let t22;
    if ($[24] !== refreshApplications) {
        t22 = async (id_6)=>{
            setState(_temp24);
            ;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/applications/${id_6}`);
                setState(_temp25);
                await refreshApplications();
            } catch (t23) {
                const err_12 = t23;
                const errorMessage_12 = err_12.response?.data?.message || err_12.message || "Failed to delete application";
                setState((prev_41)=>({
                        ...prev_41,
                        isLoading: false,
                        error: errorMessage_12
                    }));
                throw err_12;
            }
        };
        $[24] = refreshApplications;
        $[25] = t22;
    } else {
        t22 = $[25];
    }
    const deleteApplication = t22;
    let t23;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t23 = ()=>{
            setState(_temp26);
        };
        $[26] = t23;
    } else {
        t23 = $[26];
    }
    const clearError = t23;
    let t24;
    if ($[27] !== deleteApplication || $[28] !== refreshApplications || $[29] !== state || $[30] !== submitApplication) {
        t24 = {
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
            fetchAdminApplications,
            fetchAdminApplicationById,
            updateAdminApplicationStatus,
            updateAdminApplicationData,
            clearAdminError
        };
        $[27] = deleteApplication;
        $[28] = refreshApplications;
        $[29] = state;
        $[30] = submitApplication;
        $[31] = t24;
    } else {
        t24 = $[31];
    }
    let t25;
    if ($[32] !== children || $[33] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ApplicationsContext.Provider, {
            value: t24,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/context/ApplicationsContext.tsx",
            lineNumber: 695,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[32] = children;
        $[33] = t24;
        $[34] = t25;
    } else {
        t25 = $[34];
    }
    return t25;
};
_s(ApplicationsProvider, "AdBzvZn6L3oPepPPw9wEJPGLrA4=");
_c = ApplicationsProvider;
function _temp(prev) {
    return {
        ...prev,
        isLoading: true,
        error: null
    };
}
function _temp2(prev_2) {
    return {
        ...prev_2,
        adminIsLoading: true,
        adminError: null
    };
}
function _temp3(prev_5) {
    return {
        ...prev_5,
        adminIsLoading: true,
        adminError: null
    };
}
function _temp4(prev_8) {
    return {
        ...prev_8,
        adminIsLoading: true,
        adminError: null
    };
}
function _temp5(prev_10) {
    return {
        ...prev_10,
        adminIsLoading: false
    };
}
function _temp6(prev_11) {
    return {
        ...prev_11,
        adminIsLoading: true,
        adminError: null
    };
}
function _temp7(prev_13) {
    return {
        ...prev_13,
        adminIsLoading: false
    };
}
function _temp8(prev_14) {
    return {
        ...prev_14,
        adminError: null
    };
}
function _temp9(prev_15) {
    return {
        ...prev_15,
        isLoading: true,
        error: null
    };
}
function _temp10(prev_18) {
    return {
        ...prev_18,
        isLoading: true,
        error: null
    };
}
function _temp11(prev_20) {
    return {
        ...prev_20,
        isLoading: false
    };
}
function _temp12(prev_21) {
    return {
        ...prev_21,
        isLoading: true,
        error: null
    };
}
function _temp13(prev_23) {
    return {
        ...prev_23,
        isLoading: false
    };
}
function _temp14(prev_24) {
    return {
        ...prev_24,
        isLoading: true,
        error: null
    };
}
function _temp15(prev_26) {
    return {
        ...prev_26,
        isLoading: false
    };
}
function _temp16(prev_28) {
    return {
        ...prev_28,
        isLoading: true,
        error: null
    };
}
function _temp17(prev_30) {
    return {
        ...prev_30,
        isLoading: false
    };
}
function _temp18(prev_31) {
    return {
        ...prev_31,
        isLoading: true,
        error: null
    };
}
function _temp19(prev_33) {
    return {
        ...prev_33,
        isLoading: false
    };
}
function _temp20(prev_34) {
    return {
        ...prev_34,
        isLoading: true,
        error: null
    };
}
function _temp21(prev_36) {
    return {
        ...prev_36,
        isLoading: false
    };
}
function _temp22(prev_37) {
    return {
        ...prev_37,
        isLoading: true,
        error: null
    };
}
function _temp23(prev_39) {
    return {
        ...prev_39,
        isLoading: false
    };
}
function _temp24(prev_40) {
    return {
        ...prev_40,
        isLoading: true,
        error: null
    };
}
function _temp25(prev_42) {
    return {
        ...prev_42,
        isLoading: false
    };
}
function _temp26(prev_43) {
    return {
        ...prev_43,
        error: null
    };
}
var _c;
__turbopack_context__.k.register(_c, "ApplicationsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.2_64d5eeabc3e5d7da937e2327328eb8d4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "c34de2246ee8db221190a347bd05e9448cf3755fa29c0668f6c01392f7108725") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c34de2246ee8db221190a347bd05e9448cf3755fa29c0668f6c01392f7108725";
    }
    const { children } = t0;
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("light");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "ThemeProvider[useEffect()]": ()=>{
                setMounted(true);
                const savedTheme = localStorage.getItem("theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (savedTheme) {
                    setTheme(savedTheme);
                } else {
                    if (prefersDark) {
                        setTheme("dark");
                    }
                }
            }
        })["ThemeProvider[useEffect()]"];
        t2 = [];
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    let t4;
    if ($[3] !== mounted || $[4] !== theme) {
        t3 = ({
            "ThemeProvider[useEffect()]": ()=>{
                if (!mounted) {
                    return;
                }
                const root = document.documentElement;
                if (theme === "dark") {
                    root.classList.add("dark");
                    localStorage.setItem("theme", "dark");
                } else {
                    root.classList.remove("dark");
                    localStorage.setItem("theme", "light");
                }
            }
        })["ThemeProvider[useEffect()]"];
        t4 = [
            theme,
            mounted
        ];
        $[3] = mounted;
        $[4] = theme;
        $[5] = t3;
        $[6] = t4;
    } else {
        t3 = $[5];
        t4 = $[6];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = ({
            "ThemeProvider[toggleTheme]": ()=>{
                setTheme(_ThemeProviderToggleThemeSetTheme);
            }
        })["ThemeProvider[toggleTheme]"];
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const toggleTheme = t5;
    let t6;
    if ($[8] !== theme) {
        t6 = {
            theme,
            toggleTheme
        };
        $[8] = theme;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    let t7;
    if ($[10] !== children || $[11] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
            value: t6,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/context/ThemeContext.tsx",
            lineNumber: 102,
            columnNumber: 10
        }, this);
        $[10] = children;
        $[11] = t6;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    return t7;
}
_s(ThemeProvider, "fqhTJOakwRKvaOykVeD8S7Yfj/s=");
_c = ThemeProvider;
function _ThemeProviderToggleThemeSetTheme(prev) {
    return prev === "light" ? "dark" : "light";
}
function useTheme() {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "c34de2246ee8db221190a347bd05e9448cf3755fa29c0668f6c01392f7108725") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c34de2246ee8db221190a347bd05e9448cf3755fa29c0668f6c01392f7108725";
    }
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$2_64d5eeabc3e5d7da937e2327328eb8d4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_9cc09929._.js.map