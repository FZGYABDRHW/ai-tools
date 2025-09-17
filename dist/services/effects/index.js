"use strict";
// ============================================================================
// Effect-based Report Generation Service
// ============================================================================
//
// This module provides a functional, effects-based implementation of the
// report generation service using the Effect library. It replaces the
// class-based, imperative architecture with a functional approach that
// emphasizes:
//
// - Strict typing with no `any` types
// - Pure functions and immutable data
// - Composable effects for side effects
// - Structured error handling
// - Resource management
// - Easy testability
//
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveGenerations = exports.initializeServices = exports.isMigrationNeeded = exports.migrateLegacyData = exports.createReportGenerationServiceAdapter = exports.createReportLogServiceAdapter = exports.createReportCheckpointServiceAdapter = exports.createReportServiceAdapter = exports.ReportGenerationServiceLive = exports.ReportLogServiceLive = exports.ReportCheckpointServiceLive = exports.ReportServiceLive = exports.FileSystemServiceLive = exports.LocalStorageServiceLive = exports.makeReportGenerationService = exports.makeReportLogService = exports.makeReportCheckpointService = exports.makeReportService = exports.sortTableData = exports.filterTableData = exports.mergeMultipleTableData = exports.safeErrorCallback = exports.safeCallback = exports.shouldPersistCheckpoint = exports.shouldPersistGenerationState = exports.createCheckpointError = exports.createGenerationError = exports.validateUpdateCheckpointParams = exports.validateCheckpointParams = exports.calculateEstimatedTimeRemaining = exports.calculateCheckpointProgress = exports.calculateResumeOffset = exports.resumeCheckpointState = exports.markCheckpointPausedState = exports.markCheckpointFailedState = exports.markCheckpointCompletedState = exports.updateCheckpointState = exports.createCheckpointState = exports.validateGenerationParams = exports.canRestartGeneration = exports.canResumeGeneration = exports.isGeneratingState = exports.calculateProgress = exports.generateCsv = exports.mergeTableData = exports.updateGenerationExtractedParameters = exports.updateGenerationTableData = exports.updateGenerationProgress = exports.updateGenerationStatusState = exports.createGenerationState = void 0;
exports.effectUtils = exports.errorHandlers = exports.checkServiceHealth = exports.initializeReportGenerationServices = exports.createReportGenerationRuntime = exports.defaultRuntime = exports.createRuntime = exports.createSafeWrapper = exports.createEffectWrapper = exports.getServiceHealth = exports.checkMigrationNeeded = exports.handleCheckpointError = exports.handleStorageError = exports.handleGenerationError = exports.createReportLogFromGeneration = exports.apiGetResumeOffset = exports.apiClearCheckpoint = exports.apiResumeCheckpoint = exports.markCheckpointPaused = exports.markCheckpointFailed = exports.markCheckpointCompleted = exports.apiUpdateCheckpoint = exports.apiCreateCheckpoint = exports.apiCanResume = exports.apiHasCheckpoint = exports.apiGetCheckpoint = exports.apiClearReportData = exports.apiSaveReportData = exports.apiCreateReport = exports.apiGetReportById = exports.resumeGeneration = exports.reconnectToGeneration = exports.clearAllGenerations = exports.clearAllReportData = exports.clearExtractedParameters = exports.clearGeneration = exports.stopGeneration = exports.startGeneration = exports.restartFromFailed = exports.rerunFromCompleted = exports.setToCompleted = exports.setToPaused = exports.resetToReady = exports.updateGenerationStatus = exports.getGenerationStatus = exports.isGenerating = exports.clearGenerationCallbacks = exports.getGenerationCallbacks = exports.setGenerationCallbacks = exports.getGenerationState = void 0;
// Export pure business logic functions (excluding duplicates)
var pure_1 = require("./pure");
Object.defineProperty(exports, "createGenerationState", { enumerable: true, get: function () { return pure_1.createGenerationState; } });
Object.defineProperty(exports, "updateGenerationStatusState", { enumerable: true, get: function () { return pure_1.updateGenerationStatus; } });
Object.defineProperty(exports, "updateGenerationProgress", { enumerable: true, get: function () { return pure_1.updateGenerationProgress; } });
Object.defineProperty(exports, "updateGenerationTableData", { enumerable: true, get: function () { return pure_1.updateGenerationTableData; } });
Object.defineProperty(exports, "updateGenerationExtractedParameters", { enumerable: true, get: function () { return pure_1.updateGenerationExtractedParameters; } });
Object.defineProperty(exports, "mergeTableData", { enumerable: true, get: function () { return pure_1.mergeTableData; } });
Object.defineProperty(exports, "generateCsv", { enumerable: true, get: function () { return pure_1.generateCsv; } });
Object.defineProperty(exports, "calculateProgress", { enumerable: true, get: function () { return pure_1.calculateProgress; } });
Object.defineProperty(exports, "isGeneratingState", { enumerable: true, get: function () { return pure_1.isGenerating; } });
Object.defineProperty(exports, "canResumeGeneration", { enumerable: true, get: function () { return pure_1.canResumeGeneration; } });
Object.defineProperty(exports, "canRestartGeneration", { enumerable: true, get: function () { return pure_1.canRestartGeneration; } });
Object.defineProperty(exports, "validateGenerationParams", { enumerable: true, get: function () { return pure_1.validateGenerationParams; } });
Object.defineProperty(exports, "createCheckpointState", { enumerable: true, get: function () { return pure_1.createCheckpoint; } });
Object.defineProperty(exports, "updateCheckpointState", { enumerable: true, get: function () { return pure_1.updateCheckpoint; } });
Object.defineProperty(exports, "markCheckpointCompletedState", { enumerable: true, get: function () { return pure_1.markCheckpointCompleted; } });
Object.defineProperty(exports, "markCheckpointFailedState", { enumerable: true, get: function () { return pure_1.markCheckpointFailed; } });
Object.defineProperty(exports, "markCheckpointPausedState", { enumerable: true, get: function () { return pure_1.markCheckpointPaused; } });
Object.defineProperty(exports, "resumeCheckpointState", { enumerable: true, get: function () { return pure_1.resumeCheckpoint; } });
Object.defineProperty(exports, "calculateResumeOffset", { enumerable: true, get: function () { return pure_1.calculateResumeOffset; } });
Object.defineProperty(exports, "calculateCheckpointProgress", { enumerable: true, get: function () { return pure_1.calculateCheckpointProgress; } });
Object.defineProperty(exports, "calculateEstimatedTimeRemaining", { enumerable: true, get: function () { return pure_1.calculateEstimatedTimeRemaining; } });
Object.defineProperty(exports, "validateCheckpointParams", { enumerable: true, get: function () { return pure_1.validateCheckpointParams; } });
Object.defineProperty(exports, "validateUpdateCheckpointParams", { enumerable: true, get: function () { return pure_1.validateUpdateCheckpointParams; } });
Object.defineProperty(exports, "createGenerationError", { enumerable: true, get: function () { return pure_1.createGenerationError; } });
Object.defineProperty(exports, "createCheckpointError", { enumerable: true, get: function () { return pure_1.createCheckpointError; } });
Object.defineProperty(exports, "shouldPersistGenerationState", { enumerable: true, get: function () { return pure_1.shouldPersistGenerationState; } });
Object.defineProperty(exports, "shouldPersistCheckpoint", { enumerable: true, get: function () { return pure_1.shouldPersistCheckpoint; } });
Object.defineProperty(exports, "safeCallback", { enumerable: true, get: function () { return pure_1.safeCallback; } });
Object.defineProperty(exports, "safeErrorCallback", { enumerable: true, get: function () { return pure_1.safeErrorCallback; } });
Object.defineProperty(exports, "mergeMultipleTableData", { enumerable: true, get: function () { return pure_1.mergeMultipleTableData; } });
Object.defineProperty(exports, "filterTableData", { enumerable: true, get: function () { return pure_1.filterTableData; } });
Object.defineProperty(exports, "sortTableData", { enumerable: true, get: function () { return pure_1.sortTableData; } });
// Export service implementations (excluding ServicesLayer)
var implementations_1 = require("./implementations");
Object.defineProperty(exports, "makeReportService", { enumerable: true, get: function () { return implementations_1.makeReportService; } });
Object.defineProperty(exports, "makeReportCheckpointService", { enumerable: true, get: function () { return implementations_1.makeReportCheckpointService; } });
Object.defineProperty(exports, "makeReportLogService", { enumerable: true, get: function () { return implementations_1.makeReportLogService; } });
Object.defineProperty(exports, "makeReportGenerationService", { enumerable: true, get: function () { return implementations_1.makeReportGenerationService; } });
Object.defineProperty(exports, "LocalStorageServiceLive", { enumerable: true, get: function () { return implementations_1.LocalStorageServiceLive; } });
Object.defineProperty(exports, "FileSystemServiceLive", { enumerable: true, get: function () { return implementations_1.FileSystemServiceLive; } });
Object.defineProperty(exports, "ReportServiceLive", { enumerable: true, get: function () { return implementations_1.ReportServiceLive; } });
Object.defineProperty(exports, "ReportCheckpointServiceLive", { enumerable: true, get: function () { return implementations_1.ReportCheckpointServiceLive; } });
Object.defineProperty(exports, "ReportLogServiceLive", { enumerable: true, get: function () { return implementations_1.ReportLogServiceLive; } });
Object.defineProperty(exports, "ReportGenerationServiceLive", { enumerable: true, get: function () { return implementations_1.ReportGenerationServiceLive; } });
// Export integration adapters
var adapters_1 = require("./adapters");
Object.defineProperty(exports, "createReportServiceAdapter", { enumerable: true, get: function () { return adapters_1.createReportServiceAdapter; } });
Object.defineProperty(exports, "createReportCheckpointServiceAdapter", { enumerable: true, get: function () { return adapters_1.createReportCheckpointServiceAdapter; } });
Object.defineProperty(exports, "createReportLogServiceAdapter", { enumerable: true, get: function () { return adapters_1.createReportLogServiceAdapter; } });
Object.defineProperty(exports, "createReportGenerationServiceAdapter", { enumerable: true, get: function () { return adapters_1.createReportGenerationServiceAdapter; } });
Object.defineProperty(exports, "migrateLegacyData", { enumerable: true, get: function () { return adapters_1.migrateLegacyData; } });
Object.defineProperty(exports, "isMigrationNeeded", { enumerable: true, get: function () { return adapters_1.isMigrationNeeded; } });
// Export public API
var api_1 = require("./api");
Object.defineProperty(exports, "initializeServices", { enumerable: true, get: function () { return api_1.initializeServices; } });
Object.defineProperty(exports, "getActiveGenerations", { enumerable: true, get: function () { return api_1.getActiveGenerations; } });
Object.defineProperty(exports, "getGenerationState", { enumerable: true, get: function () { return api_1.getGenerationState; } });
Object.defineProperty(exports, "setGenerationCallbacks", { enumerable: true, get: function () { return api_1.setGenerationCallbacks; } });
Object.defineProperty(exports, "getGenerationCallbacks", { enumerable: true, get: function () { return api_1.getGenerationCallbacks; } });
Object.defineProperty(exports, "clearGenerationCallbacks", { enumerable: true, get: function () { return api_1.clearGenerationCallbacks; } });
Object.defineProperty(exports, "isGenerating", { enumerable: true, get: function () { return api_1.isGenerating; } });
Object.defineProperty(exports, "getGenerationStatus", { enumerable: true, get: function () { return api_1.getGenerationStatus; } });
Object.defineProperty(exports, "updateGenerationStatus", { enumerable: true, get: function () { return api_1.updateGenerationStatus; } });
Object.defineProperty(exports, "resetToReady", { enumerable: true, get: function () { return api_1.resetToReady; } });
Object.defineProperty(exports, "setToPaused", { enumerable: true, get: function () { return api_1.setToPaused; } });
Object.defineProperty(exports, "setToCompleted", { enumerable: true, get: function () { return api_1.setToCompleted; } });
Object.defineProperty(exports, "rerunFromCompleted", { enumerable: true, get: function () { return api_1.rerunFromCompleted; } });
Object.defineProperty(exports, "restartFromFailed", { enumerable: true, get: function () { return api_1.restartFromFailed; } });
Object.defineProperty(exports, "startGeneration", { enumerable: true, get: function () { return api_1.startGeneration; } });
Object.defineProperty(exports, "stopGeneration", { enumerable: true, get: function () { return api_1.stopGeneration; } });
Object.defineProperty(exports, "clearGeneration", { enumerable: true, get: function () { return api_1.clearGeneration; } });
Object.defineProperty(exports, "clearExtractedParameters", { enumerable: true, get: function () { return api_1.clearExtractedParameters; } });
Object.defineProperty(exports, "clearAllReportData", { enumerable: true, get: function () { return api_1.clearAllReportData; } });
Object.defineProperty(exports, "clearAllGenerations", { enumerable: true, get: function () { return api_1.clearAllGenerations; } });
Object.defineProperty(exports, "reconnectToGeneration", { enumerable: true, get: function () { return api_1.reconnectToGeneration; } });
Object.defineProperty(exports, "resumeGeneration", { enumerable: true, get: function () { return api_1.resumeGeneration; } });
Object.defineProperty(exports, "apiGetReportById", { enumerable: true, get: function () { return api_1.getReportById; } });
Object.defineProperty(exports, "apiCreateReport", { enumerable: true, get: function () { return api_1.createReport; } });
Object.defineProperty(exports, "apiSaveReportData", { enumerable: true, get: function () { return api_1.saveReportData; } });
Object.defineProperty(exports, "apiClearReportData", { enumerable: true, get: function () { return api_1.clearReportData; } });
Object.defineProperty(exports, "apiGetCheckpoint", { enumerable: true, get: function () { return api_1.getCheckpoint; } });
Object.defineProperty(exports, "apiHasCheckpoint", { enumerable: true, get: function () { return api_1.hasCheckpoint; } });
Object.defineProperty(exports, "apiCanResume", { enumerable: true, get: function () { return api_1.canResume; } });
Object.defineProperty(exports, "apiCreateCheckpoint", { enumerable: true, get: function () { return api_1.createCheckpoint; } });
Object.defineProperty(exports, "apiUpdateCheckpoint", { enumerable: true, get: function () { return api_1.updateCheckpoint; } });
Object.defineProperty(exports, "markCheckpointCompleted", { enumerable: true, get: function () { return api_1.markCheckpointCompleted; } });
Object.defineProperty(exports, "markCheckpointFailed", { enumerable: true, get: function () { return api_1.markCheckpointFailed; } });
Object.defineProperty(exports, "markCheckpointPaused", { enumerable: true, get: function () { return api_1.markCheckpointPaused; } });
Object.defineProperty(exports, "apiResumeCheckpoint", { enumerable: true, get: function () { return api_1.resumeCheckpoint; } });
Object.defineProperty(exports, "apiClearCheckpoint", { enumerable: true, get: function () { return api_1.clearCheckpoint; } });
Object.defineProperty(exports, "apiGetResumeOffset", { enumerable: true, get: function () { return api_1.getResumeOffset; } });
Object.defineProperty(exports, "createReportLogFromGeneration", { enumerable: true, get: function () { return api_1.createReportLogFromGeneration; } });
Object.defineProperty(exports, "handleGenerationError", { enumerable: true, get: function () { return api_1.handleGenerationError; } });
Object.defineProperty(exports, "handleStorageError", { enumerable: true, get: function () { return api_1.handleStorageError; } });
Object.defineProperty(exports, "handleCheckpointError", { enumerable: true, get: function () { return api_1.handleCheckpointError; } });
Object.defineProperty(exports, "checkMigrationNeeded", { enumerable: true, get: function () { return api_1.checkMigrationNeeded; } });
Object.defineProperty(exports, "getServiceHealth", { enumerable: true, get: function () { return api_1.getServiceHealth; } });
Object.defineProperty(exports, "createEffectWrapper", { enumerable: true, get: function () { return api_1.createEffectWrapper; } });
Object.defineProperty(exports, "createSafeWrapper", { enumerable: true, get: function () { return api_1.createSafeWrapper; } });
// Export context and runtime setup
var context_1 = require("./context");
Object.defineProperty(exports, "createRuntime", { enumerable: true, get: function () { return context_1.createRuntime; } });
Object.defineProperty(exports, "defaultRuntime", { enumerable: true, get: function () { return context_1.defaultRuntime; } });
// ============================================================================
// Main Service Factory
// ============================================================================
const effect_1 = require("effect");
const api_2 = require("./api");
/**
 * Create a new runtime instance with all services
 */
const createReportGenerationRuntime = () => effect_1.Runtime.make({
    context: effect_1.Context.empty(),
    runtimeFlags: effect_1.RuntimeFlags.none,
    fiberRefs: effect_1.FiberRefs.empty()
});
exports.createReportGenerationRuntime = createReportGenerationRuntime;
/**
 * Default runtime instance (re-exported from context)
 */
/**
 * Initialize the services and migrate legacy data if needed
 * Call this once at application startup
 */
exports.initializeReportGenerationServices = api_2.initializeServices;
// ============================================================================
// Service Health Check
// ============================================================================
const api_3 = require("./api");
/**
 * Check the health of all services
 */
exports.checkServiceHealth = api_3.getServiceHealth;
/**
 * Check if migration from legacy services is needed (re-exported from adapters)
 */
// ============================================================================
// Error Handling
// ============================================================================
const api_4 = require("./api");
/**
 * Error handlers for different error types
 */
exports.errorHandlers = {
    generation: api_4.handleGenerationError,
    storage: api_4.handleStorageError,
    checkpoint: api_4.handleCheckpointError
};
// ============================================================================
// Utility Functions
// ============================================================================
const api_5 = require("./api");
/**
 * Utility functions for working with Effects in React components
 */
exports.effectUtils = {
    createWrapper: api_5.createEffectWrapper,
    createSafeWrapper: api_5.createSafeWrapper
};
//# sourceMappingURL=index.js.map