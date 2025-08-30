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

export interface ReportLog {
    id: string;
    reportId: string;
    reportName: string;
    prompt: string;
    generatedAt: string;
    completedAt: string;
    status: 'completed' | 'failed';
    totalTasks: number;
    processedTasks: number;
    tableData: {
        columns: string[];
        results: Array<Record<string, unknown>>;
        csv: string;
    };
    metadata?: {
        duration: number; // in milliseconds
        errorMessage?: string;
        userAgent?: string;
        version?: string;
    };
}

export interface ReportList {
    reports: Report[];
}

export interface ReportLogList {
    reportLogs: ReportLog[];
}

export interface CreateReportRequest {
    name: string;
    prompt: string;
}

export interface UpdateReportRequest {
    name?: string;
    prompt?: string;
}
