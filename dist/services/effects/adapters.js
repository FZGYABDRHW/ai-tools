"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMigrationNeeded = exports.migrateLegacyData = exports.convertLegacyReportLog = exports.convertLegacyReport = exports.convertLegacyCheckpoint = exports.convertLegacyGenerationState = exports.createReportGenerationServiceAdapter = exports.createReportLogServiceAdapter = exports.createReportCheckpointServiceAdapter = exports.createReportServiceAdapter = void 0;
const effect_1 = require("effect");
const implementations_1 = require("./implementations");
const types_1 = require("./types");
// ============================================================================
// Report Service Adapter
// ============================================================================
const createReportServiceAdapter = () => {
    const service = (0, implementations_1.makeReportService)();
    return {
        getReportById: service.getReportById,
        createReport: service.createReport,
        saveReportData: service.saveReportData,
        clearReportData: service.clearReportData
    };
};
exports.createReportServiceAdapter = createReportServiceAdapter;
// ============================================================================
// Report Checkpoint Service Adapter
// ============================================================================
const createReportCheckpointServiceAdapter = () => {
    const service = (0, implementations_1.makeReportCheckpointService)();
    return {
        getCheckpoint: service.getCheckpoint,
        hasCheckpoint: service.hasCheckpoint,
        canResume: service.canResume,
        createCheckpoint: service.createCheckpoint,
        updateCheckpoint: service.updateCheckpoint,
        markCompleted: service.markCompleted,
        markFailed: service.markFailed,
        markPaused: service.markPaused,
        resumeCheckpoint: service.resumeCheckpoint,
        clearCheckpoint: service.clearCheckpoint,
        getResumeOffset: service.getResumeOffset
    };
};
exports.createReportCheckpointServiceAdapter = createReportCheckpointServiceAdapter;
// ============================================================================
// Report Log Service Adapter
// ============================================================================
const createReportLogServiceAdapter = () => {
    const service = (0, implementations_1.makeReportLogService)();
    return {
        createFromReportGeneration: service.createFromReportGeneration
    };
};
exports.createReportLogServiceAdapter = createReportLogServiceAdapter;
// ============================================================================
// Report Generation Service Adapter
// ============================================================================
const createReportGenerationServiceAdapter = () => {
    const service = (0, implementations_1.makeReportGenerationService)();
    return {
        getActiveGenerations: service.getActiveGenerations,
        getGenerationState: service.getGenerationState,
        setCallbacks: service.setCallbacks,
        getCallbacks: service.getCallbacks,
        clearCallbacks: service.clearCallbacks,
        isGenerating: service.isGenerating,
        getGenerationStatus: service.getGenerationStatus,
        updateGenerationStatus: service.updateGenerationStatus,
        resetToReady: service.resetToReady,
        setToPaused: service.setToPaused,
        setToCompleted: service.setToCompleted,
        rerunFromCompleted: service.rerunFromCompleted,
        restartFromFailed: service.restartFromFailed,
        startGeneration: service.startGeneration,
        stopGeneration: service.stopGeneration,
        clearGeneration: service.clearGeneration,
        clearExtractedParameters: service.clearExtractedParameters,
        clearAllReportData: service.clearAllReportData,
        clearAllGenerations: service.clearAllGenerations,
        reconnectToGeneration: service.reconnectToGeneration,
        resumeGeneration: service.resumeGeneration
    };
};
exports.createReportGenerationServiceAdapter = createReportGenerationServiceAdapter;
// ============================================================================
// Legacy Service Integration Helpers
// ============================================================================
/**
 * Converts legacy generation state to new format
 */
const convertLegacyGenerationState = (legacyState) => {
    if (!legacyState)
        return null;
    return {
        reportId: legacyState.reportId,
        status: legacyState.status || 'ready',
        progress: legacyState.progress || null,
        tableData: legacyState.tableData || null,
        startTime: legacyState.startTime || Date.now(),
        errorMessage: legacyState.errorMessage,
        parameters: legacyState.parameters,
        extractedParameters: legacyState.extractedParameters
    };
};
exports.convertLegacyGenerationState = convertLegacyGenerationState;
/**
 * Converts legacy checkpoint to new format
 */
const convertLegacyCheckpoint = (legacyCheckpoint) => {
    if (!legacyCheckpoint)
        return null;
    return {
        reportId: legacyCheckpoint.reportId,
        prompt: legacyCheckpoint.prompt,
        currentTaskIndex: legacyCheckpoint.currentTaskIndex || 0,
        completedTasks: legacyCheckpoint.completedTasks || [],
        totalTasks: legacyCheckpoint.totalTasks || 0,
        startTime: legacyCheckpoint.startTime || Date.now(),
        lastCheckpointTime: legacyCheckpoint.lastCheckpointTime || Date.now(),
        status: legacyCheckpoint.status || 'in_progress',
        errorMessage: legacyCheckpoint.errorMessage,
        startOffset: legacyCheckpoint.startOffset || 0,
        tableData: legacyCheckpoint.tableData
    };
};
exports.convertLegacyCheckpoint = convertLegacyCheckpoint;
/**
 * Converts legacy report to new format
 */
const convertLegacyReport = (legacyReport) => {
    if (!legacyReport)
        return null;
    return {
        id: legacyReport.id,
        name: legacyReport.name,
        prompt: legacyReport.prompt,
        createdAt: legacyReport.createdAt,
        updatedAt: legacyReport.updatedAt,
        lastGeneratedAt: legacyReport.lastGeneratedAt,
        tableData: legacyReport.tableData,
        extractedParameters: legacyReport.extractedParameters
    };
};
exports.convertLegacyReport = convertLegacyReport;
/**
 * Converts legacy report log to new format
 */
const convertLegacyReportLog = (legacyLog) => {
    if (!legacyLog)
        return null;
    return {
        id: legacyLog.id,
        reportId: legacyLog.reportId,
        reportName: legacyLog.reportName,
        prompt: legacyLog.prompt,
        generatedAt: legacyLog.generatedAt,
        completedAt: legacyLog.completedAt,
        status: legacyLog.status,
        totalTasks: legacyLog.totalTasks,
        processedTasks: legacyLog.processedTasks,
        tableData: legacyLog.tableData,
        extractedParameters: legacyLog.extractedParameters,
        metadata: legacyLog.metadata
    };
};
exports.convertLegacyReportLog = convertLegacyReportLog;
// ============================================================================
// Migration Helpers
// ============================================================================
/**
 * Migrates legacy data to new format
 */
const migrateLegacyData = () => effect_1.Effect.try({
    try: () => {
        // Load legacy data from localStorage
        const legacyGenerations = localStorage.getItem('wowworks_report_generations');
        const legacyCheckpoints = localStorage.getItem('wowworks_report_checkpoints');
        const legacyReports = localStorage.getItem('ai_tools_reports');
        const legacyLogs = localStorage.getItem('wowworks_report_logs');
        // Convert and save in new format
        if (legacyGenerations) {
            try {
                const generations = JSON.parse(legacyGenerations);
                const convertedGenerations = {};
                Object.entries(generations).forEach(([reportId, state]) => {
                    const converted = (0, exports.convertLegacyGenerationState)(state);
                    if (converted) {
                        convertedGenerations[reportId] = converted;
                    }
                });
                localStorage.setItem('wowworks_report_generations_v2', JSON.stringify(convertedGenerations));
            }
            catch (error) {
                console.warn('Failed to migrate generation data:', error);
            }
        }
        if (legacyCheckpoints) {
            try {
                const checkpoints = JSON.parse(legacyCheckpoints);
                const convertedCheckpoints = {};
                Object.entries(checkpoints).forEach(([reportId, checkpoint]) => {
                    const converted = (0, exports.convertLegacyCheckpoint)(checkpoint);
                    if (converted) {
                        convertedCheckpoints[reportId] = converted;
                    }
                });
                localStorage.setItem('wowworks_report_checkpoints_v2', JSON.stringify(convertedCheckpoints));
            }
            catch (error) {
                console.warn('Failed to migrate checkpoint data:', error);
            }
        }
        if (legacyReports) {
            try {
                const reports = JSON.parse(legacyReports);
                const convertedReports = reports.map((report) => (0, exports.convertLegacyReport)(report)).filter(Boolean);
                localStorage.setItem('ai_tools_reports_v2', JSON.stringify(convertedReports));
            }
            catch (error) {
                console.warn('Failed to migrate report data:', error);
            }
        }
        if (legacyLogs) {
            try {
                const logs = JSON.parse(legacyLogs);
                const convertedLogs = logs.map((log) => (0, exports.convertLegacyReportLog)(log)).filter(Boolean);
                localStorage.setItem('wowworks_report_logs_v2', JSON.stringify(convertedLogs));
            }
            catch (error) {
                console.warn('Failed to migrate log data:', error);
            }
        }
    },
    catch: (error) => new types_1.GenerationError(`Migration failed: ${error instanceof Error ? error.message : String(error)}`, 'UNKNOWN_ERROR', '')
});
exports.migrateLegacyData = migrateLegacyData;
/**
 * Checks if migration is needed
 */
const isMigrationNeeded = () => {
    const hasLegacyData = localStorage.getItem('wowworks_report_generations') ||
        localStorage.getItem('wowworks_report_checkpoints') ||
        localStorage.getItem('ai_tools_reports') ||
        localStorage.getItem('wowworks_report_logs');
    const hasNewData = localStorage.getItem('wowworks_report_generations_v2') ||
        localStorage.getItem('wowworks_report_checkpoints_v2') ||
        localStorage.getItem('ai_tools_reports_v2') ||
        localStorage.getItem('wowworks_report_logs_v2');
    return Boolean(hasLegacyData && !hasNewData);
};
exports.isMigrationNeeded = isMigrationNeeded;
//# sourceMappingURL=adapters.js.map