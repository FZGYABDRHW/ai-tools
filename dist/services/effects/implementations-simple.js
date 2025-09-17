"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesLayer = exports.ReportGenerationServiceLive = exports.ReportLogServiceLive = exports.ReportCheckpointServiceLive = exports.ReportServiceLive = exports.FileSystemServiceLive = exports.LocalStorageServiceLive = void 0;
const effect_1 = require("effect");
const types_1 = require("./types");
// ============================================================================
// Storage Keys
// ============================================================================
const STORAGE_KEYS = {
    GENERATIONS: 'wowworks_report_generations',
    CHECKPOINTS: 'wowworks_report_checkpoints',
    REPORTS: 'ai_tools_reports',
    REPORT_LOGS: 'wowworks_report_logs'
};
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
// ============================================================================
// Report Service Implementation
// ============================================================================
const makeReportService = () => ({
    getReportById: (id) => effect_1.Effect.sync(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
            if (!stored)
                return null;
            const reports = JSON.parse(stored);
            return reports.find(report => report.id === id) || null;
        }
        catch {
            return null;
        }
    }),
    createReport: (request) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
            const reports = stored ? JSON.parse(stored) : [];
            const newReport = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                name: request.name.trim(),
                prompt: request.prompt || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            reports.push(newReport);
            localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
            return newReport;
        },
        catch: (error) => new types_1.GenerationError(`Failed to create report: ${error}`, 'STORAGE_ERROR', crypto.randomUUID(), error)
    }),
    saveReportData: (id, tableData, extractedParameters) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
            if (!stored)
                return null;
            const reports = JSON.parse(stored);
            const index = reports.findIndex(report => report.id === id);
            if (index === -1)
                return null;
            const updatedReport = {
                ...reports[index],
                tableData: {
                    columns: [...tableData.columns],
                    results: [...tableData.results],
                    csv: tableData.csv
                },
                extractedParameters: extractedParameters ? {
                    parameters: extractedParameters.parameters,
                    humanReadable: [...extractedParameters.humanReadable]
                } : undefined,
                lastGeneratedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            reports[index] = updatedReport;
            localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
            return updatedReport;
        },
        catch: (error) => new types_1.StorageError(`Failed to save report data: ${id}`, 'write', id, error)
    }),
    clearReportData: (id) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
            if (!stored)
                return null;
            const reports = JSON.parse(stored);
            const index = reports.findIndex(report => report.id === id);
            if (index === -1)
                return null;
            const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = reports[index];
            const clearedReport = {
                ...reportWithoutData,
                updatedAt: new Date().toISOString()
            };
            reports[index] = clearedReport;
            localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
            return clearedReport;
        },
        catch: (error) => new types_1.StorageError(`Failed to clear report data: ${id}`, 'delete', id, error)
    })
});
// ============================================================================
// Report Checkpoint Service Implementation
// ============================================================================
const makeReportCheckpointService = () => ({
    getCheckpoint: (reportId) => effect_1.Effect.sync(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored)
                return null;
            const checkpoints = JSON.parse(stored);
            return checkpoints[reportId] || null;
        }
        catch {
            return null;
        }
    }),
    hasCheckpoint: (reportId) => effect_1.Effect.sync(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored)
                return false;
            const checkpoints = JSON.parse(stored);
            return checkpoints[reportId] !== undefined;
        }
        catch {
            return false;
        }
    }),
    canResume: (reportId) => effect_1.Effect.sync(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored)
                return false;
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[reportId];
            return checkpoint !== null && (checkpoint.status === 'in_progress' || checkpoint.status === 'paused');
        }
        catch {
            return false;
        }
    }),
    createCheckpoint: (params) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            const checkpoints = stored ? JSON.parse(stored) : {};
            const checkpoint = {
                reportId: params.reportId,
                prompt: params.prompt,
                currentTaskIndex: 0,
                completedTasks: [],
                totalTasks: params.totalTasks,
                startTime: params.startTime,
                lastCheckpointTime: Date.now(),
                status: 'in_progress',
                startOffset: params.startOffset ?? 0
            };
            checkpoints[params.reportId] = checkpoint;
            localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
        },
        catch: (error) => new types_1.CheckpointError(`Failed to create checkpoint: ${error}`, params.reportId, 'create', error)
    }),
    updateCheckpoint: (params) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored) {
                throw new types_1.CheckpointError('No checkpoints found', params.reportId, 'update');
            }
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[params.reportId];
            if (!checkpoint) {
                throw new types_1.CheckpointError('Checkpoint not found', params.reportId, 'update');
            }
            const updatedCheckpoint = {
                ...checkpoint,
                completedTasks: [...checkpoint.completedTasks, {
                        taskId: params.taskId,
                        result: params.result,
                        timestamp: Date.now()
                    }],
                currentTaskIndex: params.currentTaskIndex,
                lastCheckpointTime: Date.now(),
                startOffset: Math.floor(params.currentTaskIndex / 30) * 30,
                tableData: params.tableData ?? checkpoint.tableData
            };
            checkpoints[params.reportId] = updatedCheckpoint;
            localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
        },
        catch: (error) => error instanceof types_1.CheckpointError ? error : new types_1.CheckpointError(`Failed to update checkpoint: ${error}`, params.reportId, 'update', error)
    }),
    markCompleted: (reportId) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored) {
                throw new types_1.CheckpointError('No checkpoints found', reportId, 'update');
            }
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[reportId];
            if (!checkpoint) {
                throw new types_1.CheckpointError('Checkpoint not found', reportId, 'update');
            }
            const updatedCheckpoint = {
                ...checkpoint,
                status: 'completed',
                lastCheckpointTime: Date.now()
            };
            checkpoints[reportId] = updatedCheckpoint;
            localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
        },
        catch: (error) => error instanceof types_1.CheckpointError ? error : new types_1.CheckpointError(`Failed to mark checkpoint as completed: ${error}`, reportId, 'update', error)
    }),
    markFailed: (reportId, errorMessage) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored) {
                throw new types_1.CheckpointError('No checkpoints found', reportId, 'update');
            }
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[reportId];
            if (!checkpoint) {
                throw new types_1.CheckpointError('Checkpoint not found', reportId, 'update');
            }
            const updatedCheckpoint = {
                ...checkpoint,
                status: 'failed',
                errorMessage,
                lastCheckpointTime: Date.now()
            };
            checkpoints[reportId] = updatedCheckpoint;
            localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
        },
        catch: (error) => error instanceof types_1.CheckpointError ? error : new types_1.CheckpointError(`Failed to mark checkpoint as failed: ${error}`, reportId, 'update', error)
    }),
    markPaused: (reportId) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored) {
                throw new types_1.CheckpointError('No checkpoints found', reportId, 'update');
            }
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[reportId];
            if (!checkpoint) {
                throw new types_1.CheckpointError('Checkpoint not found', reportId, 'update');
            }
            const updatedCheckpoint = {
                ...checkpoint,
                status: 'paused',
                lastCheckpointTime: Date.now()
            };
            checkpoints[reportId] = updatedCheckpoint;
            localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
        },
        catch: (error) => error instanceof types_1.CheckpointError ? error : new types_1.CheckpointError(`Failed to mark checkpoint as paused: ${error}`, reportId, 'update', error)
    }),
    resumeCheckpoint: (reportId) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored) {
                throw new types_1.CheckpointError('No checkpoints found', reportId, 'resume');
            }
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[reportId];
            if (!checkpoint) {
                throw new types_1.CheckpointError('Checkpoint not found', reportId, 'resume');
            }
            if (checkpoint.status !== 'paused' && checkpoint.status !== 'in_progress') {
                throw new types_1.CheckpointError(`Cannot resume checkpoint with status: ${checkpoint.status}`, reportId, 'resume');
            }
            const updatedCheckpoint = {
                ...checkpoint,
                status: 'in_progress',
                lastCheckpointTime: Date.now()
            };
            checkpoints[reportId] = updatedCheckpoint;
            localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
            return updatedCheckpoint;
        },
        catch: (error) => error instanceof types_1.CheckpointError ? error : new types_1.CheckpointError(`Failed to resume checkpoint: ${error}`, reportId, 'resume', error)
    }),
    clearCheckpoint: (reportId) => effect_1.Effect.try({
        try: () => {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored)
                return;
            const checkpoints = JSON.parse(stored);
            delete checkpoints[reportId];
            localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
        },
        catch: (error) => new types_1.CheckpointError(`Failed to clear checkpoint: ${error}`, reportId, 'clear', error)
    }),
    getResumeOffset: (reportId) => effect_1.Effect.sync(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
            if (!stored)
                return 0;
            const checkpoints = JSON.parse(stored);
            const checkpoint = checkpoints[reportId];
            if (!checkpoint)
                return 0;
            return Math.floor(checkpoint.currentTaskIndex / 30) * 30;
        }
        catch {
            return 0;
        }
    })
});
// ============================================================================
// Report Log Service Implementation
// ============================================================================
const makeReportLogService = () => ({
    createFromReportGeneration: (params) => effect_1.Effect.try({
        try: () => {
            const completedAt = new Date().toISOString();
            const duration = Date.now() - params.startTime;
            const newReportLog = {
                id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                reportId: params.reportId,
                reportName: params.reportName,
                prompt: params.prompt,
                generatedAt: new Date(params.startTime).toISOString(),
                completedAt,
                status: params.status,
                totalTasks: params.totalTasks,
                processedTasks: params.processedTasks,
                tableData: params.tableData ? {
                    columns: [...params.tableData.columns],
                    results: [...params.tableData.results],
                    csv: params.tableData.csv
                } : undefined,
                extractedParameters: params.extractedParameters ? {
                    parameters: params.extractedParameters.parameters,
                    humanReadable: [...params.extractedParameters.humanReadable]
                } : undefined,
                metadata: {
                    duration,
                    errorMessage: params.errorMessage,
                    userAgent: navigator.userAgent,
                    version: '1.0.0'
                }
            };
            const stored = localStorage.getItem(STORAGE_KEYS.REPORT_LOGS);
            const reportLogs = stored ? JSON.parse(stored) : [];
            reportLogs.unshift(newReportLog);
            localStorage.setItem(STORAGE_KEYS.REPORT_LOGS, JSON.stringify(reportLogs));
            return newReportLog;
        },
        catch: (error) => new types_1.StorageError(`Failed to create report log: ${error}`, 'write', params.reportId, error)
    })
});
// ============================================================================
// Report Generation Service Implementation
// ============================================================================
const makeReportGenerationService = () => {
    // Internal state management
    const activeGenerations = new Map();
    const generationCallbacks = new Map();
    return {
        getActiveGenerations: () => effect_1.Effect.sync(() => activeGenerations),
        getGenerationState: (reportId) => effect_1.Effect.sync(() => activeGenerations.get(reportId) || null),
        setCallbacks: (reportId, callbacks) => effect_1.Effect.sync(() => {
            generationCallbacks.set(reportId, callbacks);
        }),
        getCallbacks: (reportId) => effect_1.Effect.sync(() => generationCallbacks.get(reportId) || null),
        clearCallbacks: (reportId) => effect_1.Effect.sync(() => {
            generationCallbacks.delete(reportId);
        }),
        isGenerating: (reportId) => effect_1.Effect.sync(() => {
            const state = activeGenerations.get(reportId);
            return state?.status === 'preparing' || state?.status === 'in_progress';
        }),
        getGenerationStatus: (reportId) => effect_1.Effect.sync(() => {
            const state = activeGenerations.get(reportId);
            return state?.status || null;
        }),
        updateGenerationStatus: (reportId, status, errorMessage) => effect_1.Effect.try({
            try: () => {
                const state = activeGenerations.get(reportId);
                if (!state) {
                    throw new types_1.StorageError(`Generation state not found: ${reportId}`, 'read', reportId);
                }
                const updatedState = {
                    ...state,
                    status,
                    errorMessage
                };
                activeGenerations.set(reportId, updatedState);
                const generations = {};
                activeGenerations.forEach((state, id) => {
                    generations[id] = {
                        reportId: state.reportId,
                        status: state.status,
                        progress: state.progress,
                        tableData: state.tableData,
                        startTime: state.startTime,
                        errorMessage: state.errorMessage,
                        parameters: state.parameters,
                        extractedParameters: state.extractedParameters
                    };
                });
                localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(generations));
            },
            catch: (error) => new types_1.StorageError(`Failed to update generation status: ${error}`, 'write', reportId, error)
        }),
        resetToReady: (reportId) => effect_1.Effect.try({
            try: () => {
                const state = activeGenerations.get(reportId);
                if (state?.status === 'in_progress') {
                    // Stop generation if in progress
                    const updatedState = { ...state, status: 'failed' };
                    activeGenerations.set(reportId, updatedState);
                }
                // Clear generation state
                activeGenerations.delete(reportId);
                localStorage.removeItem(`${STORAGE_KEYS.GENERATIONS}_${reportId}`);
                // Clear checkpoint
                const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
                if (stored) {
                    const checkpoints = JSON.parse(stored);
                    delete checkpoints[reportId];
                    localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
                }
                // Clear report data
                const reportsStored = localStorage.getItem(STORAGE_KEYS.REPORTS);
                if (reportsStored) {
                    const reports = JSON.parse(reportsStored);
                    const index = reports.findIndex(report => report.id === reportId);
                    if (index !== -1) {
                        const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = reports[index];
                        reports[index] = {
                            ...reportWithoutData,
                            updatedAt: new Date().toISOString()
                        };
                        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
                    }
                }
                return true;
            },
            catch: (error) => new types_1.GenerationError(`Failed to reset report to ready: ${error}`, 'STORAGE_ERROR', reportId, error)
        }),
        setToPaused: (reportId) => effect_1.Effect.sync(() => {
            const state = activeGenerations.get(reportId);
            if (state && (state.status === 'preparing' || state.status === 'in_progress' || state.status === 'failed')) {
                const updatedState = { ...state, status: 'paused' };
                activeGenerations.set(reportId, updatedState);
                return true;
            }
            return false;
        }),
        setToCompleted: (reportId) => effect_1.Effect.sync(() => {
            const state = activeGenerations.get(reportId);
            if (state && (state.status === 'preparing' || state.status === 'in_progress' || state.status === 'paused')) {
                const updatedState = { ...state, status: 'completed' };
                activeGenerations.set(reportId, updatedState);
                return true;
            }
            return false;
        }),
        rerunFromCompleted: (reportId) => effect_1.Effect.try({
            try: () => {
                const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
                if (!stored) {
                    throw new types_1.GenerationError(`Report ${reportId} not found for rerun`, 'REPORT_NOT_FOUND', reportId);
                }
                const reports = JSON.parse(stored);
                const report = reports.find(r => r.id === reportId);
                if (!report) {
                    throw new types_1.GenerationError(`Report ${reportId} not found for rerun`, 'REPORT_NOT_FOUND', reportId);
                }
                const state = activeGenerations.get(reportId);
                if (state && state.status === 'completed') {
                    // Clear generation state
                    activeGenerations.delete(reportId);
                    localStorage.removeItem(`${STORAGE_KEYS.GENERATIONS}_${reportId}`);
                    // Clear report data
                    const index = reports.findIndex(r => r.id === reportId);
                    if (index !== -1) {
                        const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = reports[index];
                        reports[index] = {
                            ...reportWithoutData,
                            updatedAt: new Date().toISOString()
                        };
                        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
                    }
                    return true;
                }
                return false;
            },
            catch: (error) => error instanceof types_1.GenerationError ? error : new types_1.GenerationError(`Failed to rerun from completed: ${error}`, 'STORAGE_ERROR', reportId, error)
        }),
        restartFromFailed: (reportId) => effect_1.Effect.try({
            try: () => {
                const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
                if (!stored) {
                    throw new types_1.GenerationError(`Report ${reportId} not found for restart`, 'REPORT_NOT_FOUND', reportId);
                }
                const reports = JSON.parse(stored);
                const report = reports.find(r => r.id === reportId);
                if (!report) {
                    throw new types_1.GenerationError(`Report ${reportId} not found for restart`, 'REPORT_NOT_FOUND', reportId);
                }
                const state = activeGenerations.get(reportId);
                if (state && state.status === 'failed') {
                    // Clear generation state
                    activeGenerations.delete(reportId);
                    localStorage.removeItem(`${STORAGE_KEYS.GENERATIONS}_${reportId}`);
                    // Clear report data
                    const index = reports.findIndex(r => r.id === reportId);
                    if (index !== -1) {
                        const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = reports[index];
                        reports[index] = {
                            ...reportWithoutData,
                            updatedAt: new Date().toISOString()
                        };
                        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
                    }
                    return true;
                }
                return false;
            },
            catch: (error) => error instanceof types_1.GenerationError ? error : new types_1.GenerationError(`Failed to restart from failed: ${error}`, 'STORAGE_ERROR', reportId, error)
        }),
        startGeneration: (params) => effect_1.Effect.gen(function* () {
            // Validate parameters
            if (!params.reportId || params.reportId.trim() === '') {
                throw new types_1.GenerationError('Report ID is required', 'VALIDATION_ERROR', params.reportId);
            }
            if (!params.reportText || params.reportText.trim() === '') {
                throw new types_1.GenerationError('Report text is required', 'VALIDATION_ERROR', params.reportId);
            }
            if (!params.authToken || params.authToken.trim() === '') {
                throw new types_1.GenerationError('Auth token is required', 'VALIDATION_ERROR', params.reportId);
            }
            // Set callbacks
            generationCallbacks.set(params.reportId, {
                onProgress: params.onProgress,
                onComplete: params.onComplete,
                onError: params.onError
            });
            // Get or create report
            let report = yield* makeReportService().getReportById(params.reportId);
            if (!report) {
                report = yield* makeReportService().createReport({
                    name: 'Custom Operational Report',
                    prompt: params.reportText
                });
            }
            // Create generation state
            const startTime = Date.now();
            const generationState = {
                reportId: params.reportId,
                status: 'preparing',
                progress: null,
                tableData: null,
                startTime,
                parameters: params.parameters
            };
            activeGenerations.set(params.reportId, generationState);
            // This is where the actual generation logic would go
            // For now, we'll just return successfully
            return;
        }),
        stopGeneration: (reportId) => effect_1.Effect.try({
            try: () => {
                const state = activeGenerations.get(reportId);
                if (state?.status === 'in_progress') {
                    // Mark checkpoint as paused
                    const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
                    if (stored) {
                        const checkpoints = JSON.parse(stored);
                        const checkpoint = checkpoints[reportId];
                        if (checkpoint) {
                            const updatedCheckpoint = { ...checkpoint, status: 'paused', lastCheckpointTime: Date.now() };
                            checkpoints[reportId] = updatedCheckpoint;
                            localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
                        }
                    }
                    // Update generation status
                    const updatedState = { ...state, status: 'paused' };
                    activeGenerations.set(reportId, updatedState);
                    return true;
                }
                return false;
            },
            catch: (error) => new types_1.GenerationError(`Failed to stop generation: ${error}`, 'STORAGE_ERROR', reportId, error)
        }),
        clearGeneration: (reportId) => effect_1.Effect.try({
            try: () => {
                activeGenerations.delete(reportId);
                const generations = {};
                activeGenerations.forEach((state, id) => {
                    generations[id] = {
                        reportId: state.reportId,
                        status: state.status,
                        progress: state.progress,
                        tableData: state.tableData,
                        startTime: state.startTime,
                        errorMessage: state.errorMessage,
                        parameters: state.parameters,
                        extractedParameters: state.extractedParameters
                    };
                });
                localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(generations));
            },
            catch: (error) => new types_1.StorageError(`Failed to clear generation: ${error}`, 'write', reportId, error)
        }),
        clearExtractedParameters: (reportId) => effect_1.Effect.sync(() => {
            const state = activeGenerations.get(reportId);
            if (state) {
                const updatedState = { ...state, extractedParameters: undefined };
                activeGenerations.set(reportId, updatedState);
            }
        }),
        clearAllReportData: (reportId) => effect_1.Effect.try({
            try: () => {
                // Clear generation state
                activeGenerations.delete(reportId);
                const generations = {};
                activeGenerations.forEach((state, id) => {
                    generations[id] = {
                        reportId: state.reportId,
                        status: state.status,
                        progress: state.progress,
                        tableData: state.tableData,
                        startTime: state.startTime,
                        errorMessage: state.errorMessage,
                        parameters: state.parameters,
                        extractedParameters: state.extractedParameters
                    };
                });
                localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(generations));
                // Clear checkpoint
                const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
                if (stored) {
                    const checkpoints = JSON.parse(stored);
                    delete checkpoints[reportId];
                    localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
                }
                // Clear report data
                const reportsStored = localStorage.getItem(STORAGE_KEYS.REPORTS);
                if (reportsStored) {
                    const reports = JSON.parse(reportsStored);
                    const index = reports.findIndex(report => report.id === reportId);
                    if (index !== -1) {
                        const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = reports[index];
                        reports[index] = {
                            ...reportWithoutData,
                            updatedAt: new Date().toISOString()
                        };
                        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
                    }
                }
            },
            catch: (error) => new types_1.GenerationError(`Failed to clear all report data: ${error}`, 'STORAGE_ERROR', reportId, error)
        }),
        clearAllGenerations: () => effect_1.Effect.sync(() => {
            activeGenerations.clear();
            generationCallbacks.clear();
        }),
        reconnectToGeneration: (reportId, callbacks) => effect_1.Effect.gen(function* () {
            const state = activeGenerations.get(reportId);
            if (state && (state.status === 'preparing' || state.status === 'in_progress')) {
                generationCallbacks.set(reportId, callbacks);
                if (state.tableData && callbacks.onProgress) {
                    callbacks.onProgress(state.tableData);
                }
                return true;
            }
            return false;
        }),
        resumeGeneration: (params) => effect_1.Effect.try({
            try: () => {
                const stored = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
                if (!stored) {
                    throw new types_1.GenerationError('No checkpoint found for this report', 'CHECKPOINT_ERROR', params.reportId);
                }
                const checkpoints = JSON.parse(stored);
                const checkpoint = checkpoints[params.reportId];
                if (!checkpoint) {
                    throw new types_1.GenerationError('No checkpoint found for this report', 'CHECKPOINT_ERROR', params.reportId);
                }
                if (checkpoint.status !== 'paused' && checkpoint.status !== 'in_progress') {
                    throw new types_1.GenerationError(`Checkpoint status is ${checkpoint.status}, cannot resume`, 'CHECKPOINT_ERROR', params.reportId);
                }
                // Resume checkpoint
                const updatedCheckpoint = { ...checkpoint, status: 'in_progress', lastCheckpointTime: Date.now() };
                checkpoints[params.reportId] = updatedCheckpoint;
                localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
                const startOffset = Math.floor(checkpoint.currentTaskIndex / 30) * 30;
                // Start generation from where it left off
                const startParams = {
                    reportId: params.reportId,
                    reportText: checkpoint.prompt,
                    authToken: params.authToken,
                    selectedServer: params.selectedServer,
                    onProgress: params.onProgress,
                    onComplete: params.onComplete,
                    onError: params.onError,
                    startOffset
                };
                // This is where the actual generation logic would go
                // For now, we'll just return successfully
                return;
            },
            catch: (error) => error instanceof types_1.GenerationError ? error : new types_1.GenerationError(`Failed to resume generation: ${error}`, 'CHECKPOINT_ERROR', params.reportId, error)
        })
    };
};
// ============================================================================
// Service Layer Implementations
// ============================================================================
exports.LocalStorageServiceLive = effect_1.Layer.succeed(types_1.LocalStorageService, makeLocalStorageService());
exports.FileSystemServiceLive = effect_1.Layer.succeed(types_1.FileSystemService, makeFileSystemService());
exports.ReportServiceLive = effect_1.Layer.succeed(types_1.ReportService, makeReportService());
exports.ReportCheckpointServiceLive = effect_1.Layer.succeed(types_1.ReportCheckpointService, makeReportCheckpointService());
exports.ReportLogServiceLive = effect_1.Layer.succeed(types_1.ReportLogService, makeReportLogService());
exports.ReportGenerationServiceLive = effect_1.Layer.succeed(types_1.ReportGenerationService, makeReportGenerationService());
exports.ServicesLayer = effect_1.Layer.mergeAll(exports.LocalStorageServiceLive, exports.FileSystemServiceLive, exports.ReportServiceLive, exports.ReportCheckpointServiceLive, exports.ReportLogServiceLive, exports.ReportGenerationServiceLive);
//# sourceMappingURL=implementations-simple.js.map