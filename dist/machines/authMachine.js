"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMachine = void 0;
const xstate_1 = require("xstate");
const types_1 = require("./types");
const actions_1 = require("./actions");
/**
 * Authentication State Machine
 *
 * This machine manages the complete authentication flow including:
 * - Initial state restoration from localStorage
 * - Login/logout operations
 * - User profile loading
 * - Token refresh
 * - Server region changes
 * - Error handling
 */
exports.authMachine = (0, xstate_1.createMachine)({
    id: 'auth',
    initial: 'idle',
    context: (0, types_1.createInitialAuthContext)(),
    states: {
        // Initial state - waiting for initialization
        idle: {
            on: {
                INITIALIZE: 'initializing',
                LOGIN: { target: 'authenticating', actions: [actions_1.setLoading] },
                SERVER_CHANGED: { target: 'idle', actions: [actions_1.updateServer] }
            }
        },
        // Initializing authentication state from localStorage
        initializing: {
            on: {
                RESTORE_FROM_STORAGE: [
                    {
                        target: 'authenticated',
                        guard: ({ event }) => (event.type === 'RESTORE_FROM_STORAGE' &&
                            'data' in event &&
                            Boolean(event.data?.authToken && event.data?.userId && event.data?.user)),
                        actions: [actions_1.checkStoredAuth]
                    },
                    {
                        target: 'loadingProfile',
                        actions: [actions_1.checkStoredAuth]
                    }
                ],
                NO_STORED_SESSION: 'idle'
            }
        },
        // Authenticating user with credentials
        authenticating: {
            on: {
                AUTH_SUCCESS: { target: 'loadingProfile', actions: [actions_1.setAuthData, actions_1.clearError] },
                AUTH_FAILURE: { target: 'error', actions: [actions_1.setError, actions_1.clearLoading] },
                LOGOUT: { target: 'loggingOut', actions: [actions_1.setLoading] }
            }
        },
        // Loading user profile after successful authentication
        loadingProfile: {
            on: {
                PROFILE_LOADED: { target: 'authenticated', actions: [actions_1.setUser, actions_1.clearLoading] },
                PROFILE_LOAD_FAILED: { target: 'error', actions: [actions_1.handleProfileLoadFailure, actions_1.setError, actions_1.clearLoading] },
                LOGOUT: { target: 'loggingOut', actions: [actions_1.setLoading] }
            }
        },
        // Authenticated state - user is logged in and profile is loaded
        authenticated: {
            on: {
                LOGOUT: { target: 'loggingOut', actions: [actions_1.setLoading] },
                REFRESH_TOKEN: 'refreshingToken',
                SERVER_CHANGED: { target: 'authenticated', actions: [actions_1.updateServer] },
                CLEAR_ERROR: { target: 'authenticated', actions: [actions_1.clearError] }
            }
        },
        // Logging out user
        loggingOut: {
            on: {
                LOGOUT_SUCCESS: { target: 'idle', actions: [actions_1.clearAuthData, actions_1.clearLoading] },
                LOGOUT_FAILURE: { target: 'idle', actions: [actions_1.clearLoading] }
            }
        },
        // Refreshing authentication token
        refreshingToken: {
            on: {
                TOKEN_REFRESHED: { target: 'authenticated', actions: [actions_1.handleTokenRefreshSuccess, actions_1.clearLoading] },
                TOKEN_REFRESH_FAILED: { target: 'idle', actions: [actions_1.setError, actions_1.clearLoading] }
            }
        },
        // Error state - something went wrong
        error: {
            on: {
                LOGIN: { target: 'authenticating', actions: [actions_1.setLoading] },
                LOGOUT: { target: 'loggingOut', actions: [actions_1.setLoading] },
                CLEAR_ERROR: { target: 'idle', actions: [actions_1.clearError] },
                SERVER_CHANGED: { target: 'error', actions: [actions_1.updateServer] }
            }
        }
    }
});
// Export the machine for use in React components
exports.default = exports.authMachine;
//# sourceMappingURL=authMachine.js.map