import { Effect, Context } from 'effect';
import { Report, ReportLog } from '../../types';

// ============================================================================
// Shared Domain Types
// ============================================================================

// Define TaskListParameters locally to avoid circular dependency
export interface TaskListParameters {
  readonly limit?: number;
  readonly taskStatus?: 'new' | 'done' | 'canceled' | 'in-work' | 'on-moderation' | 'awaiting-approve' | 'on-payment' | 'in-queue';
  readonly timeRangeFrom?: string;
  readonly timeRangeTo?: string;
}

// Re-export types for use in other modules
export type { Report, ReportLog } from '../../types';

export type GenerationStatus = 'preparing' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'ready';

export interface ProgressInfo {
  readonly processed: number;
  readonly total: number;
}

export interface TableData {
  readonly columns: readonly string[];
  readonly results: readonly Record<string, unknown>[];
  readonly csv: string;
}

export interface ExtractedParameters {
  readonly parameters: TaskListParameters;
  readonly humanReadable: readonly string[];
}

export interface ReportGenerationState {
  readonly reportId: string;
  readonly status: GenerationStatus;
  readonly progress: ProgressInfo | null;
  readonly tableData: TableData | null;
  readonly startTime: number;
  readonly errorMessage?: string;
  readonly parameters?: TaskListParameters;
  readonly extractedParameters?: ExtractedParameters;
}

// ============================================================================
// Callback Types (Strictly Typed)
// ============================================================================

export interface GenerationCallbacks {
  readonly onProgress?: (progress: TableData) => void;
  readonly onComplete?: (result: TableData) => void;
  readonly onError?: (error: GenerationError) => void;
}

// ============================================================================
// Error Types
// ============================================================================

export class GenerationError extends Error {
  constructor(
    message: string,
    public readonly code: GenerationErrorCode,
    public readonly reportId: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'GenerationError';
  }
}

export type GenerationErrorCode =
  | 'ABORTED'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'VALIDATION_ERROR'
  | 'STORAGE_ERROR'
  | 'CHECKPOINT_ERROR'
  | 'REPORT_NOT_FOUND'
  | 'INVALID_PARAMETERS'
  | 'OPENAI_ERROR'
  | 'UNKNOWN_ERROR';

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly operation: 'read' | 'write' | 'delete',
    public readonly key: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export class CheckpointError extends Error {
  constructor(
    message: string,
    public readonly reportId: string,
    public readonly operation: 'create' | 'update' | 'resume' | 'clear',
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'CheckpointError';
  }
}

// ============================================================================
// Parameter Types
// ============================================================================

export interface StartGenerationParams {
  readonly reportId: string;
  readonly reportText: string;
  readonly authToken: string;
  readonly selectedServer?: string;
  readonly onProgress?: (progress: TableData) => void;
  readonly onComplete?: (result: TableData) => void;
  readonly onError?: (error: GenerationError) => void;
  readonly startOffset?: number;
  readonly parameters?: TaskListParameters;
}

export interface ResumeGenerationParams {
  readonly reportId: string;
  readonly authToken: string;
  readonly selectedServer?: string;
  readonly onProgress?: (progress: TableData) => void;
  readonly onComplete?: (result: TableData) => void;
  readonly onError?: (error: GenerationError) => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export type GenerationStateMap = Map<string, ReportGenerationState>;
export type CallbackMap = Map<string, GenerationCallbacks>;
