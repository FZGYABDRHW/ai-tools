import { Effect, pipe } from 'effect';
import {
  ReportGenerationState,
  GenerationStatus,
  ProgressInfo,
  TableData,
  ExtractedParameters,
  GenerationCallbacks,
  ReportCheckpoint,
  CompletedTask,
  CreateCheckpointParams,
  UpdateCheckpointParams,
  GenerationError,
  CheckpointError,
  GenerationErrorCode,
  TaskListParameters
} from './types';

// ============================================================================
// Pure Business Logic Functions
// ============================================================================

/**
 * Creates a new generation state with the given parameters
 */
export const createGenerationState = (
  reportId: string,
  startTime: number,
  parameters?: TaskListParameters
): ReportGenerationState => ({
  reportId,
  status: 'preparing',
  progress: null,
  tableData: null,
  startTime,
  parameters
});

/**
 * Updates the status of a generation state
 */
export const updateGenerationStatus = (
  state: ReportGenerationState,
  status: GenerationStatus,
  errorMessage?: string
): ReportGenerationState => ({
  ...state,
  status,
  errorMessage
});

/**
 * Updates the progress of a generation state
 */
export const updateGenerationProgress = (
  state: ReportGenerationState,
  progress: ProgressInfo
): ReportGenerationState => ({
  ...state,
  progress
});

/**
 * Updates the table data of a generation state
 */
export const updateGenerationTableData = (
  state: ReportGenerationState,
  tableData: TableData
): ReportGenerationState => ({
  ...state,
  tableData
});

/**
 * Updates the extracted parameters of a generation state
 */
export const updateGenerationExtractedParameters = (
  state: ReportGenerationState,
  extractedParameters: ExtractedParameters
): ReportGenerationState => ({
  ...state,
  extractedParameters
});

/**
 * Merges existing table data with new progress data
 */
export const mergeTableData = (
  existing: TableData | null,
  newData: TableData
): TableData => {
  if (!existing) {
    return newData;
  }

  return {
    columns: newData.columns,
    results: [...existing.results, ...newData.results],
    csv: generateCsv(newData.columns, [...existing.results, ...newData.results])
  };
};

/**
 * Generates CSV content from columns and results
 */
export const generateCsv = (
  columns: readonly string[],
  results: readonly Record<string, unknown>[]
): string => {
  const escapeCsv = (value: unknown): string =>
    `"${String(value ?? '').replace(/"/g, '""')}"`;

  const header = columns.join(',');
  const body = results
    .map((row) => columns.map((col) => escapeCsv(row[col])).join(','))
    .join('\n');

  return `${header}\n${body}`;
};

/**
 * Calculates progress information from table data
 */
export const calculateProgress = (tableData: TableData): ProgressInfo => ({
  processed: tableData.results.length,
  total: tableData.results.length
});

/**
 * Checks if a generation state is currently generating
 */
export const isGenerating = (state: ReportGenerationState | null): boolean => {
  if (!state) return false;
  return state.status === 'preparing' || state.status === 'in_progress';
};

/**
 * Checks if a generation can be resumed
 */
export const canResumeGeneration = (state: ReportGenerationState | null): boolean => {
  if (!state) return false;
  return state.status === 'paused' || state.status === 'failed';
};

/**
 * Checks if a generation can be restarted
 */
export const canRestartGeneration = (state: ReportGenerationState | null): boolean => {
  if (!state) return false;
  return state.status === 'failed' || state.status === 'completed';
};

/**
 * Validates generation parameters
 */
export const validateGenerationParams = (params: {
  reportId: string;
  reportText: string;
  authToken: string;
}): Effect.Effect<void, GenerationError> => {
  if (!params.reportId || params.reportId.trim() === '') {
    return Effect.fail(new GenerationError('Report ID is required', 'VALIDATION_ERROR', params.reportId));
  }

  if (!params.reportText || params.reportText.trim() === '') {
    return Effect.fail(new GenerationError('Report text is required', 'VALIDATION_ERROR', params.reportId));
  }

  if (!params.authToken || params.authToken.trim() === '') {
    return Effect.fail(new GenerationError('Auth token is required', 'VALIDATION_ERROR', params.reportId));
  }

  return Effect.succeed(undefined);
};

/**
 * Creates a new checkpoint from parameters
 */
export const createCheckpoint = (params: CreateCheckpointParams): ReportCheckpoint => ({
  reportId: params.reportId,
  prompt: params.prompt,
  currentTaskIndex: 0,
  completedTasks: [],
  totalTasks: params.totalTasks,
  startTime: params.startTime,
  lastCheckpointTime: Date.now(),
  status: 'in_progress',
  startOffset: params.startOffset ?? 0
});

/**
 * Updates a checkpoint with new task completion
 */
export const updateCheckpoint = (
  checkpoint: ReportCheckpoint,
  params: UpdateCheckpointParams
): ReportCheckpoint => {
  const newCompletedTask: CompletedTask = {
    taskId: params.taskId,
    result: params.result,
    timestamp: Date.now()
  };

  const tasksPerPage = 30;
  const completedPages = Math.floor(params.currentTaskIndex / tasksPerPage);
  const newStartOffset = completedPages * tasksPerPage;

  return {
    ...checkpoint,
    completedTasks: [...checkpoint.completedTasks, newCompletedTask],
    currentTaskIndex: params.currentTaskIndex,
    lastCheckpointTime: Date.now(),
    startOffset: newStartOffset,
    tableData: params.tableData ?? checkpoint.tableData
  };
};

/**
 * Marks a checkpoint as completed
 */
export const markCheckpointCompleted = (checkpoint: ReportCheckpoint): ReportCheckpoint => ({
  ...checkpoint,
  status: 'completed',
  lastCheckpointTime: Date.now()
});

/**
 * Marks a checkpoint as failed
 */
export const markCheckpointFailed = (
  checkpoint: ReportCheckpoint,
  errorMessage: string
): ReportCheckpoint => ({
  ...checkpoint,
  status: 'failed',
  errorMessage,
  lastCheckpointTime: Date.now()
});

/**
 * Marks a checkpoint as paused
 */
export const markCheckpointPaused = (checkpoint: ReportCheckpoint): ReportCheckpoint => ({
  ...checkpoint,
  status: 'paused',
  lastCheckpointTime: Date.now()
});

/**
 * Resumes a paused checkpoint
 */
export const resumeCheckpoint = (checkpoint: ReportCheckpoint): ReportCheckpoint => ({
  ...checkpoint,
  status: 'in_progress',
  lastCheckpointTime: Date.now()
});

/**
 * Calculates the resume offset for a checkpoint
 */
export const calculateResumeOffset = (checkpoint: ReportCheckpoint): number => {
  const tasksPerPage = 30;
  const completedPages = Math.floor(checkpoint.currentTaskIndex / tasksPerPage);
  return completedPages * tasksPerPage;
};

/**
 * Calculates progress percentage for a checkpoint
 */
export const calculateCheckpointProgress = (checkpoint: ReportCheckpoint): number => {
  if (checkpoint.totalTasks === 0) return 0;
  return Math.round((checkpoint.currentTaskIndex / checkpoint.totalTasks) * 100);
};

/**
 * Calculates estimated time remaining for a checkpoint
 */
export const calculateEstimatedTimeRemaining = (checkpoint: ReportCheckpoint): number => {
  if (checkpoint.currentTaskIndex === 0) return 0;

  const elapsed = Date.now() - checkpoint.startTime;
  const avgTimePerTask = elapsed / checkpoint.currentTaskIndex;
  const remainingTasks = checkpoint.totalTasks - checkpoint.currentTaskIndex;

  return Math.round(avgTimePerTask * remainingTasks);
};

/**
 * Validates checkpoint parameters
 */
export const validateCheckpointParams = (params: CreateCheckpointParams): Effect.Effect<void, CheckpointError> => {
  if (!params.reportId || params.reportId.trim() === '') {
    return Effect.fail(new CheckpointError('Report ID is required', '', 'create'));
  }

  if (!params.prompt || params.prompt.trim() === '') {
    return Effect.fail(new CheckpointError('Prompt is required', params.reportId, 'create'));
  }

  if (params.totalTasks < 0) {
    return Effect.fail(new CheckpointError('Total tasks must be non-negative', params.reportId, 'create'));
  }

  if (params.startTime <= 0) {
    return Effect.fail(new CheckpointError('Start time must be positive', params.reportId, 'create'));
  }

  return Effect.succeed(undefined);
};

/**
 * Validates update checkpoint parameters
 */
export const validateUpdateCheckpointParams = (params: UpdateCheckpointParams): Effect.Effect<void, CheckpointError> => {
  if (!params.reportId || params.reportId.trim() === '') {
    return Effect.fail(new CheckpointError('Report ID is required', '', 'update'));
  }

  if (!params.taskId || params.taskId.trim() === '') {
    return Effect.fail(new CheckpointError('Task ID is required', params.reportId, 'update'));
  }

  if (params.currentTaskIndex < 0) {
    return Effect.fail(new CheckpointError('Current task index must be non-negative', params.reportId, 'update'));
  }

  return Effect.succeed(undefined);
};

/**
 * Creates a generation error with proper typing
 */
export const createGenerationError = (
  message: string,
  code: GenerationErrorCode,
  reportId: string,
  cause?: Error
): GenerationError => new GenerationError(message, code, reportId, cause);

/**
 * Creates a checkpoint error with proper typing
 */
export const createCheckpointError = (
  message: string,
  reportId: string,
  operation: 'create' | 'update' | 'resume' | 'clear',
  cause?: Error
): CheckpointError => new CheckpointError(message, reportId, operation, cause);

/**
 * Determines if a generation state should be persisted
 */
export const shouldPersistGenerationState = (state: ReportGenerationState): boolean => {
  return state.status !== 'ready' && state.status !== 'completed';
};

/**
 * Determines if a checkpoint should be persisted
 */
export const shouldPersistCheckpoint = (checkpoint: ReportCheckpoint): boolean => {
  return checkpoint.status !== 'completed' || checkpoint.completedTasks.length > 0;
};

/**
 * Creates a safe callback wrapper that catches errors
 */
export const safeCallback = <T>(
  callback: ((value: T) => void) | undefined,
  value: T
): Effect.Effect<void, never> => {
  if (!callback) {
    return Effect.succeed(undefined);
  }

  return Effect.try({
    try: () => callback(value),
    catch: (error) => {
      console.error('Callback error:', error);
      return error;
    }
  }).pipe(Effect.ignore);
};

/**
 * Creates a safe callback wrapper for error callbacks
 */
export const safeErrorCallback = (
  callback: ((error: GenerationError) => void) | undefined,
  error: GenerationError
): Effect.Effect<void, never> => {
  if (!callback) {
    return Effect.succeed(undefined);
  }

  return Effect.try({
    try: () => callback(error),
    catch: (callbackError) => {
      console.error('Error callback error:', callbackError);
      return callbackError;
    }
  }).pipe(Effect.ignore);
};

/**
 * Merges multiple table data objects
 */
export const mergeMultipleTableData = (
  tableDataArray: readonly TableData[]
): TableData => {
  if (tableDataArray.length === 0) {
    return { columns: [], results: [], csv: '' };
  }

  if (tableDataArray.length === 1) {
    return tableDataArray[0];
  }

  const first = tableDataArray[0];
  const allResults = tableDataArray.flatMap(td => td.results);

  return {
    columns: first.columns,
    results: allResults,
    csv: generateCsv(first.columns, allResults)
  };
};

/**
 * Filters table data by a predicate
 */
export const filterTableData = (
  tableData: TableData,
  predicate: (row: Record<string, unknown>) => boolean
): TableData => {
  const filteredResults = tableData.results.filter(predicate);

  return {
    columns: tableData.columns,
    results: filteredResults,
    csv: generateCsv(tableData.columns, filteredResults)
  };
};

/**
 * Sorts table data by a column
 */
export const sortTableData = (
  tableData: TableData,
  column: string,
  direction: 'asc' | 'desc' = 'asc'
): TableData => {
  const sortedResults = [...tableData.results].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const comparison = String(aVal).localeCompare(String(bVal));
    return direction === 'asc' ? comparison : -comparison;
  });

  return {
    columns: tableData.columns,
    results: sortedResults,
    csv: generateCsv(tableData.columns, sortedResults)
  };
};
