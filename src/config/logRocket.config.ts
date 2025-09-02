export const LOGROCKET_CONFIG = {
    // Your LogRocket app ID
    APP_ID: 'ppa7go/ai-tools',
    
    // Environment-specific settings
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    
    // LogRocket options
    OPTIONS: {
        // Enable console logging in development
        console: process.env.NODE_ENV === 'development',
        
        // Enable network logging
        network: true,
        
        // Enable DOM logging
        dom: true,
        
        // Enable error logging
        errors: true,
        
        // Enable performance monitoring
        performance: true,
        
        // Custom tags for your app
        tags: ['ai-tools', 'electron-app']
    },
    
    // User identification settings
    USER_IDENTIFICATION: {
        // Fields to include in user identification
        includeFields: ['id', 'name', 'phone', 'email'],
        
        // Fields to exclude from user identification (for privacy)
        excludeFields: ['password', 'token', 'secret']
    },
    
    // Event tracking settings
    EVENT_TRACKING: {
        // Enable automatic event tracking
        enabled: true,
        
        // Events to track automatically
        autoTrackEvents: [
            'user_login',
            'user_logout',
            'user_profile_load',
            'app_error',
            'app_warning'
        ]
    }
};

export default LOGROCKET_CONFIG;
