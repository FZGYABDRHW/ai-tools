"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMachineContext = exports.useAuth = exports.useAuthMachine = exports.AuthProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@xstate/react");
const antd_1 = require("antd");
const authMachine_1 = __importDefault(require("./authMachine"));
const serviceInit_1 = require("../serviceInit");
const authServiceInit_1 = require("../authServiceInit");
const auth_1 = require("../api-client/src/services/v4/user/auth");
const logRocketService_1 = __importDefault(require("../services/logRocketService"));
const AuthMachineContext = (0, react_1.createContext)(null);
exports.AuthMachineContext = AuthMachineContext;
const AuthProvider = ({ children }) => {
    // Use the machine with useMachine hook
    const [state, send] = (0, react_2.useMachine)(authMachine_1.default);
    // Track previous state to detect real transitions
    const previousStateRef = (0, react_1.useRef)(null);
    // Debug state changes
    (0, react_1.useEffect)(() => {
        console.log('AuthProvider: State changed to:', state.value, 'Context:', {
            hasToken: !!state.context.authToken,
            userId: state.context.userId,
            hasUser: !!state.context.user,
            selectedServer: state.context.selectedServer,
            error: state.context.error
        });
        previousStateRef.current = typeof state.value === 'string' ? state.value : null;
    }, [state]);
    // Initialize authentication on mount
    (0, react_1.useEffect)(() => {
        console.log('AuthProvider: Initializing authentication machine');
        // Check localStorage for stored auth data
        const authToken = localStorage.getItem('authToken') || '';
        const userIdStr = localStorage.getItem('userId');
        const selectedServer = localStorage.getItem('selectedServer') || 'EU';
        const userStr = localStorage.getItem('user');
        const userId = userIdStr ? parseInt(userIdStr, 10) : null;
        const user = userStr ? JSON.parse(userStr) : null;
        console.log('AuthProvider: Restored from localStorage:', {
            hasToken: !!authToken,
            userId,
            selectedServer,
            hasUser: !!user
        });
        send({ type: 'INITIALIZE' });
        if (authToken && userId && user) {
            // If we have all the data, restore the complete session
            send({
                type: 'RESTORE_FROM_STORAGE',
                data: { authToken, userId, selectedServer, user }
            });
        }
        else if (authToken && userId) {
            // If we have token and userId but no user profile, we need to load it
            // This will be handled by the login flow
            send({
                type: 'RESTORE_FROM_STORAGE',
                data: { authToken, userId, selectedServer }
            });
        }
        else {
            // No stored session, exit initializing
            send({ type: 'NO_STORED_SESSION' });
        }
    }, [send]);
    // Handle error messages
    (0, react_1.useEffect)(() => {
        if (state.context.error) {
            console.log('AuthProvider: Showing error message:', state.context.error);
            antd_1.message.error(state.context.error);
        }
    }, [state.context.error]);
    // Handle success messages
    (0, react_1.useEffect)(() => {
        if (state.matches('authenticated') && state.context.user) {
            console.log('AuthProvider: User authenticated successfully');
            antd_1.message.success('Login successful!');
        }
    }, [state.matches('authenticated'), state.context.user]);
    // Handle logout success (only when transitioning from loggingOut -> idle)
    (0, react_1.useEffect)(() => {
        const prev = previousStateRef.current;
        if (prev === 'loggingOut' && state.matches('idle') && !state.context.authToken && !state.context.user) {
            console.log('AuthProvider: User logged out successfully');
            antd_1.message.success('Logout successful!');
        }
    }, [state.matches('idle'), state.context.authToken, state.context.user]);
    // Handle loading profile during session restoration
    (0, react_1.useEffect)(() => {
        if (state.matches('loadingProfile') && state.context.authToken && state.context.userId && !state.context.user) {
            console.log('AuthProvider: Loading user profile during session restoration');
            const loadUserProfile = async () => {
                try {
                    const { buildAuthServiceInitializer } = await Promise.resolve().then(() => __importStar(require('../authServiceInit')));
                    const { AuthService } = await Promise.resolve().then(() => __importStar(require('../api-client/src/services/v4/user/auth')));
                    const authSi = buildAuthServiceInitializer(state.context.selectedServer);
                    const authService = authSi(AuthService);
                    const userProfile = await authService.getUserProfile(state.context.userId);
                    send({
                        type: 'PROFILE_LOADED',
                        user: userProfile
                    });
                }
                catch (error) {
                    console.error('AuthProvider: Failed to load user profile during restoration:', error);
                    send({
                        type: 'PROFILE_LOAD_FAILED',
                        error: 'Failed to load user profile'
                    });
                }
            };
            loadUserProfile();
        }
    }, [state.matches('loadingProfile'), state.context.authToken, state.context.userId, state.context.user, send, state.context.selectedServer]);
    const contextValue = {
        state,
        send
    };
    return ((0, jsx_runtime_1.jsx)(AuthMachineContext.Provider, { value: contextValue, children: children }));
};
exports.AuthProvider = AuthProvider;
// Hook to use the auth machine
const useAuthMachine = () => {
    const context = (0, react_1.useContext)(AuthMachineContext);
    if (!context) {
        throw new Error('useAuthMachine must be used within an AuthProvider');
    }
    return context;
};
exports.useAuthMachine = useAuthMachine;
// Convenience hook that provides a clean API similar to the old AuthContext
const useAuth = () => {
    const { state, send } = (0, exports.useAuthMachine)();
    // Extract state values
    const authToken = state.context.authToken;
    const userId = state.context.userId;
    const user = state.context.user;
    const selectedServer = state.context.selectedServer;
    const isLoading = state.context.isLoading;
    const isInitializing = state.matches('initializing');
    const error = state.context.error;
    // Create action functions
    const login = async (credentials) => {
        console.log('useAuth: Starting login process');
        send({ type: 'LOGIN', credentials });
        try {
            // Use the server from credentials if provided, otherwise use the current selectedServer
            const serverRegion = credentials.server || selectedServer;
            const authSi = (0, authServiceInit_1.buildAuthServiceInitializer)(serverRegion);
            const authService = authSi(auth_1.AuthService);
            const response = await authService.login(credentials);
            console.log('useAuth: Login response received:', response);
            // Check if response has the expected structure
            if (response && response.token) {
                // Track login event in LogRocket
                logRocketService_1.default.getInstance().trackEvent('user_login', {
                    userId: response.id,
                    timestamp: new Date().toISOString()
                });
                console.log('useAuth: Login successful');
                send({ type: 'AUTH_SUCCESS', token: response.token, userId: response.id });
                // Load user profile
                try {
                    const si = (0, serviceInit_1.buildServiceInitializer)(response.token, serverRegion);
                    const authService = si(auth_1.AuthService);
                    const profileResponse = await authService.getUserProfile(response.id);
                    if (profileResponse && profileResponse.id) {
                        // Construct full name from firstName, secondName, and thirdName
                        const fullName = [
                            profileResponse.firstName,
                            profileResponse.secondName,
                            profileResponse.thirdName
                        ].filter(Boolean).join(' ').trim() || 'Unknown User';
                        const userData = {
                            id: profileResponse.id,
                            phone: profileResponse.phone || '',
                            name: fullName
                        };
                        // Identify user in LogRocket
                        logRocketService_1.default.getInstance().identifyUser(profileResponse.id, {
                            name: fullName,
                            phone: profileResponse.phone || '',
                            email: profileResponse.email || ''
                        });
                        send({ type: 'PROFILE_LOADED', user: userData });
                        return true;
                    }
                    else {
                        send({ type: 'PROFILE_LOAD_FAILED', error: 'Failed to load user profile' });
                        return false;
                    }
                }
                catch (profileError) {
                    console.error('useAuth: Profile load error:', profileError);
                    const error = profileError;
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        send({ type: 'PROFILE_LOAD_FAILED', error: 'Authentication failed - please login again' });
                    }
                    else {
                        send({ type: 'PROFILE_LOAD_FAILED', error: 'Network error - please check your connection' });
                    }
                    return false;
                }
            }
            else {
                console.log('useAuth: Unexpected response structure:', response);
                send({ type: 'AUTH_FAILURE', error: 'Login failed - unexpected response structure' });
                return false;
            }
        }
        catch (error) {
            console.error('useAuth: Login error:', error);
            const err = error;
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            send({ type: 'AUTH_FAILURE', error: errorMessage });
            return false;
        }
    };
    const logout = async () => {
        console.log('useAuth: Starting logout process');
        send({ type: 'LOGOUT' });
        try {
            if (authToken) {
                const si = (0, serviceInit_1.buildServiceInitializer)(authToken, selectedServer);
                const authService = si(auth_1.AuthService);
                await authService.logout();
                // Track logout event in LogRocket before clearing user data
                if (userId) {
                    logRocketService_1.default.getInstance().trackEvent('user_logout', {
                        userId: userId,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            send({ type: 'LOGOUT_SUCCESS' });
            return true;
        }
        catch (error) {
            console.error('useAuth: Logout error:', error);
            // Even if logout fails, clear local state
            send({ type: 'LOGOUT_FAILURE' });
            return true;
        }
    };
    const setSelectedServer = (server) => {
        console.log('useAuth: Changing server to:', server);
        send({ type: 'SERVER_CHANGED', server });
    };
    const refreshToken = async () => {
        console.log('useAuth: Starting token refresh');
        send({ type: 'REFRESH_TOKEN' });
        // For now, just return the same token as a placeholder
        // In a real implementation, you would call the actual refresh endpoint
        send({ type: 'TOKEN_REFRESHED', token: authToken });
        return true;
    };
    const clearError = () => {
        console.log('useAuth: Clearing error state');
        send({ type: 'CLEAR_ERROR' });
    };
    // Computed values
    const isAuthenticated = state.matches('authenticated');
    const isAuthenticating = state.matches('authenticating');
    const isLoggingOut = state.matches('loggingOut');
    const isRefreshingToken = state.matches('refreshingToken');
    const isInErrorState = state.matches('error');
    return {
        // State values
        authToken,
        userId,
        user,
        selectedServer,
        isLoading,
        isInitializing,
        error,
        // Computed state
        isAuthenticated,
        isAuthenticating,
        isLoggingOut,
        isRefreshingToken,
        isInErrorState,
        // Actions
        login,
        logout,
        setSelectedServer,
        refreshToken,
        clearError,
        // Direct access to machine for advanced usage
        state,
        send
    };
};
exports.useAuth = useAuth;
//# sourceMappingURL=AuthProvider.js.map