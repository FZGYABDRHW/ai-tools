import { Effect, pipe } from 'effect';
import {
  makeReportService,
  makeReportCheckpointService,
  makeReportLogService,
  makeReportGenerationService
} from './implementations';
import {
  ReportService,
  ReportCheckpointService,
  ReportLogService,
  ReportGenerationService,
  Report,
  ReportLog,
  ReportCheckpoint,
  TableData,
  ExtractedParameters,
  CreateCheckpointParams,
  UpdateCheckpointParams,
  CreateReportLogParams,
  StartGenerationParams,
  ResumeGenerationParams,
  GenerationCallbacks,
  ReportGenerationState,
  GenerationStatus,
  StorageError,
  CheckpointError,
  GenerationError
} from './types';

// ============================================================================
// Report Service Adapter
// ============================================================================

export const createReportServiceAdapter = (): ReportService => {
  const service = makeReportService();
  return {
    getReportById: service.getReportById,
    createReport: service.createReport,
    saveReportData: service.saveReportData,
    clearReportData: service.clearReportData
  };
};

// ============================================================================
// Report Checkpoint Service Adapter
// ============================================================================

export const createReportCheckpointServiceAdapter = (): ReportCheckpointService => {
  const service = makeReportCheckpointService();
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

// ============================================================================
// Report Log Service Adapter
// ============================================================================

export const createReportLogServiceAdapter = (): ReportLogService => {
  const service = makeReportLogService();
  return {
    createFromReportGeneration: service.createFromReportGeneration
  };
};

// ============================================================================
// Report Generation Service Adapter
// ============================================================================

export const createReportGenerationServiceAdapter = (): ReportGenerationService => {
  const service = makeReportGenerationService();
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

// ============================================================================
// Legacy Service Integration Helpers
// ============================================================================

/**
 * Converts legacy generation state to new format
 */
export const convertLegacyGenerationState = (legacyState: any): ReportGenerationState | null => {
  if (!legacyState) return null;

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

/**
 * Converts legacy checkpoint to new format
 */
export const convertLegacyCheckpoint = (legacyCheckpoint: any): ReportCheckpoint | null => {
  if (!legacyCheckpoint) return null;

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

/**
 * Converts legacy report to new format
 */
export const convertLegacyReport = (legacyReport: any): Report | null => {
  if (!legacyReport) return null;

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

/**
 * Converts legacy report log to new format
 */
export const convertLegacyReportLog = (legacyLog: any): ReportLog | null => {
  if (!legacyLog) return null;

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

// ============================================================================
// Migration Helpers
// ============================================================================

/**
 * Migrates legacy data to new format
 */
export const migrateLegacyData = (): Effect.Effect<void, GenerationError> =>
  Effect.try({
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
          const convertedGenerations: Record<string, ReportGenerationState> = {};

          Object.entries(generations).forEach(([reportId, state]: [string, any]) => {
            const converted = convertLegacyGenerationState(state);
            if (converted) {
              convertedGenerations[reportId] = converted;
            }
          });

          localStorage.setItem('wowworks_report_generations_v2', JSON.stringify(convertedGenerations));
        } catch (error) {
          console.warn('Failed to migrate generation data:', error);
        }
      }

      if (legacyCheckpoints) {
        try {
          const checkpoints = JSON.parse(legacyCheckpoints);
          const convertedCheckpoints: Record<string, ReportCheckpoint> = {};

          Object.entries(checkpoints).forEach(([reportId, checkpoint]: [string, any]) => {
            const converted = convertLegacyCheckpoint(checkpoint);
            if (converted) {
              convertedCheckpoints[reportId] = converted;
            }
          });

          localStorage.setItem('wowworks_report_checkpoints_v2', JSON.stringify(convertedCheckpoints));
        } catch (error) {
          console.warn('Failed to migrate checkpoint data:', error);
        }
      }

      if (legacyReports) {
        try {
          const reports = JSON.parse(legacyReports);
          const convertedReports = reports.map((report: any) => convertLegacyReport(report)).filter(Boolean);
          localStorage.setItem('ai_tools_reports_v2', JSON.stringify(convertedReports));
        } catch (error) {
          console.warn('Failed to migrate report data:', error);
        }
      }

      if (legacyLogs) {
        try {
          const logs = JSON.parse(legacyLogs);
          const convertedLogs = logs.map((log: any) => convertLegacyReportLog(log)).filter(Boolean);
          localStorage.setItem('wowworks_report_logs_v2', JSON.stringify(convertedLogs));
        } catch (error) {
          console.warn('Failed to migrate log data:', error);
        }
      }
    },
    catch: (error) => new GenerationError(`Migration failed: ${error instanceof Error ? error.message : String(error)}`, 'UNKNOWN_ERROR', '')
  });

/**
 * Checks if migration is needed
 */
export const isMigrationNeeded = (): boolean => {
  const hasLegacyData =
    localStorage.getItem('wowworks_report_generations') ||
    localStorage.getItem('wowworks_report_checkpoints') ||
    localStorage.getItem('ai_tools_reports') ||
    localStorage.getItem('wowworks_report_logs');

  const hasNewData =
    localStorage.getItem('wowworks_report_generations_v2') ||
    localStorage.getItem('wowworks_report_checkpoints_v2') ||
    localStorage.getItem('ai_tools_reports_v2') ||
    localStorage.getItem('wowworks_report_logs_v2');

  return Boolean(hasLegacyData && !hasNewData);
};
