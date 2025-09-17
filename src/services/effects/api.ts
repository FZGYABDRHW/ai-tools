import { Effect, Runtime, pipe, Layer, Context, RuntimeFlags, FiberRefs } from 'effect';
import {
  ReportGenerationState,
  GenerationCallbacks,
  GenerationStatus,
  StartGenerationParams,
  ResumeGenerationParams,
  TableData,
  ExtractedParameters,
  Report,
  ReportLog,
  GenerationError,
  StorageError,
  CheckpointError
} from './shared-types';
import { FileSystemServiceTag } from './impl/fileSystem.impl';
import { ReportServiceTag } from './impl/report.impl';
import { ReportCheckpointServiceTag, ReportCheckpoint, CreateCheckpointParams, UpdateCheckpointParams } from './impl/reportCheckpoint.impl';
import { ReportLogServiceTag, CreateReportLogParams } from './impl/reportLog.impl';
import { ReportGenerationServiceTag } from './impl/reportGeneration.impl';
import { makeFileSystemService, makeReportService, makeReportCheckpointService, makeReportLogService, makeReportGenerationService } from './implementations';
import { OpenAIServiceTag, makeOpenAIService } from './impl/openai.impl';
import { ParameterExtractionServiceFxTag, makeParameterExtractionService } from './impl/parameterExtraction.impl';
import { SchemaDerivationServiceTag, makeSchemaDerivationService } from './impl/schemaDerivation.impl';
import { TaskSourceServiceTag, makeTaskSourceService } from './impl/taskSource.impl';
import { ReportPreparationServiceTag, makeReportPreparationService } from './impl/reportPreparation.impl';
import { ReportProcessingServiceTag, makeReportProcessingService } from './impl/reportProcessing.impl';
import type { TaskListParameters } from '../parameterExtractionService';

// ============================================================================
// Runtime Setup
// ============================================================================

// Build live services layer once (no in-memory caches)
const adapterServicesLayer = Layer.mergeAll(
  Layer.succeed(FileSystemServiceTag, makeFileSystemService()),
  Layer.succeed(ReportServiceTag, makeReportService()),
  Layer.succeed(ReportCheckpointServiceTag, makeReportCheckpointService()),
  Layer.succeed(ReportLogServiceTag, makeReportLogService()),
  Layer.succeed(ReportGenerationServiceTag, makeReportGenerationService()),
  // New Effect services for preparation and processing
  Layer.succeed(OpenAIServiceTag, makeOpenAIService()),
  Layer.succeed(ParameterExtractionServiceFxTag, makeParameterExtractionService()),
  Layer.succeed(SchemaDerivationServiceTag, makeSchemaDerivationService()),
  Layer.succeed(TaskSourceServiceTag, makeTaskSourceService()),
  Layer.succeed(ReportPreparationServiceTag, makeReportPreparationService()),
  Layer.succeed(ReportProcessingServiceTag, makeReportProcessingService())
);

const runtime = Runtime.make({
  context: Context.empty(),
  runtimeFlags: RuntimeFlags.none,
  fiberRefs: FiberRefs.empty()
});

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Initialize the Effect-based services and migrate legacy data if needed
 */
export const initializeServices = (): Promise<void> => Promise.resolve();

// ============================================================================
// Report Generation Service API
// ============================================================================

/**
 * Get all active generation states
 */
export const getActiveGenerations = (): Promise<Map<string, ReportGenerationState>> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.getActiveGenerations();
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Get generation state for a specific report
 */
export const getGenerationState = (reportId: string): Promise<ReportGenerationState | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.getGenerationState(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Set callbacks for a generation
 */
export const setGenerationCallbacks = (reportId: string, callbacks: GenerationCallbacks): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.setCallbacks(reportId, callbacks);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Get callbacks for a generation
 */
export const getGenerationCallbacks = (reportId: string): Promise<GenerationCallbacks | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.getCallbacks(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Clear callbacks for a generation
 */
export const clearGenerationCallbacks = (reportId: string): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.clearCallbacks(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Check if a report is currently generating
 */
export const isGenerating = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.isGenerating(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Get generation status for a report
 */
export const getGenerationStatus = (reportId: string): Promise<GenerationStatus | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.getGenerationStatus(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Update generation status
 */
export const updateGenerationStatus = (
  reportId: string,
  status: GenerationStatus,
  errorMessage?: string
): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.updateGenerationStatus(reportId, status, errorMessage);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Reset a report to ready state
 */
export const resetToReady = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.resetToReady(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Set generation to paused state
 */
export const setToPaused = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      yield* fs.setGenerationCommand(reportId, 'pause');
      const service = yield* ReportGenerationServiceTag;
      return yield* service.setToPaused(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Set generation to completed state
 */
export const setToCompleted = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.setToCompleted(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Rerun a completed generation
 */
export const rerunFromCompleted = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.rerunFromCompleted(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Restart a failed generation
 */
export const restartFromFailed = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.restartFromFailed(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Start a new generation
 */
export const startGeneration = (params: StartGenerationParams): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.startGeneration(params);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

// New: Run only preparation (extract parameters + derive schema + persist header)
export const prepareGeneration = (reportId: string, prompt: string): Promise<{ parameters: TaskListParameters; columns: string[] } | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const prep = yield* ReportPreparationServiceTag;
      const result = yield* prep.prepare(reportId, prompt);
      return result as any;
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

// New: Start processing only, using previously prepared state
export const startProcessing = (args: { reportId: string; prompt: string; authToken: string; server: 'EU' | 'RU'; startOffset?: number; parameters?: TaskListParameters; columns?: string[] }): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const proc = yield* ReportProcessingServiceTag;
      // Pull prepared parameters/columns from FS if not provided
      const st = yield* fs.getGenerationState(args.reportId);
      const parameters = (args.parameters ?? (st?.parameters as any)) as TaskListParameters;
      const columns = (args.columns ?? (st?.tableData?.columns as any)) as string[];
      const startOffset = args.startOffset ?? 0;
      return yield* proc.process({
        reportId: args.reportId,
        prompt: args.prompt,
        columns,
        parameters,
        startOffset,
        authToken: args.authToken,
        server: args.server
      });
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Stop a running generation
 */
export const stopGeneration = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      // File-backed control: set command to pause (stop)
      yield* fs.setGenerationCommand(reportId, 'pause');
      const service = yield* ReportGenerationServiceTag;
      return yield* service.stopGeneration(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Clear generation state
 */
export const clearGeneration = (reportId: string): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.clearGeneration(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Clear extracted parameters
 */
export const clearExtractedParameters = (reportId: string): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.clearExtractedParameters(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Clear all report data
 */
export const clearAllReportData = (reportId: string): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.clearAllReportData(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Clear all generations
 */
export const clearAllGenerations = (): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.clearAllGenerations();
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Reconnect to a running generation
 */
export const reconnectToGeneration = (reportId: string, callbacks: GenerationCallbacks): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.reconnectToGeneration(reportId, callbacks);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Resume a paused generation
 */
export const resumeGeneration = (params: ResumeGenerationParams): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      yield* fs.setGenerationCommand(params.reportId, 'resume');
      const service = yield* ReportGenerationServiceTag;
      return yield* service.resumeGeneration(params);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

// ============================================================================
// Report Service API
// ============================================================================

/**
 * Get report by ID
 */
export const getReportById = (id: string): Promise<Report | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportServiceTag;
      return yield* service.getReportById(id);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Create a new report
 */
export const createReport = (request: { name: string; prompt: string }): Promise<Report> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportServiceTag;
      return yield* service.createReport(request);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Save report data
 */
export const saveReportData = (
  id: string,
  tableData: TableData,
  extractedParameters?: ExtractedParameters
): Promise<Report | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportServiceTag;
      return yield* service.saveReportData(id, tableData, extractedParameters);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Clear report data
 */
export const clearReportData = (id: string): Promise<Report | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportServiceTag;
      return yield* service.clearReportData(id);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

// ============================================================================
// Report Checkpoint Service API
// ============================================================================

/**
 * Get checkpoint for a report
 */
export const getCheckpoint = (reportId: string): Promise<ReportCheckpoint | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.getCheckpoint(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Check if checkpoint exists
 */
export const hasCheckpoint = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.hasCheckpoint(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Check if generation can be resumed
 */
export const canResume = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.canResume(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Create a new checkpoint
 */
export const createCheckpoint = (params: CreateCheckpointParams): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.createCheckpoint(params);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Update checkpoint
 */
export const updateCheckpoint = (params: UpdateCheckpointParams): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.updateCheckpoint(params);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Mark checkpoint as completed
 */
export const markCheckpointCompleted = (reportId: string): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.markCompleted(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Mark checkpoint as failed
 */
export const markCheckpointFailed = (reportId: string, errorMessage: string): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.markFailed(reportId, errorMessage);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Mark checkpoint as paused
 */
export const markCheckpointPaused = (reportId: string): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.markPaused(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Resume checkpoint
 */
export const resumeCheckpoint = (reportId: string): Promise<ReportCheckpoint | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.resumeCheckpoint(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Clear checkpoint
 */
export const clearCheckpoint = (reportId: string): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.clearCheckpoint(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

/**
 * Get resume offset
 */
export const getResumeOffset = (reportId: string): Promise<number> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportCheckpointServiceTag;
      return yield* service.getResumeOffset(reportId);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

// ============================================================================
// Report Log Service API
// ============================================================================

/**
 * Create report log from generation
 */
export const createReportLogFromGeneration = (params: CreateReportLogParams): Promise<ReportLog> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportLogServiceTag;
      return yield* service.createFromReportGeneration(params);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

// ============================================================================
// File-system backed helpers used by UI (temporary, until full Effect FS layer)
// ============================================================================

// Reports
export const getAllReports = async (): Promise<Report[]> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const all = yield* fs.getAllReports();
      return all as Report[];
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

export const getAllReportsWithSync = async (): Promise<Report[]> => {
  return await getAllReports();
};

export const updateReport = async (id: string, updates: Partial<Report>): Promise<Report | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const existing = (yield* fs.getReport(id)) as Report | null;
      if (!existing) return null;
      const updated: Report = { ...existing, ...updates, updatedAt: new Date().toISOString() } as Report;
      const ok = yield* fs.saveReport(updated);
      return ok ? updated : null;
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

export const deleteReport = async (id: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      return yield* fs.deleteReport(id);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

export const exportReports = async (): Promise<string> => {
  const all = await getAllReports();
  return JSON.stringify(all);
};

export const importReports = async (data: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const reports = JSON.parse(data) as Report[];
      for (const r of reports) {
        const ok = yield* fs.saveReport(r);
        if (!ok) return false;
      }
      return true;
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

export const hasReportLogs = async (): Promise<boolean> => {
  const logs = await getAllReportLogsWithSync();
  return logs.length > 0;
};

export const hasReports = async (): Promise<boolean> => {
  const reports = await getAllReports();
  return reports.length > 0;
};

export const getAllReportLogsWithSync = async (): Promise<ReportLog[]> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const all = yield* fs.getAllReportLogs();
      return all as ReportLog[];
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

export const getReportLogByIdWithSync = async (id: string): Promise<ReportLog | null> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      return (yield* fs.getReportLog(id)) as ReportLog | null;
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

export const deleteReportLog = async (id: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      return yield* fs.deleteReportLog(id);
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

export const cleanupOrphanedData = async (): Promise<number> => {
  // Placeholder for a future FS-backed cleanup; return 0 for now
  return 0;
};

export const getCleanupSummary = async (): Promise<{ orphanedReports: number; orphanedCheckpoints: number; orphanedLogs: number; hasGenerationState: boolean; hasCheckpoint: boolean; isGenerating: boolean; checkpointStatus: string }> => {
  // Placeholder summary; implement precise FS analysis if needed
  return {
    orphanedReports: 0,
    orphanedCheckpoints: 0,
    orphanedLogs: 0,
    hasGenerationState: false,
    hasCheckpoint: false,
    isGenerating: false,
    checkpointStatus: 'none'
  };
};

export const forceSyncFromFileSystemReports = async (): Promise<boolean> => {
  const all = await getAllReports();
  return all.length > 0;
};

export const forceSyncFromFileSystemLogs = async (): Promise<boolean> => {
  const all = await getAllReportLogsWithSync();
  return all.length > 0;
};

// Facade caches removed; use Promise APIs above for all operations

// ============================================================================
// Error Handling Helpers
// ============================================================================

/**
 * Handle generation errors with proper logging
 */
export const handleGenerationError = (error: GenerationError): void => {
  console.error(`Generation Error [${error.code}] for report ${error.reportId}:`, error.message);
  if (error.cause) {
    console.error('Caused by:', error.cause);
  }
};

/**
 * Handle storage errors with proper logging
 */
export const handleStorageError = (error: StorageError): void => {
  console.error(`Storage Error [${error.operation}] for key ${error.key}:`, error.message);
  if (error.cause) {
    console.error('Caused by:', error.cause);
  }
};

/**
 * Handle checkpoint errors with proper logging
 */
export const handleCheckpointError = (error: CheckpointError): void => {
  console.error(`Checkpoint Error [${error.operation}] for report ${error.reportId}:`, error.message);
  if (error.cause) {
    console.error('Caused by:', error.cause);
  }
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if migration is needed
 */
export const checkMigrationNeeded = (): boolean => false;

/**
 * Get service health status
 */
export const getServiceHealth = (): Promise<{
  reportGeneration: boolean;
  reportService: boolean;
  checkpointService: boolean;
  logService: boolean;
}> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const reportGeneration = yield* Effect.gen(function* () {
        yield* ReportGenerationServiceTag;
        return true;
      }).pipe(Effect.catchAll(() => Effect.succeed(false)));

      const reportService = yield* Effect.gen(function* () {
        yield* ReportServiceTag;
        return true;
      }).pipe(Effect.catchAll(() => Effect.succeed(false)));

      const checkpointService = yield* Effect.gen(function* () {
        yield* ReportCheckpointServiceTag;
        return true;
      }).pipe(Effect.catchAll(() => Effect.succeed(false)));

      const logService = yield* Effect.gen(function* () {
        yield* ReportLogServiceTag;
        return true;
      }).pipe(Effect.catchAll(() => Effect.succeed(false)));

      return {
        reportGeneration,
        reportService,
        checkpointService,
        logService
      };
    }).pipe(Effect.provide(adapterServicesLayer))
  );
};

// ============================================================================
// React Hook Helpers (for future use)
// ============================================================================

/**
 * Create a promise-based wrapper for Effect operations
 * This can be used in React components
 */
export const createEffectWrapper = <T>(
  effect: Effect.Effect<T, GenerationError | StorageError | CheckpointError>
): Promise<T> => {
  return Runtime.runPromise(runtime)(effect);
};

/**
 * Create a safe wrapper that catches all errors
 */
export const createSafeWrapper = <T>(
  effect: Effect.Effect<T, GenerationError | StorageError | CheckpointError>
): Promise<T | null> => {
  return Runtime.runPromise(runtime)(
    effect.pipe(
      Effect.catchAll((error) => {
        console.error('Effect error:', error);
        return Effect.succeed(null);
      })
    )
  );
};
