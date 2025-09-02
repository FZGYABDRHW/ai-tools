# LogRocket Integration Guide

This guide explains how to use the LogRocket integration in your Wowworks AI Tools application.

## Overview

LogRocket has been integrated to provide:
- **Session Recording**: Record user sessions for debugging and user experience analysis
- **User Identification**: Track user actions with proper user context
- **Event Tracking**: Monitor custom events and user interactions
- **Error Tracking**: Capture and analyze application errors
- **Performance Monitoring**: Track application performance metrics

## Configuration

### 1. App ID
The LogRocket app ID is configured in `src/config/logRocket.config.ts`:
```typescript
export const LOGROCKET_CONFIG = {
    APP_ID: 'ppa7go/ai-tools',
    // ... other settings
};
```

### 2. Environment Settings
The configuration automatically detects the environment and adjusts logging levels:
- **Development**: Enhanced console logging for debugging
- **Production**: Optimized for performance with essential logging only

## Usage

### Basic Initialization
LogRocket is automatically initialized when the app starts in `src/app.tsx`:
```typescript
import LogRocketService from './services/logRocketService';

// Initialize LogRocket
LogRocketService.getInstance().init();
```

### User Identification
Users are automatically identified when they log in. The system tracks:
- User ID
- User name
- Phone number
- Email (if available)

```typescript
// This happens automatically in AuthContext when user logs in
LogRocketService.getInstance().identifyUser(userId, {
    name: fullName,
    phone: phoneNumber,
    email: emailAddress
});
```

### Event Tracking
Track custom events throughout your application:

```typescript
import LogRocketService from '../services/logRocketService';

const logRocketService = LogRocketService.getInstance();

// Track a custom event
logRocketService.trackEvent('task_created', {
    taskId: 123,
    taskType: 'cleaning',
    timestamp: new Date().toISOString()
});

// Track user actions
logRocketService.trackEvent('button_clicked', {
    buttonId: 'submit_task',
    page: 'task_creation',
    userId: currentUser.id
});
```

### Logging
Send different types of log messages:

```typescript
// Info logging
logRocketService.logMessage('info', 'User started task creation', {
    userId: user.id,
    taskType: 'cleaning'
});

// Warning logging
logRocketService.logMessage('warn', 'API response was slow', {
    endpoint: '/api/tasks',
    responseTime: 2500
});

// Error logging
logRocketService.logMessage('error', 'Failed to save task', {
    error: error.message,
    userId: user.id
});
```

### Exception Tracking
Capture and track application errors:

```typescript
try {
    // Your code here
} catch (error) {
    logRocketService.captureException(error, {
        component: 'TaskService',
        action: 'createTask',
        userId: user.id
    });
    throw error; // Re-throw if needed
}
```

### Session Management
Manage LogRocket sessions:

```typescript
// Start a new session
logRocketService.startNewSession();

// Get current session URL (useful for debugging)
const sessionURL = logRocketService.getSessionURL();
console.log('Current session:', sessionURL);
```

## Automatic Events

The following events are automatically tracked:

### Authentication Events
- `user_login`: When a user successfully logs in
- `user_logout`: When a user logs out
- `user_profile_load`: When user profile is loaded

### User Context
- User identification happens automatically on login
- User properties are filtered for privacy (sensitive data is excluded)
- Session context is maintained throughout the user's session

## Privacy & Security

### Data Filtering
The system automatically filters sensitive information:
- **Included**: User ID, name, phone, email
- **Excluded**: Passwords, tokens, secrets, sensitive data

### Configuration
You can modify the data filtering in `src/config/logRocket.config.ts`:
```typescript
USER_IDENTIFICATION: {
    includeFields: ['id', 'name', 'phone', 'email'],
    excludeFields: ['password', 'token', 'secret']
}
```

## Debug Component

A debug component is available at `src/components/LogRocketDebug.tsx` that provides:
- Status monitoring
- Test event tracking
- Test logging
- Exception testing
- Session management

You can include this component in your app for development and testing purposes.

## Best Practices

### 1. Event Naming
Use consistent, descriptive event names:
- ✅ `task_created`, `user_login`, `payment_completed`
- ❌ `click`, `event`, `action`

### 2. Event Properties
Include relevant context with events:
```typescript
logRocketService.trackEvent('task_created', {
    taskId: task.id,
    taskType: task.type,
    userId: user.id,
    timestamp: new Date().toISOString(),
    source: 'web_interface'
});
```

### 3. Error Handling
Always capture exceptions with context:
```typescript
try {
    await apiCall();
} catch (error) {
    logRocketService.captureException(error, {
        component: 'TaskService',
        action: 'createTask',
        userId: user.id,
        taskData: taskData
    });
}
```

### 4. Performance Monitoring
Track performance-critical operations:
```typescript
const startTime = Date.now();
try {
    await heavyOperation();
    const duration = Date.now() - startTime;
    logRocketService.trackEvent('operation_completed', {
        operation: 'heavyOperation',
        duration: duration,
        success: true
    });
} catch (error) {
    const duration = Date.now() - startTime;
    logRocketService.trackEvent('operation_failed', {
        operation: 'heavyOperation',
        duration: duration,
        success: false,
        error: error.message
    });
}
```

## Troubleshooting

### Common Issues

1. **LogRocket not initialized**
   - Check that `LogRocketService.getInstance().init()` is called
   - Verify the app ID is correct

2. **Events not appearing**
   - Check browser console for errors
   - Verify user identification is working
   - Check LogRocket dashboard for session data

3. **User identification issues**
   - Ensure user data is properly formatted
   - Check that sensitive fields are not included
   - Verify user ID is being passed correctly

### Debug Mode
Enable debug logging by checking the console for LogRocket-related messages. All operations log to the console for debugging purposes.

## Support

For LogRocket-specific issues:
1. Check the [LogRocket documentation](https://docs.logrocket.com/)
2. Review the LogRocket dashboard for session data
3. Check browser console for error messages
4. Use the debug component to test functionality

For integration-specific issues:
1. Review the service implementation in `src/services/logRocketService.ts`
2. Check the configuration in `src/config/logRocket.config.ts`
3. Verify the integration in `src/contexts/AuthContext.tsx`
