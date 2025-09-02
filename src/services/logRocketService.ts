import LogRocket from 'logrocket';
import { LOGROCKET_CONFIG } from '../config/logRocket.config';

export class LogRocketService {
    private static instance: LogRocketService;
    private isInitialized = false;

    private constructor() {}

    public static getInstance(): LogRocketService {
        if (!LogRocketService.instance) {
            LogRocketService.instance = new LogRocketService();
        }
        return LogRocketService.instance;
    }

    /**
     * Initialize LogRocket with configuration
     */
    public init(): void {
        if (this.isInitialized) {
            console.log('LogRocket already initialized');
            return;
        }

        try {
            // Initialize LogRocket with app ID
            LogRocket.init(LOGROCKET_CONFIG.APP_ID);
            
            this.isInitialized = true;
            console.log('LogRocket initialized successfully with config:', LOGROCKET_CONFIG);
        } catch (error) {
            console.error('Failed to initialize LogRocket:', error);
        }
    }

    /**
     * Identify user in LogRocket session
     * @param userId - User ID from your auth system
     * @param userData - Additional user data (optional)
     */
    public identifyUser(userId: number | string, userData?: Record<string, any>): void {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }

        try {
            // Filter user data based on configuration
            const filteredUserData = this.filterUserData(userData);
            
            const userInfo = {
                id: userId.toString(),
                ...filteredUserData
            };

            LogRocket.identify(userId.toString(), userInfo);
            console.log('User identified in LogRocket:', userInfo);
            
            // Track user profile load event
            this.trackEvent('user_profile_load', {
                userId: userId.toString(),
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to identify user in LogRocket:', error);
        }
    }

    /**
     * Track custom events
     * @param eventName - Name of the event
     * @param properties - Event properties (optional)
     */
    public trackEvent(eventName: string, properties?: Record<string, any>): void {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }

        try {
            LogRocket.track(eventName, properties);
            console.log('Event tracked in LogRocket:', eventName, properties);
        } catch (error) {
            console.error('Failed to track event in LogRocket:', error);
        }
    }

    /**
     * Add custom event with additional context
     * @param eventName - Name of the event
     * @param properties - Event properties (optional)
     */
    public addEvent(eventName: string, properties?: Record<string, any>): void {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }

        try {
            LogRocket.addEvent(eventName, properties);
            console.log('Event added in LogRocket:', eventName, properties);
        } catch (error) {
            console.error('Failed to add event in LogRocket:', error);
        }
    }

    /**
     * Log messages with different levels
     * @param level - Log level (log, info, warn, error, debug)
     * @param message - Message to log
     * @param data - Additional data (optional)
     */
    public logMessage(level: 'log' | 'info' | 'warn' | 'error' | 'debug', message: string, data?: any): void {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }

        try {
            switch (level) {
                case 'log':
                    LogRocket.log(message, data);
                    break;
                case 'info':
                    LogRocket.info(message, data);
                    break;
                case 'warn':
                    LogRocket.warn(message, data);
                    break;
                case 'error':
                    LogRocket.error(message, data);
                    break;
                case 'debug':
                    LogRocket.debug(message, data);
                    break;
            }
            console.log(`LogRocket ${level}:`, message, data);
        } catch (error) {
            console.error(`Failed to log ${level} message in LogRocket:`, error);
        }
    }

    /**
     * Capture exception for error tracking
     * @param error - Error object to capture
     * @param context - Additional context (optional)
     */
    public captureException(error: Error, context?: Record<string, any>): void {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }

        try {
            LogRocket.captureException(error, context);
            console.log('Exception captured in LogRocket:', error, context);
        } catch (logRocketError) {
            console.error('Failed to capture exception in LogRocket:', logRocketError);
        }
    }

    /**
     * Filter user data based on configuration
     * @param userData - Raw user data
     * @returns Filtered user data
     */
    private filterUserData(userData?: Record<string, any>): Record<string, any> {
        if (!userData) return {};

        const filtered: Record<string, any> = {};
        
        Object.keys(userData).forEach(key => {
            // Only include fields that are in the include list
            if (LOGROCKET_CONFIG.USER_IDENTIFICATION.includeFields.includes(key)) {
                // Exclude sensitive fields
                if (!LOGROCKET_CONFIG.USER_IDENTIFICATION.excludeFields.includes(key)) {
                    filtered[key] = userData[key];
                }
            }
        });

        return filtered;
    }

    /**
     * Get LogRocket instance for advanced usage
     */
    public getLogRocketInstance(): typeof LogRocket {
        return LogRocket;
    }

    /**
     * Check if LogRocket is initialized
     */
    public isServiceInitialized(): boolean {
        return this.isInitialized;
    }

    /**
     * Get current session URL
     */
    public getSessionURL(): string | undefined {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return undefined;
        }

        try {
            return LogRocket.getSessionURL();
        } catch (error) {
            console.error('Failed to get session URL from LogRocket:', error);
            return undefined;
        }
    }

    /**
     * Start a new session
     */
    public startNewSession(): void {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }

        try {
            LogRocket.startNewSession();
            console.log('New LogRocket session started');
        } catch (error) {
            console.error('Failed to start new LogRocket session:', error);
        }
    }
}

export default LogRocketService;
