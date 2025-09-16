// Export the main machine
export { default as authMachine } from './authMachine';

// Export the React integration
export { AuthProvider, useAuthMachine, useAuth } from './AuthProvider';

// Export types
export type {
  AuthMachineContext,
  AuthMachineEvent,
  AuthMachineState,
  AuthActorInput,
  AuthActorOutput
} from './types';

// Export actors (for testing or advanced usage)
export {
  initializeAuthActor,
  loginServiceActor,
  loadUserProfileActor,
  logoutServiceActor,
  refreshTokenActor
} from './actors';

// Export actions (for testing or advanced usage)
export {
  checkStoredAuth,
  setAuthData,
  setUser,
  clearAuthData,
  setError,
  clearError,
  updateServer,
  setLoading,
  clearLoading,
  handleLogoutSuccess,
  handleTokenRefreshSuccess,
  handleProfileLoadFailure
} from './actions';
