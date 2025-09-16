import { createMachine } from 'xstate';
import { createInitialAuthContext } from './types';
import {
  checkStoredAuth,
  setAuthData,
  setUser,
  clearAuthData,
  setError,
  clearError,
  clearLoading,
  setLoading,
  updateServer,
  handleTokenRefreshSuccess,
  handleProfileLoadFailure
} from './actions';

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
export const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: createInitialAuthContext(),

  states: {
    // Initial state - waiting for initialization
    idle: {
      on: {
        INITIALIZE: 'initializing',
        LOGIN: { target: 'authenticating', actions: [setLoading] },
        SERVER_CHANGED: { target: 'idle', actions: [updateServer] }
      }
    },

    // Initializing authentication state from localStorage
    initializing: {
      on: {
        RESTORE_FROM_STORAGE: [
          {
            target: 'authenticated',
            guard: ({ event }) => (
              event.type === 'RESTORE_FROM_STORAGE' &&
              'data' in event &&
              Boolean(event.data?.authToken && event.data?.userId && event.data?.user)
            ),
            actions: [checkStoredAuth]
          },
          {
            target: 'loadingProfile',
            actions: [checkStoredAuth]
          }
        ],
        NO_STORED_SESSION: 'idle'
      }
    },

    // Authenticating user with credentials
    authenticating: {
      on: {
        AUTH_SUCCESS: { target: 'loadingProfile', actions: [setAuthData, clearError] },
        AUTH_FAILURE: { target: 'error', actions: [setError, clearLoading] },
        LOGOUT: { target: 'loggingOut', actions: [setLoading] }
      }
    },

    // Loading user profile after successful authentication
    loadingProfile: {
      on: {
        PROFILE_LOADED: { target: 'authenticated', actions: [setUser, clearLoading] },
        PROFILE_LOAD_FAILED: { target: 'error', actions: [handleProfileLoadFailure, setError, clearLoading] },
        LOGOUT: { target: 'loggingOut', actions: [setLoading] }
      }
    },

    // Authenticated state - user is logged in and profile is loaded
    authenticated: {
      on: {
        LOGOUT: { target: 'loggingOut', actions: [setLoading] },
        REFRESH_TOKEN: 'refreshingToken',
        SERVER_CHANGED: { target: 'authenticated', actions: [updateServer] },
        CLEAR_ERROR: { target: 'authenticated', actions: [clearError] }
      }
    },

    // Logging out user
    loggingOut: {
      on: {
        LOGOUT_SUCCESS: { target: 'idle', actions: [clearAuthData, clearLoading] },
        LOGOUT_FAILURE: { target: 'idle', actions: [clearLoading] }
      }
    },

    // Refreshing authentication token
    refreshingToken: {
      on: {
        TOKEN_REFRESHED: { target: 'authenticated', actions: [handleTokenRefreshSuccess, clearLoading] },
        TOKEN_REFRESH_FAILED: { target: 'idle', actions: [setError, clearLoading] }
      }
    },

    // Error state - something went wrong
    error: {
      on: {
        LOGIN: { target: 'authenticating', actions: [setLoading] },
        LOGOUT: { target: 'loggingOut', actions: [setLoading] },
        CLEAR_ERROR: { target: 'idle', actions: [clearError] },
        SERVER_CHANGED: { target: 'error', actions: [updateServer] }
      }
    }
  }
});

// Export the machine for use in React components
export default authMachine;
