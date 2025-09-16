import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { message } from 'antd';
import authMachine from './authMachine';
import { LoginCredentials, ServerRegion } from '../types';
import { buildServiceInitializer } from '../serviceInit';
import { buildAuthServiceInitializer } from '../authServiceInit';
import { AuthService } from '../api-client/src/services/v4/user/auth';
import LogRocketService from '../services/logRocketService';

// Create the context for the auth machine
interface AuthMachineContextType {
  state: {
    context: {
      authToken: string;
      userId: number | null;
      user: { id: number; phone: string; name: string } | null;
      selectedServer: ServerRegion;
      isLoading: boolean;
      error: string | null;
      loginCredentials: LoginCredentials | null;
    };
    matches: (state: string) => boolean;
  };
  send: (event: { type: string; [key: string]: unknown }) => void;
}

const AuthMachineContext = createContext<AuthMachineContextType | null>(null);

// Provider component that wraps the app with the auth machine
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use the machine with useMachine hook
  const [state, send] = useMachine(authMachine);

  // Track previous state to detect real transitions
  const previousStateRef = useRef<string | null>(null);

  // Debug state changes
  useEffect(() => {
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
  useEffect(() => {
    console.log('AuthProvider: Initializing authentication machine');

    // Check localStorage for stored auth data
    const authToken = localStorage.getItem('authToken') || '';
    const userIdStr = localStorage.getItem('userId');
    const selectedServer = (localStorage.getItem('selectedServer') as 'EU' | 'RU') || 'EU';
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
    } else if (authToken && userId) {
      // If we have token and userId but no user profile, we need to load it
      // This will be handled by the login flow
      send({
        type: 'RESTORE_FROM_STORAGE',
        data: { authToken, userId, selectedServer }
      });
    } else {
      // No stored session, exit initializing
      send({ type: 'NO_STORED_SESSION' });
    }
  }, [send]);

  // Handle error messages
  useEffect(() => {
    if (state.context.error) {
      console.log('AuthProvider: Showing error message:', state.context.error);
      message.error(state.context.error);
    }
  }, [state.context.error]);

  // Handle success messages
  useEffect(() => {
    if (state.matches('authenticated') && state.context.user) {
      console.log('AuthProvider: User authenticated successfully');
      message.success('Login successful!');
    }
  }, [state.matches('authenticated'), state.context.user]);

  // Handle logout success (only when transitioning from loggingOut -> idle)
  useEffect(() => {
    const prev = previousStateRef.current;
    if (prev === 'loggingOut' && state.matches('idle') && !state.context.authToken && !state.context.user) {
      console.log('AuthProvider: User logged out successfully');
      message.success('Logout successful!');
    }
  }, [state.matches('idle'), state.context.authToken, state.context.user]);

  // Handle loading profile during session restoration
  useEffect(() => {
    if (state.matches('loadingProfile') && state.context.authToken && state.context.userId && !state.context.user) {
      console.log('AuthProvider: Loading user profile during session restoration');

      const loadUserProfile = async () => {
        try {
          const { buildAuthServiceInitializer } = await import('../authServiceInit');
          const { AuthService } = await import('../api-client/src/services/v4/user/auth');

          const authSi = buildAuthServiceInitializer(state.context.selectedServer);
          const authService = authSi(AuthService);

          const userProfile = await authService.getUserProfile(state.context.userId);

          send({
            type: 'PROFILE_LOADED',
            user: userProfile
          });
        } catch (error) {
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

  const contextValue: AuthMachineContextType = {
    state,
    send
  };

  return (
    <AuthMachineContext.Provider value={contextValue}>
      {children}
    </AuthMachineContext.Provider>
  );
};

// Hook to use the auth machine
export const useAuthMachine = () => {
  const context = useContext(AuthMachineContext);
  if (!context) {
    throw new Error('useAuthMachine must be used within an AuthProvider');
  }
  return context;
};

// Convenience hook that provides a clean API similar to the old AuthContext
export const useAuth = () => {
  const { state, send } = useAuthMachine();

  // Extract state values
  const authToken = state.context.authToken;
  const userId = state.context.userId;
  const user = state.context.user;
  const selectedServer = state.context.selectedServer;
  const isLoading = state.context.isLoading;
  const isInitializing = state.matches('initializing');
  const error = state.context.error;

  // Create action functions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    console.log('useAuth: Starting login process');
    send({ type: 'LOGIN', credentials });

    try {
      // Use the server from credentials if provided, otherwise use the current selectedServer
      const serverRegion = credentials.server || selectedServer;

      const authSi = buildAuthServiceInitializer(serverRegion);
      const authService = authSi(AuthService);
      const response = await authService.login(credentials);

      console.log('useAuth: Login response received:', response);

      // Check if response has the expected structure
      if (response && response.token) {
        // Track login event in LogRocket
        LogRocketService.getInstance().trackEvent('user_login', {
          userId: response.id,
          timestamp: new Date().toISOString()
        });

        console.log('useAuth: Login successful');
        send({ type: 'AUTH_SUCCESS', token: response.token, userId: response.id });

        // Load user profile
        try {
          const si = buildServiceInitializer(response.token, serverRegion);
          const authService = si(AuthService);
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
            LogRocketService.getInstance().identifyUser(profileResponse.id, {
              name: fullName,
              phone: profileResponse.phone || '',
              email: profileResponse.email || ''
            });

            send({ type: 'PROFILE_LOADED', user: userData });
            return true;
          } else {
            send({ type: 'PROFILE_LOAD_FAILED', error: 'Failed to load user profile' });
            return false;
          }
        } catch (profileError: unknown) {
          console.error('useAuth: Profile load error:', profileError);
          const error = profileError as { response?: { status?: number } };
          if (error.response?.status === 401 || error.response?.status === 403) {
            send({ type: 'PROFILE_LOAD_FAILED', error: 'Authentication failed - please login again' });
          } else {
            send({ type: 'PROFILE_LOAD_FAILED', error: 'Network error - please check your connection' });
          }
          return false;
        }
      } else {
        console.log('useAuth: Unexpected response structure:', response);
        send({ type: 'AUTH_FAILURE', error: 'Login failed - unexpected response structure' });
        return false;
      }
    } catch (error: unknown) {
      console.error('useAuth: Login error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      send({ type: 'AUTH_FAILURE', error: errorMessage });
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    console.log('useAuth: Starting logout process');
    send({ type: 'LOGOUT' });

    try {
      if (authToken) {
        const si = buildServiceInitializer(authToken, selectedServer);
        const authService = si(AuthService);
        await authService.logout();

        // Track logout event in LogRocket before clearing user data
        if (userId) {
          LogRocketService.getInstance().trackEvent('user_logout', {
            userId: userId,
            timestamp: new Date().toISOString()
          });
        }
      }

      send({ type: 'LOGOUT_SUCCESS' });
      return true;
    } catch (error: unknown) {
      console.error('useAuth: Logout error:', error);
      // Even if logout fails, clear local state
      send({ type: 'LOGOUT_FAILURE' });
      return true;
    }
  };

  const setSelectedServer = (server: ServerRegion) => {
    console.log('useAuth: Changing server to:', server);
    send({ type: 'SERVER_CHANGED', server });
  };

  const refreshToken = async (): Promise<boolean> => {
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

// Export the context for advanced usage
export { AuthMachineContext };
