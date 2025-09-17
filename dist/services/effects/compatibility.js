"use strict";
// ============================================================================
// Compatibility Layer for Legacy Services
// ============================================================================
//
// This file provides compatibility wrappers that maintain the same interface
// as the legacy services but use the new Effect-TS implementations.
// This allows for a smooth migration without breaking existing code.
//
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportGenerationService = exports.reportLogService = exports.reportCheckpointService = exports.reportService = void 0;
const api_1 = require("./api");
// ============================================================================
// Report Service Compatibility
// ============================================================================
exports.reportService = {
    getReportById: (id) => {
        // For synchronous compatibility, we'll use a synchronous approach
        try {
            const stored = localStorage.getItem('reports');
            if (!stored)
                return null;
            const reports = JSON.parse(stored);
            return reports.find(report => report.id === id) || null;
        }
        catch (error) {
            console.error('Error getting report:', error);
            return null;
        }
    },
    createReport: async (request) => {
        return await (0, api_1.createReport)(request);
    },
    saveReportData: async (id, tableData, extractedParameters) => {
        return await (0, api_1.saveReportData)(id, tableData, extractedParameters);
    },
    clearReportData: async (id) => {
        return await (0, api_1.clearReportData)(id);
    },
    updateReport: async (id, updates) => {
        const report = await (0, api_1.getReportById)(id);
        if (!report)
            return null;
        const updatedReport = { ...report, ...updates, updatedAt: new Date().toISOString() };
        try {
            const stored = localStorage.getItem('reports');
            const reports = stored ? JSON.parse(stored) : [];
            const index = reports.findIndex(r => r.id === id);
            if (index !== -1) {
                reports[index] = updatedReport;
                localStorage.setItem('reports', JSON.stringify(reports));
            }
            return updatedReport;
        }
        catch (error) {
            console.error('Error updating report:', error);
            return null;
        }
    },
    // Legacy methods that don't exist in new API
    forceSyncFromFileSystem: async () => {
        console.log('forceSyncFromFileSystem called - no sync needed for localStorage-based implementation');
        return false; // Return false to prevent unnecessary reloads
    },
    hasReports: () => {
        try {
            const stored = localStorage.getItem('reports');
            if (!stored)
                return false;
            const reports = JSON.parse(stored);
            return reports.length > 0;
        }
        catch (error) {
            console.error('Error checking reports:', error);
            return false;
        }
    },
    getAllReportsWithSync: () => {
        try {
            const stored = localStorage.getItem('reports');
            return stored ? JSON.parse(stored) : [];
        }
        catch (error) {
            console.error('Error getting reports:', error);
            return [];
        }
    },
    getAllReports: () => {
        try {
            const stored = localStorage.getItem('reports');
            return stored ? JSON.parse(stored) : [];
        }
        catch (error) {
            console.error('Error getting reports:', error);
            return [];
        }
    },
    deleteReport: async (id) => {
        try {
            const stored = localStorage.getItem('reports');
            const reports = stored ? JSON.parse(stored) : [];
            const filteredReports = reports.filter(report => report.id !== id);
            localStorage.setItem('reports', JSON.stringify(filteredReports));
            return true;
        }
        catch (error) {
            console.error('Error deleting report:', error);
            return false;
        }
    },
    exportReports: () => {
        try {
            const stored = localStorage.getItem('reports');
            return stored || '[]';
        }
        catch (error) {
            console.error('Error exporting reports:', error);
            return '[]';
        }
    },
    importReports: async (data) => {
        try {
            const reports = JSON.parse(data);
            localStorage.setItem('reports', JSON.stringify(reports));
            return true;
        }
        catch (error) {
            console.error('Error importing reports:', error);
            return false;
        }
    },
    cleanupOrphanedData: async (reportId) => {
        console.log('cleanupOrphanedData called - placeholder implementation', reportId);
        return 0;
    },
    getCleanupSummary: async () => {
        return {
            orphanedReports: 0,
            orphanedCheckpoints: 0,
            orphanedLogs: 0,
            hasGenerationState: false,
            hasCheckpoint: false,
            isGenerating: false,
            checkpointStatus: 'none'
        };
    },
    getReportByIdAsync: async (id) => {
        return await (0, api_1.getReportById)(id);
    }
};
// ============================================================================
// Report Checkpoint Service Compatibility
// ============================================================================
exports.reportCheckpointService = {
    getCheckpoint: async (reportId) => {
        return await (0, api_1.getCheckpoint)(reportId);
    },
    hasCheckpoint: async (reportId) => {
        return await (0, api_1.hasCheckpoint)(reportId);
    },
    canResume: async (reportId) => {
        return await (0, api_1.canResume)(reportId);
    },
    createCheckpoint: async (params) => {
        return await (0, api_1.createCheckpoint)(params);
    },
    updateCheckpoint: async (params) => {
        return await (0, api_1.updateCheckpoint)(params);
    },
    markCompleted: async (reportId) => {
        return await (0, api_1.markCheckpointCompleted)(reportId);
    },
    markFailed: async (reportId, errorMessage) => {
        return await (0, api_1.markCheckpointFailed)(reportId, errorMessage);
    },
    markPaused: async (reportId) => {
        return await (0, api_1.markCheckpointPaused)(reportId);
    },
    resumeCheckpoint: async (reportId) => {
        await (0, api_1.resumeCheckpoint)(reportId);
    },
    clearCheckpoint: async (reportId) => {
        return await (0, api_1.clearCheckpoint)(reportId);
    },
    getResumeOffset: async (reportId) => {
        return await (0, api_1.getResumeOffset)(reportId);
    },
    // Legacy methods
    getResumableCheckpoints: () => {
        try {
            const stored = localStorage.getItem('checkpoints');
            if (!stored)
                return [];
            const checkpoints = JSON.parse(stored);
            return Object.values(checkpoints).filter(cp => cp.status === 'paused' || cp.status === 'in_progress');
        }
        catch (error) {
            console.error('Error getting resumable checkpoints:', error);
            return [];
        }
    },
    getProgressPercentage: (reportId) => {
        try {
            const stored = localStorage.getItem('checkpoints');
            if (!stored)
                return 0;
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[reportId];
            if (!checkpoint)
                return 0;
            return Math.round((checkpoint.currentTaskIndex / checkpoint.totalTasks) * 100);
        }
        catch (error) {
            console.error('Error getting progress percentage:', error);
            return 0;
        }
    },
    getEstimatedTimeRemaining: (reportId) => {
        try {
            const stored = localStorage.getItem('checkpoints');
            if (!stored)
                return 0;
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[reportId];
            if (!checkpoint)
                return 0;
            const elapsed = Date.now() - checkpoint.startTime;
            const progress = checkpoint.currentTaskIndex / checkpoint.totalTasks;
            if (progress === 0)
                return 0;
            const estimatedTotal = elapsed / progress;
            return Math.max(0, estimatedTotal - elapsed);
        }
        catch (error) {
            console.error('Error getting estimated time remaining:', error);
            return 0;
        }
    }
};
// ============================================================================
// Report Log Service Compatibility
// ============================================================================
exports.reportLogService = {
    // Legacy methods
    forceSyncFromFileSystem: async () => {
        console.log('forceSyncFromFileSystem called - no sync needed for localStorage-based implementation');
        return false; // Return false to prevent unnecessary reloads
    },
    hasReportLogs: () => {
        try {
            const stored = localStorage.getItem('report_logs');
            if (!stored)
                return false;
            const reportLogs = JSON.parse(stored);
            return reportLogs.length > 0;
        }
        catch (error) {
            console.error('Error checking report logs:', error);
            return false;
        }
    },
    getAllReportLogsWithSync: () => {
        try {
            const stored = localStorage.getItem('report_logs');
            return stored ? JSON.parse(stored) : [];
        }
        catch (error) {
            console.error('Error getting report logs:', error);
            return [];
        }
    },
    deleteReportLog: async (id) => {
        try {
            const stored = localStorage.getItem('report_logs');
            const reportLogs = stored ? JSON.parse(stored) : [];
            const filteredLogs = reportLogs.filter(log => log.id !== id);
            localStorage.setItem('report_logs', JSON.stringify(filteredLogs));
            return true;
        }
        catch (error) {
            console.error('Error deleting report log:', error);
            return false;
        }
    },
    clearAllReportLogs: async () => {
        try {
            localStorage.setItem('report_logs', JSON.stringify([]));
            return true;
        }
        catch (error) {
            console.error('Error clearing report logs:', error);
            return false;
        }
    },
    getReportLogByIdWithSync: (id) => {
        try {
            const stored = localStorage.getItem('report_logs');
            if (!stored)
                return null;
            const reportLogs = JSON.parse(stored);
            return reportLogs.find(log => log.id === id) || null;
        }
        catch (error) {
            console.error('Error getting report log:', error);
            return null;
        }
    },
    createFromReportGeneration: async (reportId, reportName, prompt, tableData, totalTasks, processedTasks, startTime, status, errorMessage, extractedParameters) => {
        const params = {
            reportId,
            reportName,
            prompt,
            tableData,
            totalTasks,
            processedTasks,
            startTime,
            status: status,
            errorMessage,
            extractedParameters
        };
        return await (0, api_1.createReportLogFromGeneration)(params);
    }
};
// ============================================================================
// Report Generation Service Compatibility
// ============================================================================
exports.reportGenerationService = {
    getActiveGenerations: () => {
        // For synchronous compatibility, we'll use a synchronous approach
        try {
            const stored = localStorage.getItem('generations');
            if (!stored)
                return new Map();
            const generations = JSON.parse(stored);
            const map = new Map();
            Object.entries(generations).forEach(([reportId, state]) => {
                map.set(reportId, state);
            });
            return map;
        }
        catch (error) {
            console.error('Error getting active generations:', error);
            return new Map();
        }
    },
    getGenerationState: (reportId) => {
        // For synchronous compatibility, we'll use a synchronous approach
        try {
            const stored = localStorage.getItem('generations');
            if (!stored)
                return null;
            const generations = JSON.parse(stored);
            const state = generations[reportId];
            if (!state)
                return null;
            // Convert back to ReportGenerationState
            return state;
        }
        catch (error) {
            console.error('Error getting generation state:', error);
            return null;
        }
    },
    setCallbacks: async (reportId, callbacks) => {
        try {
            const callbacksKey = `generation_callbacks_${reportId}`;
            localStorage.setItem(callbacksKey, JSON.stringify(callbacks));
        }
        catch (error) {
            console.error('Error setting callbacks:', error);
        }
    },
    getCallbacks: async (reportId) => {
        try {
            const callbacksKey = `generation_callbacks_${reportId}`;
            const stored = localStorage.getItem(callbacksKey);
            return stored ? JSON.parse(stored) : null;
        }
        catch (error) {
            console.error('Error getting callbacks:', error);
            return null;
        }
    },
    clearCallbacks: async (reportId) => {
        try {
            const callbacksKey = `generation_callbacks_${reportId}`;
            localStorage.removeItem(callbacksKey);
        }
        catch (error) {
            console.error('Error clearing callbacks:', error);
        }
    },
    isGenerating: async (reportId) => {
        return await (0, api_1.isGenerating)(reportId);
    },
    getGenerationStatus: (reportId) => {
        // For synchronous compatibility, we'll use a synchronous approach
        try {
            const stored = localStorage.getItem('generations');
            if (!stored)
                return null;
            const generations = JSON.parse(stored);
            const state = generations[reportId];
            return state?.status || null;
        }
        catch (error) {
            console.error('Error getting generation status:', error);
            return null;
        }
    },
    updateGenerationStatus: async (reportId, status, errorMessage) => {
        return await (0, api_1.updateGenerationStatus)(reportId, status, errorMessage);
    },
    resetToReady: async (reportId) => {
        return await (0, api_1.resetToReady)(reportId);
    },
    setToPaused: async (reportId) => {
        return await (0, api_1.setToPaused)(reportId);
    },
    setToCompleted: async (reportId) => {
        return await (0, api_1.setToCompleted)(reportId);
    },
    rerunFromCompleted: async (reportId) => {
        return await (0, api_1.rerunFromCompleted)(reportId);
    },
    restartFromFailed: async (reportId) => {
        return await (0, api_1.restartFromFailed)(reportId);
    },
    startGenerationWithParams: async (params) => {
        return await (0, api_1.startGeneration)(params);
    },
    stopGeneration: async (reportId) => {
        return await (0, api_1.stopGeneration)(reportId);
    },
    clearGeneration: async (reportId) => {
        return await (0, api_1.clearGeneration)(reportId);
    },
    clearExtractedParameters: async (reportId) => {
        return await (0, api_1.clearExtractedParameters)(reportId);
    },
    clearAllReportData: async (reportId) => {
        return await (0, api_1.clearAllReportData)(reportId);
    },
    clearAllGenerations: async () => {
        return await (0, api_1.clearAllGenerations)();
    },
    reconnectToGeneration: async (reportId, callbacks) => {
        return await (0, api_1.reconnectToGeneration)(reportId, callbacks);
    },
    resumeGeneration: async (params) => {
        return await (0, api_1.resumeGeneration)(params);
    },
    // Legacy methods
    getReportByIdAsync: async (id) => {
        return await (0, api_1.getReportById)(id);
    },
    startGeneration: async (reportId, reportText, authToken, selectedServer, onProgress, onComplete, onError, startOffset, parameters) => {
        const params = {
            reportId,
            reportText,
            authToken,
            selectedServer,
            onProgress,
            onComplete,
            onError,
            startOffset: startOffset || 0,
            parameters
        };
        return await (0, api_1.startGeneration)(params);
    },
    // Add missing methods for machine compatibility
    startGenerationLegacy: async (reportId, reportText, authToken, selectedServer, onProgress, onComplete, onError, startOffset, parameters) => {
        const params = {
            reportId,
            reportText,
            authToken,
            selectedServer,
            onProgress,
            onComplete,
            onError,
            startOffset: startOffset || 0,
            parameters
        };
        return await (0, api_1.startGeneration)(params);
    },
    resumeGenerationLegacy: async (reportId, authToken, selectedServer, onProgress, onComplete, onError) => {
        const params = {
            reportId,
            authToken,
            selectedServer,
            onProgress,
            onComplete,
            onError
        };
        return await (0, api_1.resumeGeneration)(params);
    }
};
//# sourceMappingURL=compatibility.js.map