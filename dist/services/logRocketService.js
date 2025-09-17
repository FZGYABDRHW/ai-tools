"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRocketService = void 0;
const logrocket_1 = __importDefault(require("logrocket"));
const logRocket_config_1 = require("../config/logRocket.config");
class LogRocketService {
    constructor() {
        this.isInitialized = false;
    }
    static getInstance() {
        if (!LogRocketService.instance) {
            LogRocketService.instance = new LogRocketService();
        }
        return LogRocketService.instance;
    }
    /**
     * Initialize LogRocket with configuration
     */
    init() {
        if (this.isInitialized) {
            console.log('LogRocket already initialized');
            return;
        }
        try {
            // Initialize LogRocket with app ID
            logrocket_1.default.init(logRocket_config_1.LOGROCKET_CONFIG.APP_ID);
            this.isInitialized = true;
            console.log('LogRocket initialized successfully with config:', logRocket_config_1.LOGROCKET_CONFIG);
        }
        catch (error) {
            console.error('Failed to initialize LogRocket:', error);
        }
    }
    /**
     * Identify user in LogRocket session
     * @param userId - User ID from your auth system
     * @param userData - Additional user data (optional)
     */
    identifyUser(userId, userData) {
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
            logrocket_1.default.identify(userId.toString(), userInfo);
            console.log('User identified in LogRocket:', userInfo);
            // Track user profile load event
            this.trackEvent('user_profile_load', {
                userId: userId.toString(),
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Failed to identify user in LogRocket:', error);
        }
    }
    /**
     * Track custom events
     * @param eventName - Name of the event
     * @param properties - Event properties (optional)
     */
    trackEvent(eventName, properties) {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }
        try {
            logrocket_1.default.track(eventName, properties);
            console.log('Event tracked in LogRocket:', eventName, properties);
        }
        catch (error) {
            console.error('Failed to track event in LogRocket:', error);
        }
    }
    /**
     * Add custom event with additional context
     * @param eventName - Name of the event
     * @param properties - Event properties (optional)
     */
    addEvent(eventName, properties) {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }
        try {
            logrocket_1.default.addEvent(eventName, properties);
            console.log('Event added in LogRocket:', eventName, properties);
        }
        catch (error) {
            console.error('Failed to add event in LogRocket:', error);
        }
    }
    /**
     * Log messages with different levels
     * @param level - Log level (log, info, warn, error, debug)
     * @param message - Message to log
     * @param data - Additional data (optional)
     */
    logMessage(level, message, data) {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }
        try {
            switch (level) {
                case 'log':
                    logrocket_1.default.log(message, data);
                    break;
                case 'info':
                    logrocket_1.default.info(message, data);
                    break;
                case 'warn':
                    logrocket_1.default.warn(message, data);
                    break;
                case 'error':
                    logrocket_1.default.error(message, data);
                    break;
                case 'debug':
                    logrocket_1.default.debug(message, data);
                    break;
            }
            console.log(`LogRocket ${level}:`, message, data);
        }
        catch (error) {
            console.error(`Failed to log ${level} message in LogRocket:`, error);
        }
    }
    /**
     * Capture exception for error tracking
     * @param error - Error object to capture
     * @param context - Additional context (optional)
     */
    captureException(error, context) {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }
        try {
            logrocket_1.default.captureException(error, context);
            console.log('Exception captured in LogRocket:', error, context);
        }
        catch (logRocketError) {
            console.error('Failed to capture exception in LogRocket:', logRocketError);
        }
    }
    /**
     * Filter user data based on configuration
     * @param userData - Raw user data
     * @returns Filtered user data
     */
    filterUserData(userData) {
        if (!userData)
            return {};
        const filtered = {};
        Object.keys(userData).forEach(key => {
            // Only include fields that are in the include list
            if (logRocket_config_1.LOGROCKET_CONFIG.USER_IDENTIFICATION.includeFields.includes(key)) {
                // Exclude sensitive fields
                if (!logRocket_config_1.LOGROCKET_CONFIG.USER_IDENTIFICATION.excludeFields.includes(key)) {
                    filtered[key] = userData[key];
                }
            }
        });
        return filtered;
    }
    /**
     * Get LogRocket instance for advanced usage
     */
    getLogRocketInstance() {
        return logrocket_1.default;
    }
    /**
     * Check if LogRocket is initialized
     */
    isServiceInitialized() {
        return this.isInitialized;
    }
    /**
     * Get current session URL
     */
    getSessionURL() {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return undefined;
        }
        try {
            return logrocket_1.default.getSessionURL();
        }
        catch (error) {
            console.error('Failed to get session URL from LogRocket:', error);
            return undefined;
        }
    }
    /**
     * Start a new session
     */
    startNewSession() {
        if (!this.isInitialized) {
            console.warn('LogRocket not initialized. Call init() first.');
            return;
        }
        try {
            logrocket_1.default.startNewSession();
            console.log('New LogRocket session started');
        }
        catch (error) {
            console.error('Failed to start new LogRocket session:', error);
        }
    }
}
exports.LogRocketService = LogRocketService;
exports.default = LogRocketService;
//# sourceMappingURL=logRocketService.js.map