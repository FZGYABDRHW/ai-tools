import { User, ServerRegion, LoginCredentials } from '../types';

// Machine Context - represents the data that the state machine holds
export interface AuthMachineContext {
  // Authentication data
  authToken: string;
  userId: number | null;
  user: User | null;

  // Server configuration
  selectedServer: ServerRegion;

  // Loading states
  isLoading: boolean;

  // Error handling
  error: string | null;

  // Login credentials (temporary, for login flow)
  loginCredentials: LoginCredentials | null;
}

// Machine Events - represent the events that can trigger state transitions
export type AuthMachineEvent =
  | { type: 'INITIALIZE' }
  | { type: 'NO_STORED_SESSION' }
  | { type: 'LOGIN'; credentials: LoginCredentials }
  | { type: 'LOGOUT' }
  | { type: 'SERVER_CHANGED'; server: ServerRegion }
  | { type: 'REFRESH_TOKEN' }
  | { type: 'AUTH_SUCCESS'; token: string; userId: number }
  | { type: 'AUTH_FAILURE'; error: string }
  | { type: 'PROFILE_LOADED'; user: User }
  | { type: 'PROFILE_LOAD_FAILED'; error: string }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'LOGOUT_FAILURE'; error: string }
  | { type: 'TOKEN_REFRESHED'; token: string }
  | { type: 'TOKEN_REFRESH_FAILED'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_FROM_STORAGE'; data: Partial<AuthMachineContext> };

// Machine States - represent the possible states of the authentication system
export type AuthMachineState =
  | { value: 'idle'; context: AuthMachineContext }
  | { value: 'initializing'; context: AuthMachineContext }
  | { value: 'authenticating'; context: AuthMachineContext }
  | { value: 'loadingProfile'; context: AuthMachineContext }
  | { value: 'authenticated'; context: AuthMachineContext }
  | { value: 'loggingOut'; context: AuthMachineContext }
  | { value: 'refreshingToken'; context: AuthMachineContext }
  | { value: 'error'; context: AuthMachineContext };

// Actor Input Types - for the different actors that handle side effects
export interface InitializeAuthInput {
  type: 'INITIALIZE_AUTH';
}

export interface LoginServiceInput {
  type: 'LOGIN_SERVICE';
  credentials: LoginCredentials;
}

export interface LoadUserProfileInput {
  type: 'LOAD_USER_PROFILE';
  token: string;
  userId: number;
  server: ServerRegion;
}

export interface LogoutServiceInput {
  type: 'LOGOUT_SERVICE';
  token: string;
  server: ServerRegion;
}

export interface RefreshTokenInput {
  type: 'REFRESH_TOKEN';
  token: string;
  server: ServerRegion;
}

// Actor Output Types - for the results returned by actors
export interface InitializeAuthOutput {
  type: 'INITIALIZE_AUTH_RESULT';
  data: {
    authToken: string;
    userId: number | null;
    selectedServer: ServerRegion;
  } | null;
}

export interface LoginServiceOutput {
  type: 'LOGIN_SERVICE_RESULT';
  success: boolean;
  data?: {
    token: string;
    userId: number;
  };
  error?: string;
}

export interface LoadUserProfileOutput {
  type: 'LOAD_USER_PROFILE_RESULT';
  success: boolean;
  data?: User;
  error?: string;
}

export interface LogoutServiceOutput {
  type: 'LOGOUT_SERVICE_RESULT';
  success: boolean;
  error?: string;
}

export interface RefreshTokenOutput {
  type: 'REFRESH_TOKEN_RESULT';
  success: boolean;
  data?: {
    token: string;
  };
  error?: string;
}

// Union types for actor inputs and outputs
export type AuthActorInput =
  | InitializeAuthInput
  | LoginServiceInput
  | LoadUserProfileInput
  | LogoutServiceInput
  | RefreshTokenInput;

export type AuthActorOutput =
  | InitializeAuthOutput
  | LoginServiceOutput
  | LoadUserProfileOutput
  | LogoutServiceOutput
  | RefreshTokenOutput;

// Initial context factory
export const createInitialAuthContext = (): AuthMachineContext => ({
  authToken: '',
  userId: null,
  user: null,
  selectedServer: 'EU',
  isLoading: false,
  error: null,
  loginCredentials: null,
});

// Helper type guards
export const isLoginEvent = (event: AuthMachineEvent): event is Extract<AuthMachineEvent, { type: 'LOGIN' }> => {
  return event.type === 'LOGIN';
};

export const isServerChangedEvent = (event: AuthMachineEvent): event is Extract<AuthMachineEvent, { type: 'SERVER_CHANGED' }> => {
  return event.type === 'SERVER_CHANGED';
};

export const isAuthSuccessEvent = (event: AuthMachineEvent): event is Extract<AuthMachineEvent, { type: 'AUTH_SUCCESS' }> => {
  return event.type === 'AUTH_SUCCESS';
};

export const isAuthFailureEvent = (event: AuthMachineEvent): event is Extract<AuthMachineEvent, { type: 'AUTH_FAILURE' }> => {
  return event.type === 'AUTH_FAILURE';
};

export const isProfileLoadedEvent = (event: AuthMachineEvent): event is Extract<AuthMachineEvent, { type: 'PROFILE_LOADED' }> => {
  return event.type === 'PROFILE_LOADED';
};

export const isProfileLoadFailedEvent = (event: AuthMachineEvent): event is Extract<AuthMachineEvent, { type: 'PROFILE_LOAD_FAILED' }> => {
  return event.type === 'PROFILE_LOAD_FAILED';
};
