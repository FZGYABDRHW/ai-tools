// Schema type definitions for file system storage
export interface ReportSchema {
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

export interface ReportLogSchema {
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
    duration: number;
    errorMessage?: string;
    userAgent?: string;
    version?: string;
  };
}

export interface ReportCheckpointSchema {
  reportId: string;
  prompt: string;
  currentTaskIndex: number;
  completedTasks: Array<{
    taskId: string;
    result: any;
    timestamp: number;
  }>;
  totalTasks: number;
  startTime: number;
  lastCheckpointTime: number;
  status: 'in_progress' | 'completed' | 'failed' | 'paused';
  errorMessage?: string;
  startOffset: number;
  tableData?: {
    columns: string[];
    results: Array<Record<string, unknown>>;
    csv: string;
  };
}

export interface GenerationStateSchema {
  reportId: string;
  status: 'in_progress' | 'paused' | 'completed' | 'failed' | 'ready';
  progress?: {
    processed: number;
    total: number;
  };
  tableData?: {
    columns: string[];
    results: Array<Record<string, unknown>>;
    csv: string;
  };
  startTime: number;
  errorMessage?: string;
  parameters?: any;
  extractedParameters?: {
    parameters: any;
    humanReadable: string[];
  };
}
