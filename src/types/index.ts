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

export interface Report {
    id: string;
    name: string;
    prompt: string;
    createdAt: string;
    updatedAt: string;
    lastGeneratedAt?: string;
    tableData?: {
        columns: string[];
        results: Array<Record<string, unknown>>;
        csv: string;
    };
}

export interface ReportList {
    reports: Report[];
}

export interface CreateReportRequest {
    name: string;
    prompt: string;
}

export interface UpdateReportRequest {
    name?: string;
    prompt?: string;
}
