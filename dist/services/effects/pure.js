"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTableData = exports.filterTableData = exports.mergeMultipleTableData = exports.safeErrorCallback = exports.safeCallback = exports.shouldPersistCheckpoint = exports.shouldPersistGenerationState = exports.createCheckpointError = exports.createGenerationError = exports.validateUpdateCheckpointParams = exports.validateCheckpointParams = exports.calculateEstimatedTimeRemaining = exports.calculateCheckpointProgress = exports.calculateResumeOffset = exports.resumeCheckpoint = exports.markCheckpointPaused = exports.markCheckpointFailed = exports.markCheckpointCompleted = exports.updateCheckpoint = exports.createCheckpoint = exports.validateGenerationParams = exports.canRestartGeneration = exports.canResumeGeneration = exports.isGenerating = exports.calculateProgress = exports.generateCsv = exports.mergeTableData = exports.updateGenerationExtractedParameters = exports.updateGenerationTableData = exports.updateGenerationProgress = exports.updateGenerationStatus = exports.createGenerationState = void 0;
const effect_1 = require("effect");
const types_1 = require("./types");
// ============================================================================
// Pure Business Logic Functions
// ============================================================================
/**
 * Creates a new generation state with the given parameters
 */
const createGenerationState = (reportId, startTime, parameters) => ({
    reportId,
    status: 'preparing',
    progress: null,
    tableData: null,
    startTime,
    parameters
});
exports.createGenerationState = createGenerationState;
/**
 * Updates the status of a generation state
 */
const updateGenerationStatus = (state, status, errorMessage) => ({
    ...state,
    status,
    errorMessage
});
exports.updateGenerationStatus = updateGenerationStatus;
/**
 * Updates the progress of a generation state
 */
const updateGenerationProgress = (state, progress) => ({
    ...state,
    progress
});
exports.updateGenerationProgress = updateGenerationProgress;
/**
 * Updates the table data of a generation state
 */
const updateGenerationTableData = (state, tableData) => ({
    ...state,
    tableData
});
exports.updateGenerationTableData = updateGenerationTableData;
/**
 * Updates the extracted parameters of a generation state
 */
const updateGenerationExtractedParameters = (state, extractedParameters) => ({
    ...state,
    extractedParameters
});
exports.updateGenerationExtractedParameters = updateGenerationExtractedParameters;
/**
 * Merges existing table data with new progress data
 */
const mergeTableData = (existing, newData) => {
    if (!existing) {
        return newData;
    }
    return {
        columns: newData.columns,
        results: [...existing.results, ...newData.results],
        csv: (0, exports.generateCsv)(newData.columns, [...existing.results, ...newData.results])
    };
};
exports.mergeTableData = mergeTableData;
/**
 * Generates CSV content from columns and results
 */
const generateCsv = (columns, results) => {
    const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const header = columns.join(',');
    const body = results
        .map((row) => columns.map((col) => escapeCsv(row[col])).join(','))
        .join('\n');
    return `${header}\n${body}`;
};
exports.generateCsv = generateCsv;
/**
 * Calculates progress information from table data
 */
const calculateProgress = (tableData) => ({
    processed: tableData.results.length,
    total: tableData.results.length
});
exports.calculateProgress = calculateProgress;
/**
 * Checks if a generation state is currently generating
 */
const isGenerating = (state) => {
    if (!state)
        return false;
    return state.status === 'preparing' || state.status === 'in_progress';
};
exports.isGenerating = isGenerating;
/**
 * Checks if a generation can be resumed
 */
const canResumeGeneration = (state) => {
    if (!state)
        return false;
    return state.status === 'paused' || state.status === 'failed';
};
exports.canResumeGeneration = canResumeGeneration;
/**
 * Checks if a generation can be restarted
 */
const canRestartGeneration = (state) => {
    if (!state)
        return false;
    return state.status === 'failed' || state.status === 'completed';
};
exports.canRestartGeneration = canRestartGeneration;
/**
 * Validates generation parameters
 */
const validateGenerationParams = (params) => {
    if (!params.reportId || params.reportId.trim() === '') {
        return effect_1.Effect.fail(new types_1.GenerationError('Report ID is required', 'VALIDATION_ERROR', params.reportId));
    }
    if (!params.reportText || params.reportText.trim() === '') {
        return effect_1.Effect.fail(new types_1.GenerationError('Report text is required', 'VALIDATION_ERROR', params.reportId));
    }
    if (!params.authToken || params.authToken.trim() === '') {
        return effect_1.Effect.fail(new types_1.GenerationError('Auth token is required', 'VALIDATION_ERROR', params.reportId));
    }
    return effect_1.Effect.succeed(undefined);
};
exports.validateGenerationParams = validateGenerationParams;
/**
 * Creates a new checkpoint from parameters
 */
const createCheckpoint = (params) => ({
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
exports.createCheckpoint = createCheckpoint;
/**
 * Updates a checkpoint with new task completion
 */
const updateCheckpoint = (checkpoint, params) => {
    const newCompletedTask = {
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
exports.updateCheckpoint = updateCheckpoint;
/**
 * Marks a checkpoint as completed
 */
const markCheckpointCompleted = (checkpoint) => ({
    ...checkpoint,
    status: 'completed',
    lastCheckpointTime: Date.now()
});
exports.markCheckpointCompleted = markCheckpointCompleted;
/**
 * Marks a checkpoint as failed
 */
const markCheckpointFailed = (checkpoint, errorMessage) => ({
    ...checkpoint,
    status: 'failed',
    errorMessage,
    lastCheckpointTime: Date.now()
});
exports.markCheckpointFailed = markCheckpointFailed;
/**
 * Marks a checkpoint as paused
 */
const markCheckpointPaused = (checkpoint) => ({
    ...checkpoint,
    status: 'paused',
    lastCheckpointTime: Date.now()
});
exports.markCheckpointPaused = markCheckpointPaused;
/**
 * Resumes a paused checkpoint
 */
const resumeCheckpoint = (checkpoint) => ({
    ...checkpoint,
    status: 'in_progress',
    lastCheckpointTime: Date.now()
});
exports.resumeCheckpoint = resumeCheckpoint;
/**
 * Calculates the resume offset for a checkpoint
 */
const calculateResumeOffset = (checkpoint) => {
    const tasksPerPage = 30;
    const completedPages = Math.floor(checkpoint.currentTaskIndex / tasksPerPage);
    return completedPages * tasksPerPage;
};
exports.calculateResumeOffset = calculateResumeOffset;
/**
 * Calculates progress percentage for a checkpoint
 */
const calculateCheckpointProgress = (checkpoint) => {
    if (checkpoint.totalTasks === 0)
        return 0;
    return Math.round((checkpoint.currentTaskIndex / checkpoint.totalTasks) * 100);
};
exports.calculateCheckpointProgress = calculateCheckpointProgress;
/**
 * Calculates estimated time remaining for a checkpoint
 */
const calculateEstimatedTimeRemaining = (checkpoint) => {
    if (checkpoint.currentTaskIndex === 0)
        return 0;
    const elapsed = Date.now() - checkpoint.startTime;
    const avgTimePerTask = elapsed / checkpoint.currentTaskIndex;
    const remainingTasks = checkpoint.totalTasks - checkpoint.currentTaskIndex;
    return Math.round(avgTimePerTask * remainingTasks);
};
exports.calculateEstimatedTimeRemaining = calculateEstimatedTimeRemaining;
/**
 * Validates checkpoint parameters
 */
const validateCheckpointParams = (params) => {
    if (!params.reportId || params.reportId.trim() === '') {
        return effect_1.Effect.fail(new types_1.CheckpointError('Report ID is required', '', 'create'));
    }
    if (!params.prompt || params.prompt.trim() === '') {
        return effect_1.Effect.fail(new types_1.CheckpointError('Prompt is required', params.reportId, 'create'));
    }
    if (params.totalTasks < 0) {
        return effect_1.Effect.fail(new types_1.CheckpointError('Total tasks must be non-negative', params.reportId, 'create'));
    }
    if (params.startTime <= 0) {
        return effect_1.Effect.fail(new types_1.CheckpointError('Start time must be positive', params.reportId, 'create'));
    }
    return effect_1.Effect.succeed(undefined);
};
exports.validateCheckpointParams = validateCheckpointParams;
/**
 * Validates update checkpoint parameters
 */
const validateUpdateCheckpointParams = (params) => {
    if (!params.reportId || params.reportId.trim() === '') {
        return effect_1.Effect.fail(new types_1.CheckpointError('Report ID is required', '', 'update'));
    }
    if (!params.taskId || params.taskId.trim() === '') {
        return effect_1.Effect.fail(new types_1.CheckpointError('Task ID is required', params.reportId, 'update'));
    }
    if (params.currentTaskIndex < 0) {
        return effect_1.Effect.fail(new types_1.CheckpointError('Current task index must be non-negative', params.reportId, 'update'));
    }
    return effect_1.Effect.succeed(undefined);
};
exports.validateUpdateCheckpointParams = validateUpdateCheckpointParams;
/**
 * Creates a generation error with proper typing
 */
const createGenerationError = (message, code, reportId, cause) => new types_1.GenerationError(message, code, reportId, cause);
exports.createGenerationError = createGenerationError;
/**
 * Creates a checkpoint error with proper typing
 */
const createCheckpointError = (message, reportId, operation, cause) => new types_1.CheckpointError(message, reportId, operation, cause);
exports.createCheckpointError = createCheckpointError;
/**
 * Determines if a generation state should be persisted
 */
const shouldPersistGenerationState = (state) => {
    return state.status !== 'ready' && state.status !== 'completed';
};
exports.shouldPersistGenerationState = shouldPersistGenerationState;
/**
 * Determines if a checkpoint should be persisted
 */
const shouldPersistCheckpoint = (checkpoint) => {
    return checkpoint.status !== 'completed' || checkpoint.completedTasks.length > 0;
};
exports.shouldPersistCheckpoint = shouldPersistCheckpoint;
/**
 * Creates a safe callback wrapper that catches errors
 */
const safeCallback = (callback, value) => {
    if (!callback) {
        return effect_1.Effect.succeed(undefined);
    }
    return effect_1.Effect.try({
        try: () => callback(value),
        catch: (error) => {
            console.error('Callback error:', error);
            return error;
        }
    }).pipe(effect_1.Effect.ignore);
};
exports.safeCallback = safeCallback;
/**
 * Creates a safe callback wrapper for error callbacks
 */
const safeErrorCallback = (callback, error) => {
    if (!callback) {
        return effect_1.Effect.succeed(undefined);
    }
    return effect_1.Effect.try({
        try: () => callback(error),
        catch: (callbackError) => {
            console.error('Error callback error:', callbackError);
            return callbackError;
        }
    }).pipe(effect_1.Effect.ignore);
};
exports.safeErrorCallback = safeErrorCallback;
/**
 * Merges multiple table data objects
 */
const mergeMultipleTableData = (tableDataArray) => {
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
        csv: (0, exports.generateCsv)(first.columns, allResults)
    };
};
exports.mergeMultipleTableData = mergeMultipleTableData;
/**
 * Filters table data by a predicate
 */
const filterTableData = (tableData, predicate) => {
    const filteredResults = tableData.results.filter(predicate);
    return {
        columns: tableData.columns,
        results: filteredResults,
        csv: (0, exports.generateCsv)(tableData.columns, filteredResults)
    };
};
exports.filterTableData = filterTableData;
/**
 * Sorts table data by a column
 */
const sortTableData = (tableData, column, direction = 'asc') => {
    const sortedResults = [...tableData.results].sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        if (aVal === bVal)
            return 0;
        if (aVal === null || aVal === undefined)
            return 1;
        if (bVal === null || bVal === undefined)
            return -1;
        const comparison = String(aVal).localeCompare(String(bVal));
        return direction === 'asc' ? comparison : -comparison;
    });
    return {
        columns: tableData.columns,
        results: sortedResults,
        csv: (0, exports.generateCsv)(tableData.columns, sortedResults)
    };
};
exports.sortTableData = sortTableData;
//# sourceMappingURL=pure.js.map