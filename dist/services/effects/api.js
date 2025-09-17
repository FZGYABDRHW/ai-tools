"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSafeWrapper = exports.createEffectWrapper = exports.getServiceHealth = exports.checkMigrationNeeded = exports.handleCheckpointError = exports.handleStorageError = exports.handleGenerationError = exports.createReportLogFromGeneration = exports.getResumeOffset = exports.clearCheckpoint = exports.resumeCheckpoint = exports.markCheckpointPaused = exports.markCheckpointFailed = exports.markCheckpointCompleted = exports.updateCheckpoint = exports.createCheckpoint = exports.canResume = exports.hasCheckpoint = exports.getCheckpoint = exports.clearReportData = exports.saveReportData = exports.createReport = exports.getReportById = exports.resumeGeneration = exports.reconnectToGeneration = exports.clearAllGenerations = exports.clearAllReportData = exports.clearExtractedParameters = exports.clearGeneration = exports.stopGeneration = exports.startGeneration = exports.restartFromFailed = exports.rerunFromCompleted = exports.setToCompleted = exports.setToPaused = exports.resetToReady = exports.updateGenerationStatus = exports.getGenerationStatus = exports.isGenerating = exports.clearGenerationCallbacks = exports.getGenerationCallbacks = exports.setGenerationCallbacks = exports.getGenerationState = exports.getActiveGenerations = exports.initializeServices = void 0;
const effect_1 = require("effect");
const types_1 = require("./types");
const adapters_1 = require("./adapters");
// ============================================================================
// Runtime Setup
// ============================================================================
// Create runtime with adapter services for backward compatibility
const createAdapterServicesLayer = () => {
    return effect_1.Layer.mergeAll(effect_1.Layer.succeed(types_1.ReportService, (0, adapters_1.createReportServiceAdapter)()), effect_1.Layer.succeed(types_1.ReportCheckpointService, (0, adapters_1.createReportCheckpointServiceAdapter)()), effect_1.Layer.succeed(types_1.ReportLogService, (0, adapters_1.createReportLogServiceAdapter)()), effect_1.Layer.succeed(types_1.ReportGenerationService, (0, adapters_1.createReportGenerationServiceAdapter)()));
};
const runtime = effect_1.Runtime.make({
    context: effect_1.Context.empty(),
    runtimeFlags: effect_1.RuntimeFlags.none,
    fiberRefs: effect_1.FiberRefs.empty()
});
// ============================================================================
// Public API Functions
// ============================================================================
/**
 * Initialize the Effect-based services and migrate legacy data if needed
 */
const initializeServices = () => {
    return effect_1.Runtime.runPromise(runtime)((0, effect_1.pipe)(effect_1.Effect.sync(() => {
        if ((0, adapters_1.isMigrationNeeded)()) {
            console.log('Migrating legacy data to new format...');
        }
    }), effect_1.Effect.flatMap(() => (0, adapters_1.migrateLegacyData)()), effect_1.Effect.catchAll((error) => {
        console.error('Migration failed:', error);
        return effect_1.Effect.succeed(undefined);
    })));
};
exports.initializeServices = initializeServices;
// ============================================================================
// Report Generation Service API
// ============================================================================
/**
 * Get all active generation states
 */
const getActiveGenerations = () => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.getActiveGenerations();
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.getActiveGenerations = getActiveGenerations;
/**
 * Get generation state for a specific report
 */
const getGenerationState = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.getGenerationState(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.getGenerationState = getGenerationState;
/**
 * Set callbacks for a generation
 */
const setGenerationCallbacks = (reportId, callbacks) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.setCallbacks(reportId, callbacks);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.setGenerationCallbacks = setGenerationCallbacks;
/**
 * Get callbacks for a generation
 */
const getGenerationCallbacks = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.getCallbacks(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.getGenerationCallbacks = getGenerationCallbacks;
/**
 * Clear callbacks for a generation
 */
const clearGenerationCallbacks = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.clearCallbacks(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.clearGenerationCallbacks = clearGenerationCallbacks;
/**
 * Check if a report is currently generating
 */
const isGenerating = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.isGenerating(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.isGenerating = isGenerating;
/**
 * Get generation status for a report
 */
const getGenerationStatus = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.getGenerationStatus(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.getGenerationStatus = getGenerationStatus;
/**
 * Update generation status
 */
const updateGenerationStatus = (reportId, status, errorMessage) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.updateGenerationStatus(reportId, status, errorMessage);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.updateGenerationStatus = updateGenerationStatus;
/**
 * Reset a report to ready state
 */
const resetToReady = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.resetToReady(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.resetToReady = resetToReady;
/**
 * Set generation to paused state
 */
const setToPaused = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.setToPaused(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.setToPaused = setToPaused;
/**
 * Set generation to completed state
 */
const setToCompleted = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.setToCompleted(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.setToCompleted = setToCompleted;
/**
 * Rerun a completed generation
 */
const rerunFromCompleted = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.rerunFromCompleted(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.rerunFromCompleted = rerunFromCompleted;
/**
 * Restart a failed generation
 */
const restartFromFailed = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.restartFromFailed(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.restartFromFailed = restartFromFailed;
/**
 * Start a new generation
 */
const startGeneration = (params) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.startGeneration(params);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.startGeneration = startGeneration;
/**
 * Stop a running generation
 */
const stopGeneration = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.stopGeneration(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.stopGeneration = stopGeneration;
/**
 * Clear generation state
 */
const clearGeneration = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.clearGeneration(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.clearGeneration = clearGeneration;
/**
 * Clear extracted parameters
 */
const clearExtractedParameters = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.clearExtractedParameters(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.clearExtractedParameters = clearExtractedParameters;
/**
 * Clear all report data
 */
const clearAllReportData = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.clearAllReportData(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.clearAllReportData = clearAllReportData;
/**
 * Clear all generations
 */
const clearAllGenerations = () => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.clearAllGenerations();
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.clearAllGenerations = clearAllGenerations;
/**
 * Reconnect to a running generation
 */
const reconnectToGeneration = (reportId, callbacks) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.reconnectToGeneration(reportId, callbacks);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.reconnectToGeneration = reconnectToGeneration;
/**
 * Resume a paused generation
 */
const resumeGeneration = (params) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportGenerationService;
        return yield* service.resumeGeneration(params);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.resumeGeneration = resumeGeneration;
// ============================================================================
// Report Service API
// ============================================================================
/**
 * Get report by ID
 */
const getReportById = (id) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportService;
        return yield* service.getReportById(id);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.getReportById = getReportById;
/**
 * Create a new report
 */
const createReport = (request) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportService;
        return yield* service.createReport(request);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.createReport = createReport;
/**
 * Save report data
 */
const saveReportData = (id, tableData, extractedParameters) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportService;
        return yield* service.saveReportData(id, tableData, extractedParameters);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.saveReportData = saveReportData;
/**
 * Clear report data
 */
const clearReportData = (id) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportService;
        return yield* service.clearReportData(id);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.clearReportData = clearReportData;
// ============================================================================
// Report Checkpoint Service API
// ============================================================================
/**
 * Get checkpoint for a report
 */
const getCheckpoint = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.getCheckpoint(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.getCheckpoint = getCheckpoint;
/**
 * Check if checkpoint exists
 */
const hasCheckpoint = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.hasCheckpoint(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.hasCheckpoint = hasCheckpoint;
/**
 * Check if generation can be resumed
 */
const canResume = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.canResume(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.canResume = canResume;
/**
 * Create a new checkpoint
 */
const createCheckpoint = (params) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.createCheckpoint(params);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.createCheckpoint = createCheckpoint;
/**
 * Update checkpoint
 */
const updateCheckpoint = (params) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.updateCheckpoint(params);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.updateCheckpoint = updateCheckpoint;
/**
 * Mark checkpoint as completed
 */
const markCheckpointCompleted = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.markCompleted(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.markCheckpointCompleted = markCheckpointCompleted;
/**
 * Mark checkpoint as failed
 */
const markCheckpointFailed = (reportId, errorMessage) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.markFailed(reportId, errorMessage);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.markCheckpointFailed = markCheckpointFailed;
/**
 * Mark checkpoint as paused
 */
const markCheckpointPaused = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.markPaused(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.markCheckpointPaused = markCheckpointPaused;
/**
 * Resume checkpoint
 */
const resumeCheckpoint = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.resumeCheckpoint(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.resumeCheckpoint = resumeCheckpoint;
/**
 * Clear checkpoint
 */
const clearCheckpoint = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.clearCheckpoint(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.clearCheckpoint = clearCheckpoint;
/**
 * Get resume offset
 */
const getResumeOffset = (reportId) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportCheckpointService;
        return yield* service.getResumeOffset(reportId);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.getResumeOffset = getResumeOffset;
// ============================================================================
// Report Log Service API
// ============================================================================
/**
 * Create report log from generation
 */
const createReportLogFromGeneration = (params) => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const service = yield* types_1.ReportLogService;
        return yield* service.createFromReportGeneration(params);
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.createReportLogFromGeneration = createReportLogFromGeneration;
// ============================================================================
// Error Handling Helpers
// ============================================================================
/**
 * Handle generation errors with proper logging
 */
const handleGenerationError = (error) => {
    console.error(`Generation Error [${error.code}] for report ${error.reportId}:`, error.message);
    if (error.cause) {
        console.error('Caused by:', error.cause);
    }
};
exports.handleGenerationError = handleGenerationError;
/**
 * Handle storage errors with proper logging
 */
const handleStorageError = (error) => {
    console.error(`Storage Error [${error.operation}] for key ${error.key}:`, error.message);
    if (error.cause) {
        console.error('Caused by:', error.cause);
    }
};
exports.handleStorageError = handleStorageError;
/**
 * Handle checkpoint errors with proper logging
 */
const handleCheckpointError = (error) => {
    console.error(`Checkpoint Error [${error.operation}] for report ${error.reportId}:`, error.message);
    if (error.cause) {
        console.error('Caused by:', error.cause);
    }
};
exports.handleCheckpointError = handleCheckpointError;
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Check if migration is needed
 */
const checkMigrationNeeded = () => {
    return (0, adapters_1.isMigrationNeeded)();
};
exports.checkMigrationNeeded = checkMigrationNeeded;
/**
 * Get service health status
 */
const getServiceHealth = () => {
    return effect_1.Runtime.runPromise(runtime)(effect_1.Effect.gen(function* () {
        const reportGeneration = yield* effect_1.Effect.gen(function* () {
            yield* types_1.ReportGenerationService;
            return true;
        }).pipe(effect_1.Effect.catchAll(() => effect_1.Effect.succeed(false)));
        const reportService = yield* effect_1.Effect.gen(function* () {
            yield* types_1.ReportService;
            return true;
        }).pipe(effect_1.Effect.catchAll(() => effect_1.Effect.succeed(false)));
        const checkpointService = yield* effect_1.Effect.gen(function* () {
            yield* types_1.ReportCheckpointService;
            return true;
        }).pipe(effect_1.Effect.catchAll(() => effect_1.Effect.succeed(false)));
        const logService = yield* effect_1.Effect.gen(function* () {
            yield* types_1.ReportLogService;
            return true;
        }).pipe(effect_1.Effect.catchAll(() => effect_1.Effect.succeed(false)));
        return {
            reportGeneration,
            reportService,
            checkpointService,
            logService
        };
    }).pipe(effect_1.Effect.provide(createAdapterServicesLayer())));
};
exports.getServiceHealth = getServiceHealth;
// ============================================================================
// React Hook Helpers (for future use)
// ============================================================================
/**
 * Create a promise-based wrapper for Effect operations
 * This can be used in React components
 */
const createEffectWrapper = (effect) => {
    return effect_1.Runtime.runPromise(runtime)(effect);
};
exports.createEffectWrapper = createEffectWrapper;
/**
 * Create a safe wrapper that catches all errors
 */
const createSafeWrapper = (effect) => {
    return effect_1.Runtime.runPromise(runtime)(effect.pipe(effect_1.Effect.catchAll((error) => {
        console.error('Effect error:', error);
        return effect_1.Effect.succeed(null);
    })));
};
exports.createSafeWrapper = createSafeWrapper;
//# sourceMappingURL=api.js.map