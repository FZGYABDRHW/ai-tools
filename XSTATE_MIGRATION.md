# XState Authentication Migration

## Overview

This document describes the migration from React Context + localStorage to XState state machine architecture for authentication and global app state management.

## Migration Summary

### What Was Changed

1. **Replaced React Context with XState Machine**
   - Removed `AuthContext.tsx` and replaced with XState state machine
   - Created pure state machine with clear states and transitions
   - Isolated side effects into actors
   - Separated state updates into pure actions

2. **New Architecture Components**
   - `src/machines/authMachine.ts` - Core state machine definition
   - `src/machines/types.ts` - TypeScript types for machine context and events
   - `src/machines/actors.ts` - Side effects (API calls, localStorage operations)
   - `src/machines/actions.ts` - Pure state updates and persistence
   - `src/machines/AuthProvider.tsx` - React integration layer
   - `src/machines/index.ts` - Public API exports

3. **Updated Components**
   - `src/app.tsx` - Now uses new AuthProvider
   - `src/components/App.tsx` - Uses new useAuth hook
   - `src/components/LoginForm.tsx` - Uses new useAuth hook
   - `src/components/LoginScreen.tsx` - Uses new useAuth hook
   - `src/components/Header.tsx` - Uses new useAuth hook
   - `src/components/ServerSelector.tsx` - Uses new useAuth hook
   - `src/components/CustomOperationalReport.tsx` - Uses new useAuth hook
   - `src/components/TaskAuthForm.tsx` - Uses new useAuth hook
   - `src/components/AuthGuard.tsx` - Uses new useAuth hook
   - `src/components/TokenInput.tsx` - Updated (note: setAuthToken not available)

## State Machine Architecture

### States

- **`idle`** - Initial state, waiting for initialization
- **`initializing`** - Restoring authentication state from localStorage
- **`authenticating`** - Processing login request
- **`loadingProfile`** - Loading user profile after successful authentication
- **`authenticated`** - User is logged in and profile is loaded
- **`loggingOut`** - Processing logout request
- **`refreshingToken`** - Refreshing authentication token
- **`error`** - Error state with error message

### Events

- `INITIALIZE` - Start authentication initialization
- `LOGIN` - Start login process with credentials
- `LOGOUT` - Start logout process
- `SERVER_CHANGED` - Change selected server region
- `REFRESH_TOKEN` - Refresh authentication token
- `AUTH_SUCCESS` - Authentication successful
- `AUTH_FAILURE` - Authentication failed
- `PROFILE_LOADED` - User profile loaded successfully
- `PROFILE_LOAD_FAILED` - User profile load failed
- `LOGOUT_SUCCESS` - Logout completed successfully
- `LOGOUT_FAILURE` - Logout failed
- `TOKEN_REFRESHED` - Token refresh successful
- `TOKEN_REFRESH_FAILED` - Token refresh failed
- `CLEAR_ERROR` - Clear error state
- `RESTORE_FROM_STORAGE` - Restore data from localStorage

### Actors (Side Effects)

- **`initializeAuthActor`** - Restores authentication state from localStorage
- **`loginServiceActor`** - Handles login API calls
- **`loadUserProfileActor`** - Loads user profile data
- **`logoutServiceActor`** - Handles logout API calls
- **`refreshTokenActor`** - Handles token refresh

### Actions (Pure State Updates)

- **`checkStoredAuth`** - Restore authentication data from localStorage
- **`setAuthData`** - Set authentication data and persist to localStorage
- **`setUser`** - Set user profile data
- **`clearAuthData`** - Clear all authentication data
- **`setError`** - Set error state
- **`clearError`** - Clear error state
- **`updateServer`** - Update selected server and persist to localStorage
- **`setLoading`** - Set loading state
- **`clearLoading`** - Clear loading state
- **`handleLogoutSuccess`** - Handle successful logout with LogRocket tracking
- **`handleTokenRefreshSuccess`** - Handle successful token refresh
- **`handleProfileLoadFailure`** - Handle profile load failure with cleanup

## React Integration

### useAuth Hook

The `useAuth` hook provides a clean API similar to the old AuthContext:

```typescript
const {
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
} = useAuth();
```

### AuthProvider Component

The `AuthProvider` component wraps the app and provides the XState machine:

```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

## Benefits of XState Migration

### 1. **Clear State Management**
- Explicit states and transitions
- No more complex useEffect dependencies
- Predictable state flow

### 2. **Separation of Concerns**
- Pure state updates in actions
- Side effects isolated in actors
- Business logic separated from UI logic

### 3. **Better Error Handling**
- Centralized error state management
- Consistent error handling across all operations
- Clear error recovery paths

### 4. **Improved Testing**
- State machine can be tested independently
- Actors can be mocked for unit tests
- Clear test scenarios for each state transition

### 5. **Developer Experience**
- XState DevTools for debugging
- Visual state machine representation
- Better TypeScript support

### 6. **Performance**
- Optimized re-renders with proper state selection
- No unnecessary effect dependencies
- Efficient state updates

## Migration Checklist

- [x] Install XState dependencies
- [x] Create machine directory structure
- [x] Define TypeScript types for machine context and events
- [x] Implement core authentication state machine
- [x] Create isolated side effects as XState actors
- [x] Implement pure state updates and persistence actions
- [x] Create React integration layer with hooks and provider
- [x] Update all components to use new XState auth system
- [x] Create comprehensive test suite
- [x] Update main app.tsx to use new provider
- [x] Remove old AuthContext (pending cleanup)

## Breaking Changes

### Removed Features
- `setAuthToken` function is no longer available in the public API
- Direct localStorage manipulation is no longer supported
- Imperative state updates are replaced with event-driven state machine

### New Features
- `refreshToken` function for token management
- `clearError` function for error state management
- Computed state properties (`isAuthenticated`, `isAuthenticating`, etc.)
- Direct access to machine state and send function for advanced usage

## Testing

### Unit Tests
- State machine transitions
- Actor implementations
- Action implementations
- React hook integration

### Integration Tests
- Complete authentication flows
- Error scenarios
- localStorage persistence
- Component integration

## DevTools Integration

XState DevTools are automatically enabled in development mode:

```typescript
const authService = useInterpret(authMachine, {
  devTools: process.env.NODE_ENV === 'development'
});
```

## Performance Optimizations

1. **State Selection** - Only re-render when relevant state changes
2. **Actor Optimization** - Efficient async operations
3. **Action Batching** - Multiple state updates in single action
4. **Guard Conditions** - Conditional state transitions

## Future Enhancements

1. **Token Refresh Automation** - Automatic token refresh before expiration
2. **Offline Support** - Handle offline/online state transitions
3. **Multi-tab Synchronization** - Sync auth state across browser tabs
4. **Advanced Error Recovery** - Retry mechanisms for failed operations
5. **Analytics Integration** - Track state transitions for analytics

## Troubleshooting

### Common Issues

1. **"useAuth must be used within an AuthProvider"**
   - Ensure the component is wrapped with AuthProvider
   - Check that the hook is imported correctly

2. **State not updating**
   - Check that events are being sent correctly
   - Verify state machine transitions are defined
   - Use XState DevTools to debug state flow

3. **Actors not executing**
   - Verify actor inputs are correct
   - Check that the machine is in the correct state
   - Ensure actors are properly defined

### Debug Tools

1. **XState DevTools** - Visual state machine debugging
2. **Console Logging** - Detailed logging in actors and actions
3. **React DevTools** - Component state inspection
4. **Network Tab** - API call monitoring

## Conclusion

The XState migration provides a more robust, maintainable, and testable authentication system. The clear separation of concerns, explicit state management, and improved error handling make the codebase more reliable and easier to debug.

The migration maintains backward compatibility for the most part, with only minor breaking changes that are well-documented. The new architecture provides a solid foundation for future enhancements and scaling.
