import { assign } from 'xstate';
import { AuthMachineContext, AuthMachineEvent } from './types';
import LogRocketService from '../services/logRocketService';

/**
 * Action to check and restore authentication data from localStorage
 */
export const checkStoredAuth = assign({
  authToken: ({ context, event }) => {
    if (event.type === 'RESTORE_FROM_STORAGE' && 'data' in event && event.data?.authToken) {
      console.log('AuthAction: Restoring authToken from storage');
      return event.data.authToken;
    }
    return context.authToken;
  },
  userId: ({ context, event }) => {
    if (event.type === 'RESTORE_FROM_STORAGE' && 'data' in event && event.data?.userId) {
      console.log('AuthAction: Restoring userId from storage');
      return event.data.userId;
    }
    return context.userId;
  },
  selectedServer: ({ context, event }) => {
    if (event.type === 'RESTORE_FROM_STORAGE' && 'data' in event && event.data?.selectedServer) {
      console.log('AuthAction: Restoring selectedServer from storage');
      return event.data.selectedServer;
    }
    return context.selectedServer;
  },
  user: ({ context, event }) => {
    if (event.type === 'RESTORE_FROM_STORAGE' && 'data' in event && event.data?.user) {
      console.log('AuthAction: Restoring user from storage');
      return event.data.user;
    }
    return context.user;
  }
});

/**
 * Action to set authentication data and persist to localStorage
 */
export const setAuthData = assign({
  authToken: ({ context, event }) => {
    if (event.type === 'AUTH_SUCCESS' && 'token' in event) {
      console.log('AuthAction: Setting authToken and persisting to localStorage');
      localStorage.setItem('authToken', event.token);
      return event.token;
    }
    return context.authToken;
  },
  userId: ({ context, event }) => {
    if (event.type === 'AUTH_SUCCESS' && 'userId' in event) {
      console.log('AuthAction: Setting userId and persisting to localStorage');
      localStorage.setItem('userId', event.userId.toString());
      return event.userId;
    }
    return context.userId;
  },
  loginCredentials: ({ context, event }) => {
    if (event.type === 'LOGIN' && 'credentials' in event) {
      console.log('AuthAction: Storing login credentials');
      return event.credentials;
    }
    return context.loginCredentials;
  }
});

/**
 * Action to set user profile data
 */
export const setUser = assign({
  user: ({ context, event }) => {
    if (event.type === 'PROFILE_LOADED' && 'user' in event) {
      console.log('AuthAction: Setting user profile data');
      // Store user data in localStorage for session restoration
      localStorage.setItem('user', JSON.stringify(event.user));
      return event.user;
    }
    return context.user;
  }
});

/**
 * Action to clear all authentication data and remove from localStorage
 */
export const clearAuthData = assign({
  authToken: () => {
    console.log('AuthAction: Clearing authToken from localStorage');
    localStorage.removeItem('authToken');
    return '';
  },
  userId: () => {
    console.log('AuthAction: Clearing userId from localStorage');
    localStorage.removeItem('userId');
    return null;
  },
  user: () => {
    console.log('AuthAction: Clearing user data from localStorage');
    localStorage.removeItem('user');
    return null;
  },
  loginCredentials: () => {
    console.log('AuthAction: Clearing login credentials');
    return null;
  },
  error: () => {
    console.log('AuthAction: Clearing error state');
    return null;
  }
});

/**
 * Action to set error state
 */
export const setError = assign({
  error: ({ context, event }) => {
    if (event.type === 'AUTH_FAILURE' ||
        event.type === 'PROFILE_LOAD_FAILED' ||
        event.type === 'LOGOUT_FAILURE' ||
        event.type === 'TOKEN_REFRESH_FAILED') {
      console.log('AuthAction: Setting error state:', 'error' in event ? event.error : 'Unknown error');
      return 'error' in event ? event.error : 'Unknown error';
    }
    return context.error;
  }
});

/**
 * Action to clear error state
 */
export const clearError = assign({
  error: () => {
    console.log('AuthAction: Clearing error state');
    return null;
  }
});

/**
 * Action to update selected server and persist to localStorage
 */
export const updateServer = assign({
  selectedServer: ({ context, event }) => {
    if (event.type === 'SERVER_CHANGED' && 'server' in event) {
      console.log('AuthAction: Updating selectedServer and persisting to localStorage');
      localStorage.setItem('selectedServer', event.server);
      return event.server;
    }
    return context.selectedServer;
  }
});

/**
 * Action to set loading state
 */
export const setLoading = assign({
  isLoading: ({ context, event }) => {
    // Set loading to true for operations that require loading state
    if (event.type === 'LOGIN' ||
        event.type === 'LOGOUT' ||
        event.type === 'REFRESH_TOKEN') {
      console.log('AuthAction: Setting loading state to true');
      return true;
    }
    return context.isLoading;
  }
});

/**
 * Action to clear loading state
 */
export const clearLoading = assign({
  isLoading: () => {
    console.log('AuthAction: Setting loading state to false');
    return false;
  }
});

/**
 * Action to handle successful logout with LogRocket tracking
 */
export const handleLogoutSuccess = assign({
  authToken: () => {
    console.log('AuthAction: Logout successful, clearing authToken');
    localStorage.removeItem('authToken');
    return '';
  },
  userId: ({ context }) => {
    // Track logout event in LogRocket before clearing user data
    if (context.userId) {
      LogRocketService.getInstance().trackEvent('user_logout', {
        userId: context.userId,
        timestamp: new Date().toISOString()
      });
    }
    console.log('AuthAction: Logout successful, clearing userId');
    localStorage.removeItem('userId');
    return null;
  },
  user: () => {
    console.log('AuthAction: Logout successful, clearing user data');
    return null;
  },
  loginCredentials: () => {
    console.log('AuthAction: Logout successful, clearing login credentials');
    return null;
  },
  error: () => {
    console.log('AuthAction: Logout successful, clearing error state');
    return null;
  }
});

/**
 * Action to handle token refresh success
 */
export const handleTokenRefreshSuccess = assign({
  authToken: ({ context, event }) => {
    if (event.type === 'TOKEN_REFRESHED' && 'token' in event) {
      console.log('AuthAction: Token refresh successful, updating authToken');
      localStorage.setItem('authToken', event.token);
      return event.token;
    }
    return context.authToken;
  }
});

/**
 * Action to handle profile load failure with auth cleanup
 */
export const handleProfileLoadFailure = assign({
  authToken: ({ context, event }) => {
    if (event.type === 'PROFILE_LOAD_FAILED' && 'error' in event) {
      // If profile load failed due to auth error, clear everything
      if (event.error.includes('Authentication failed')) {
        console.log('AuthAction: Profile load failed due to auth error, clearing auth data');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        return '';
      }
    }
    return context.authToken;
  },
  userId: ({ context, event }) => {
    if (event.type === 'PROFILE_LOAD_FAILED' && 'error' in event) {
      // If profile load failed due to auth error, clear everything
      if (event.error.includes('Authentication failed')) {
        console.log('AuthAction: Profile load failed due to auth error, clearing userId');
        return null;
      }
    }
    return context.userId;
  },
  user: ({ context, event }) => {
    if (event.type === 'PROFILE_LOAD_FAILED' && 'error' in event) {
      // If profile load failed due to auth error, clear everything
      if (event.error.includes('Authentication failed')) {
        console.log('AuthAction: Profile load failed due to auth error, clearing user data');
        return null;
      }
    }
    return context.user;
  }
});
