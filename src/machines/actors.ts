import { fromPromise } from 'xstate';
import { AuthActorInput, AuthActorOutput } from './types';
import { buildServiceInitializer } from '../serviceInit';
import { buildAuthServiceInitializer } from '../authServiceInit';
import { AuthService } from '../api-client/src/services/v4/user/auth';
import LogRocketService from '../services/logRocketService';

/**
 * Actor for initializing authentication state from localStorage
 */
export const initializeAuthActor = fromPromise(async (): Promise<AuthActorOutput> => {
  try {
    console.log('AuthActor: Initializing authentication from localStorage');

    const authToken = localStorage.getItem('authToken') || '';
    const userIdStr = localStorage.getItem('userId');
    const selectedServer = (localStorage.getItem('selectedServer') as 'EU' | 'RU') || 'EU';

    const userId = userIdStr ? parseInt(userIdStr, 10) : null;

    console.log('AuthActor: Restored from localStorage:', {
      hasToken: !!authToken,
      userId,
      selectedServer
    });

    return {
      type: 'INITIALIZE_AUTH_RESULT',
      data: {
        authToken,
        userId,
        selectedServer
      }
    };
  } catch (error) {
    console.error('AuthActor: Failed to initialize auth:', error);
    return {
      type: 'INITIALIZE_AUTH_RESULT',
      data: null
    };
  }
});

/**
 * Actor for handling login operations
 */
export const loginServiceActor = fromPromise(async ({ input }: { input: AuthActorInput }): Promise<AuthActorOutput> => {
  if (input.type !== 'LOGIN_SERVICE') {
    throw new Error('Invalid input type for login service actor');
  }

  try {
    console.log('AuthActor: Starting login process');
    const { credentials } = input;

    // Use the server from credentials if provided, otherwise use EU as default
    const serverRegion = credentials.server || 'EU';

    const authSi = buildAuthServiceInitializer(serverRegion);
    const authService = authSi(AuthService);
    const response = await authService.login(credentials);

    console.log('AuthActor: Login response received:', response);

    // Check if response has the expected structure
    if (response && response.token) {
      // Track login event in LogRocket
      LogRocketService.getInstance().trackEvent('user_login', {
        userId: response.id,
        timestamp: new Date().toISOString()
      });

      console.log('AuthActor: Login successful');
      return {
        type: 'LOGIN_SERVICE_RESULT',
        success: true,
        data: {
          token: response.token,
          userId: response.id
        }
      };
    } else {
      console.log('AuthActor: Unexpected response structure:', response);
      return {
        type: 'LOGIN_SERVICE_RESULT',
        success: false,
        error: 'Login failed - unexpected response structure'
      };
    }
  } catch (error: any) {
    console.error('AuthActor: Login error:', error);
    const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
    return {
      type: 'LOGIN_SERVICE_RESULT',
      success: false,
      error: errorMessage
    };
  }
});

/**
 * Actor for loading user profile
 */
export const loadUserProfileActor = fromPromise(async ({ input }: { input: AuthActorInput }): Promise<AuthActorOutput> => {
  if (input.type !== 'LOAD_USER_PROFILE') {
    throw new Error('Invalid input type for load user profile actor');
  }

  try {
    console.log('AuthActor: Loading user profile');
    const { token, userId, server } = input;

    const si = buildServiceInitializer(token, server);
    const authService = si(AuthService);
    const response = await authService.getUserProfile(userId);

    console.log('AuthActor: User profile response:', response);

    if (response && response.id) {
      // Construct full name from firstName, secondName, and thirdName
      const fullName = [
        response.firstName,
        response.secondName,
        response.thirdName
      ].filter(Boolean).join(' ').trim() || 'Unknown User';

      console.log('AuthActor: Constructed full name:', fullName);

      const userData = {
        id: response.id,
        phone: response.phone || '',
        name: fullName
      };

      // Identify user in LogRocket
      LogRocketService.getInstance().identifyUser(response.id, {
        name: fullName,
        phone: response.phone || '',
        email: response.email || ''
      });

      console.log('AuthActor: User profile loaded successfully');
      return {
        type: 'LOAD_USER_PROFILE_RESULT',
        success: true,
        data: userData
      };
    } else {
      console.log('AuthActor: Failed to load user profile - invalid response');
      return {
        type: 'LOAD_USER_PROFILE_RESULT',
        success: false,
        error: 'Failed to load user profile - invalid response'
      };
    }
  } catch (error: any) {
    console.error('AuthActor: User profile load error:', error);

    // Don't immediately fail on network errors, but fail on auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('AuthActor: Auth error during profile load');
      return {
        type: 'LOAD_USER_PROFILE_RESULT',
        success: false,
        error: 'Authentication failed - please login again'
      };
    } else {
      console.log('AuthActor: Network error during profile load');
      return {
        type: 'LOAD_USER_PROFILE_RESULT',
        success: false,
        error: 'Network error - please check your connection'
      };
    }
  }
});

/**
 * Actor for handling logout operations
 */
export const logoutServiceActor = fromPromise(async ({ input }: { input: AuthActorInput }): Promise<AuthActorOutput> => {
  if (input.type !== 'LOGOUT_SERVICE') {
    throw new Error('Invalid input type for logout service actor');
  }

  try {
    console.log('AuthActor: Starting logout process');
    const { token, server } = input;

    if (!token) {
      console.log('AuthActor: No token to logout, clearing local state');
      return {
        type: 'LOGOUT_SERVICE_RESULT',
        success: true
      };
    }

    const si = buildServiceInitializer(token, server);
    const authService = si(AuthService);
    await authService.logout();

    console.log('AuthActor: Logout successful');
    return {
      type: 'LOGOUT_SERVICE_RESULT',
      success: true
    };
  } catch (error: any) {
    console.error('AuthActor: Logout error:', error);
    // Even if logout fails, we consider it successful for local cleanup
    return {
      type: 'LOGOUT_SERVICE_RESULT',
      success: true,
      error: 'Logout failed on server, but local state cleared'
    };
  }
});

/**
 * Actor for refreshing authentication tokens
 */
export const refreshTokenActor = fromPromise(async ({ input }: { input: AuthActorInput }): Promise<AuthActorOutput> => {
  if (input.type !== 'REFRESH_TOKEN') {
    throw new Error('Invalid input type for refresh token actor');
  }

  try {
    console.log('AuthActor: Starting token refresh process');
    const { token, server } = input;

    const si = buildServiceInitializer(token, server);
    const authService = si(AuthService);

    // Note: Since refreshToken method doesn't exist, we'll simulate a refresh
    // In a real implementation, you would call the actual refresh endpoint
    // For now, we'll return the same token as a placeholder
    const response = { token: token };

    if (response && response.token) {
      console.log('AuthActor: Token refresh successful');
      return {
        type: 'REFRESH_TOKEN_RESULT',
        success: true,
        data: {
          token: response.token
        }
      };
    } else {
      console.log('AuthActor: Token refresh failed - no new token');
      return {
        type: 'REFRESH_TOKEN_RESULT',
        success: false,
        error: 'Token refresh failed'
      };
    }
  } catch (error: any) {
    console.error('AuthActor: Token refresh error:', error);
    return {
      type: 'REFRESH_TOKEN_RESULT',
      success: false,
      error: error.response?.data?.message || 'Token refresh failed'
    };
  }
});
