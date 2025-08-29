export interface AuthContextType {
    authToken: string;
    setAuthToken: (token: string) => void;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => Promise<boolean>;
    isLoading: boolean;
    isInitializing: boolean;
    user: User | null;
}

export interface LoginCredentials {
    phone: string;
    password: string;
}

export interface User {
    id: number;
    phone: string;
    name: string;
}
