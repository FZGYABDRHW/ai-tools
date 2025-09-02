import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import { AuthContextType, User } from '../types';
import { buildAuthServiceInitializer } from '../authServiceInit';
import { buildServiceInitializer } from '../serviceInit';
import { AuthService } from '../api-client/src/services/v4/user/auth';
import { LoginCredentials } from '../types';
import LogRocketService from '../services/logRocketService';

export const AuthContext = createContext<AuthContextType>({
    authToken: '',
    setAuthToken: () => {},
    login: async () => false,
    logout: async () => false,
    isLoading: false,
    isInitializing: true,
    user: null
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authToken, setAuthToken] = useState<string>(() => {
        return localStorage.getItem('authToken') || '';
    });
    const [userId, setUserId] = useState<number | null>(() => {
        const stored = localStorage.getItem('userId');
        return stored ? parseInt(stored, 10) : null;
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    // Effect to handle authToken changes
    useEffect(() => {
        console.log('AuthContext: authToken changed to:', authToken);
        localStorage.setItem('authToken', authToken);
    }, [authToken]);

    // Effect to initialize authentication state on app load
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('authToken');
            const storedUserId = localStorage.getItem('userId');
            console.log('AuthContext: Initializing with stored token:', storedToken ? 'exists' : 'none');
            console.log('AuthContext: Initializing with stored userId:', storedUserId ? storedUserId : 'none');
            
            if (storedToken && !authToken) {
                console.log('AuthContext: Restoring token from localStorage');
                setAuthToken(storedToken);
            }
            
            if (storedUserId && !userId) {
                console.log('AuthContext: Restoring userId from localStorage');
                setUserId(parseInt(storedUserId, 10));
            }
        };

        initializeAuth();
    }, []); // Run only once on mount

    // Effect to handle authToken and userId changes
    useEffect(() => {
        localStorage.setItem('authToken', authToken);
        if (authToken && userId && !user) {
            console.log('AuthContext: Loading user profile');
            loadUserProfile();
        } else if (!authToken) {
            // No token, initialization is complete
            setIsInitializing(false);
        }
    }, [authToken, userId, user]);

    // Effect to mark initialization as complete when user is set
    useEffect(() => {
        if (user) {
            console.log('AuthContext: User set, initialization complete');
            setIsInitializing(false);
        }
    }, [user]);

    const loadUserProfile = async () => {
        if (!authToken || !userId) return;
        
        try {
            console.log('AuthContext: Loading user profile for userId:', userId);
            const si = buildServiceInitializer(authToken);
            const authService = si(AuthService);
            const response = await authService.getUserProfile(userId);
            
            console.log('AuthContext: User profile response:', response);
            
            if (response && response.id) {
                console.log('AuthContext: User profile loaded, setting user:', response.id);
                // Construct full name from firstName, secondName, and thirdName
                const fullName = [
                    response.firstName,
                    response.secondName,
                    response.thirdName
                ].filter(Boolean).join(' ').trim() || 'Unknown User';
                
                console.log('AuthContext: Constructed full name:', fullName, 'from:', {
                    firstName: response.firstName,
                    secondName: response.secondName,
                    thirdName: response.thirdName
                });
                
                const userData = { 
                    id: response.id, 
                    phone: response.phone || '',
                    name: fullName
                };
                
                setUser(userData);
                
                // Identify user in LogRocket
                LogRocketService.getInstance().identifyUser(response.id, {
                    name: fullName,
                    phone: response.phone || '',
                    email: response.email || ''
                });
                
                setIsInitializing(false);
            } else {
                console.log('AuthContext: Failed to load user profile - invalid response');
                // Profile load failed, clear everything
                setAuthToken('');
                setUserId(null);
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                setIsInitializing(false);
            }
        } catch (error) {
            console.error('AuthContext: User profile load error:', error);
            // Don't immediately clear on network errors
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('AuthContext: Clearing auth due to auth error');
                setAuthToken('');
                setUserId(null);
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                setIsInitializing(false);
            } else {
                console.log('AuthContext: Network error during profile load, keeping auth');
                setIsInitializing(false);
            }
        }
    };

    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        setIsLoading(true);
        try {
            const authSi = buildAuthServiceInitializer();
            const authService = authSi(AuthService);
            const response = await authService.login(credentials);
            
            console.log('Login response:', response);
            
            // Check if response has the expected structure
            if (response && response.token) {
                setAuthToken(response.token);
                setUserId(response.id);
                localStorage.setItem('userId', response.id.toString());
                
                // Track login event in LogRocket
                LogRocketService.getInstance().trackEvent('user_login', {
                    userId: response.id,
                    timestamp: new Date().toISOString()
                });
                
                message.success('Login successful!');
                console.log('Login successful, token set:', response.token, 'userId:', response.id);
                return true;
            } else {
                console.log('Unexpected response structure:', response);
                message.error('Login failed - unexpected response structure');
                return false;
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            message.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<boolean> => {
        if (!authToken) {
            setAuthToken('');
            setUserId(null);
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            return true;
        }

        setIsLoading(true);
        try {
            const si = buildServiceInitializer(authToken);
            const authService = si(AuthService);
            await authService.logout();
            
            // Track logout event in LogRocket before clearing user data
            if (userId) {
                LogRocketService.getInstance().trackEvent('user_logout', {
                    userId: userId,
                    timestamp: new Date().toISOString()
                });
            }
            
            setAuthToken('');
            setUserId(null);
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            message.success('Logout successful!');
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear local state
            setAuthToken('');
            setUserId(null);
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            message.info('Logged out locally');
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            authToken, 
            setAuthToken, 
            login, 
            logout, 
            isLoading, 
            isInitializing, 
            user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
