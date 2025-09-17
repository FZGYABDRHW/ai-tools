"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRuntime = exports.createRuntime = exports.ServicesLayer = void 0;
const effect_1 = require("effect");
const types_1 = require("./types");
// ============================================================================
// Local Storage Service Implementation
// ============================================================================
const makeLocalStorageService = () => ({
    getItem: (key) => effect_1.Effect.try({
        try: () => localStorage.getItem(key),
        catch: (error) => new types_1.StorageError(`Failed to get item from localStorage: ${key}`, 'read', key, error)
    }),
    setItem: (key, value) => effect_1.Effect.try({
        try: () => localStorage.setItem(key, value),
        catch: (error) => new types_1.StorageError(`Failed to set item in localStorage: ${key}`, 'write', key, error)
    }),
    removeItem: (key) => effect_1.Effect.try({
        try: () => localStorage.removeItem(key),
        catch: (error) => new types_1.StorageError(`Failed to remove item from localStorage: ${key}`, 'delete', key, error)
    })
});
const LocalStorageServiceLive = effect_1.Layer.succeed(types_1.LocalStorageService, makeLocalStorageService());
// ============================================================================
// File System Service Implementation
// ============================================================================
const makeFileSystemService = () => ({
    saveGenerationState: (reportId, state) => effect_1.Effect.tryPromise({
        try: async () => {
            if (window.electronAPI?.fileSystem?.saveGenerationState) {
                return await window.electronAPI.fileSystem.saveGenerationState(reportId, state);
            }
            return false;
        },
        catch: (error) => new types_1.StorageError(`Failed to save generation state: ${reportId}`, 'write', reportId, error)
    }),
    deleteGenerationState: (reportId) => effect_1.Effect.tryPromise({
        try: async () => {
            if (window.electronAPI?.fileSystem?.deleteGenerationState) {
                return await window.electronAPI.fileSystem.deleteGenerationState(reportId);
            }
            return false;
        },
        catch: (error) => new types_1.StorageError(`Failed to delete generation state: ${reportId}`, 'delete', reportId, error)
    }),
    saveCheckpoint: (reportId, checkpoint) => effect_1.Effect.tryPromise({
        try: async () => {
            if (window.electronAPI?.fileSystem?.saveCheckpoint) {
                return await window.electronAPI.fileSystem.saveCheckpoint(reportId, checkpoint);
            }
            return false;
        },
        catch: (error) => new types_1.StorageError(`Failed to save checkpoint: ${reportId}`, 'write', reportId, error)
    }),
    deleteCheckpoint: (reportId) => effect_1.Effect.tryPromise({
        try: async () => {
            if (window.electronAPI?.fileSystem?.deleteCheckpoint) {
                return await window.electronAPI.fileSystem.deleteCheckpoint(reportId);
            }
            return false;
        },
        catch: (error) => new types_1.StorageError(`Failed to delete checkpoint: ${reportId}`, 'delete', reportId, error)
    }),
    saveReportLog: (reportLog) => effect_1.Effect.tryPromise({
        try: async () => {
            if (window.electronAPI?.fileSystem?.saveReportLog) {
                return await window.electronAPI.fileSystem.saveReportLog(reportLog);
            }
            return false;
        },
        catch: (error) => new types_1.StorageError(`Failed to save report log: ${reportLog.id}`, 'write', reportLog.id, error)
    }),
    deleteReportLog: (id) => effect_1.Effect.tryPromise({
        try: async () => {
            if (window.electronAPI?.fileSystem?.deleteReportLog) {
                return await window.electronAPI.fileSystem.deleteReportLog(id);
            }
            return false;
        },
        catch: (error) => new types_1.StorageError(`Failed to delete report log: ${id}`, 'delete', id, error)
    })
});
const FileSystemServiceLive = effect_1.Layer.succeed(types_1.FileSystemService, makeFileSystemService());
// ============================================================================
// Report Service Implementation
// ============================================================================
const makeReportService = () => ({
    getReportById: (id) => effect_1.Effect.sync(() => {
        // This would integrate with the existing reportService
        // For now, return null as a placeholder
        return null;
    }),
    createReport: (request) => effect_1.Effect.fail(new types_1.GenerationError('Not implemented', 'UNKNOWN_ERROR', '')),
    saveReportData: (id, tableData, extractedParameters) => effect_1.Effect.fail(new types_1.StorageError('Not implemented', 'write', id)),
    clearReportData: (id) => effect_1.Effect.fail(new types_1.StorageError('Not implemented', 'delete', id))
});
const ReportServiceLive = effect_1.Layer.succeed(types_1.ReportService, makeReportService());
// ============================================================================
// Report Checkpoint Service Implementation
// ============================================================================
const makeReportCheckpointService = () => ({
    getCheckpoint: (reportId) => effect_1.Effect.sync(() => null),
    hasCheckpoint: (reportId) => effect_1.Effect.sync(() => false),
    canResume: (reportId) => effect_1.Effect.sync(() => false),
    createCheckpoint: (params) => effect_1.Effect.fail(new types_1.CheckpointError('Not implemented', params.reportId, 'create')),
    updateCheckpoint: (params) => effect_1.Effect.fail(new types_1.CheckpointError('Not implemented', params.reportId, 'update')),
    markCompleted: (reportId) => effect_1.Effect.fail(new types_1.CheckpointError('Not implemented', reportId, 'update')),
    markFailed: (reportId, errorMessage) => effect_1.Effect.fail(new types_1.CheckpointError('Not implemented', reportId, 'update')),
    markPaused: (reportId) => effect_1.Effect.fail(new types_1.CheckpointError('Not implemented', reportId, 'update')),
    resumeCheckpoint: (reportId) => effect_1.Effect.fail(new types_1.CheckpointError('Not implemented', reportId, 'resume')),
    clearCheckpoint: (reportId) => effect_1.Effect.fail(new types_1.CheckpointError('Not implemented', reportId, 'clear')),
    getResumeOffset: (reportId) => effect_1.Effect.sync(() => 0)
});
const ReportCheckpointServiceLive = effect_1.Layer.succeed(types_1.ReportCheckpointService, makeReportCheckpointService());
// ============================================================================
// Report Log Service Implementation
// ============================================================================
const makeReportLogService = () => ({
    createFromReportGeneration: (params) => effect_1.Effect.fail(new types_1.StorageError('Not implemented', 'write', params.reportId))
});
const ReportLogServiceLive = effect_1.Layer.succeed(types_1.ReportLogService, makeReportLogService());
// ============================================================================
// Report Generation Service Implementation
// ============================================================================
const makeReportGenerationService = () => ({
    getActiveGenerations: () => effect_1.Effect.sync(() => new Map()),
    getGenerationState: (reportId) => effect_1.Effect.sync(() => null),
    setCallbacks: (reportId, callbacks) => effect_1.Effect.sync(() => { }),
    getCallbacks: (reportId) => effect_1.Effect.sync(() => null),
    clearCallbacks: (reportId) => effect_1.Effect.sync(() => { }),
    isGenerating: (reportId) => effect_1.Effect.sync(() => false),
    getGenerationStatus: (reportId) => effect_1.Effect.sync(() => null),
    updateGenerationStatus: (reportId, status, errorMessage) => effect_1.Effect.fail(new types_1.StorageError('Not implemented', 'write', reportId)),
    resetToReady: (reportId) => effect_1.Effect.fail(new types_1.GenerationError('Not implemented', 'UNKNOWN_ERROR', reportId)),
    setToPaused: (reportId) => effect_1.Effect.sync(() => false),
    setToCompleted: (reportId) => effect_1.Effect.sync(() => false),
    rerunFromCompleted: (reportId) => effect_1.Effect.fail(new types_1.GenerationError('Not implemented', 'UNKNOWN_ERROR', reportId)),
    restartFromFailed: (reportId) => effect_1.Effect.fail(new types_1.GenerationError('Not implemented', 'UNKNOWN_ERROR', reportId)),
    startGeneration: (params) => effect_1.Effect.fail(new types_1.GenerationError('Not implemented', 'UNKNOWN_ERROR', params.reportId)),
    stopGeneration: (reportId) => effect_1.Effect.fail(new types_1.GenerationError('Not implemented', 'UNKNOWN_ERROR', reportId)),
    clearGeneration: (reportId) => effect_1.Effect.fail(new types_1.StorageError('Not implemented', 'delete', reportId)),
    clearExtractedParameters: (reportId) => effect_1.Effect.sync(() => { }),
    clearAllReportData: (reportId) => effect_1.Effect.fail(new types_1.GenerationError('Not implemented', 'UNKNOWN_ERROR', reportId)),
    clearAllGenerations: () => effect_1.Effect.sync(() => { }),
    reconnectToGeneration: (reportId, callbacks) => effect_1.Effect.sync(() => false),
    resumeGeneration: (params) => effect_1.Effect.fail(new types_1.GenerationError('Not implemented', 'UNKNOWN_ERROR', params.reportId))
});
const ReportGenerationServiceLive = effect_1.Layer.succeed(types_1.ReportGenerationService, makeReportGenerationService());
// ============================================================================
// Service Layer Composition
// ============================================================================
exports.ServicesLayer = effect_1.Layer.mergeAll(LocalStorageServiceLive, FileSystemServiceLive, ReportServiceLive, ReportCheckpointServiceLive, ReportLogServiceLive, ReportGenerationServiceLive);
// ============================================================================
// Runtime Setup
// ============================================================================
const createRuntime = () => effect_1.Runtime.make({
    context: effect_1.Context.empty(),
    runtimeFlags: effect_1.RuntimeFlags.none,
    fiberRefs: effect_1.FiberRefs.empty()
});
exports.createRuntime = createRuntime;
exports.defaultRuntime = (0, exports.createRuntime)();
//# sourceMappingURL=context.js.map