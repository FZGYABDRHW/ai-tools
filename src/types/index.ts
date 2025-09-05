export interface AuthContextType {
    authToken: string;
    setAuthToken: (token: string) => void;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => Promise<boolean>;
    isLoading: boolean;
    isInitializing: boolean;
    user: User | null;
    selectedServer: ServerRegion;
    setSelectedServer: (server: ServerRegion) => void;
}

export type ServerRegion = 'EU' | 'RU';

export interface ServerConfig {
    region: ServerRegion;
    name: string;
    baseURL: string;
    flag: string;
}

export interface LoginCredentials {
    phone: string;
    password: string;
    server?: ServerRegion;
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
    extractedParameters?: {
        parameters: {
            limit?: number;
            taskStatus?: 'new' | 'done' | 'canceled' | 'in-work' | 'on-moderation' | 'awaiting-approve' | 'on-payment' | 'in-queue';
            timeRangeFrom?: string;
            timeRangeTo?: string;
        };
        humanReadable: string[];
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
    extractedParameters?: {
        parameters: {
            limit?: number;
            taskStatus?: 'new' | 'done' | 'canceled' | 'in-work' | 'on-moderation' | 'awaiting-approve' | 'on-payment' | 'in-queue';
            timeRangeFrom?: string;
            timeRangeTo?: string;
        };
        humanReadable: string[];
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
