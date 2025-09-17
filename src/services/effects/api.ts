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
import {
  createReportServiceAdapter,
  createReportCheckpointServiceAdapter,
  createReportLogServiceAdapter,
  createReportGenerationServiceAdapter,
  migrateLegacyData,
  isMigrationNeeded
} from './adapters';
import { makeFileSystemService } from './implementations';

// ============================================================================
// Runtime Setup
// ============================================================================

// Create runtime with adapter services for backward compatibility
const createAdapterServicesLayer = () => {
  return Layer.mergeAll(
    Layer.succeed(FileSystemServiceTag, makeFileSystemService()),
    Layer.succeed(ReportServiceTag, createReportServiceAdapter()),
    Layer.succeed(ReportCheckpointServiceTag, createReportCheckpointServiceAdapter()),
    Layer.succeed(ReportLogServiceTag, createReportLogServiceAdapter()),
    Layer.succeed(ReportGenerationServiceTag, createReportGenerationServiceAdapter())
  );
};

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
export const initializeServices = (): Promise<void> => {
  return Runtime.runPromise(runtime)(
    pipe(
      Effect.sync(() => {
        if (isMigrationNeeded()) {
          console.log('Migrating legacy data to new format...');
        }
      }),
      Effect.flatMap(() => migrateLegacyData()),
      Effect.catchAll((error) => {
        console.error('Migration failed:', error);
        return Effect.succeed(undefined);
      })
    )
  );
};

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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
  );
};

/**
 * Set generation to paused state
 */
export const setToPaused = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.setToPaused(reportId);
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
  );
};

/**
 * Stop a running generation
 */
export const stopGeneration = (reportId: string): Promise<boolean> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.stopGeneration(reportId);
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
  );
};

/**
 * Resume a paused generation
 */
export const resumeGeneration = (params: ResumeGenerationParams): Promise<void> => {
  return Runtime.runPromise(runtime)(
    Effect.gen(function* () {
      const service = yield* ReportGenerationServiceTag;
      return yield* service.resumeGeneration(params);
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
  );
};

// ============================================================================
// File-system backed helpers used by UI (temporary, until full Effect FS layer)
// ============================================================================

// Reports
export const getAllReports = async (): Promise<Report[]> => {
  try {
    const reports = await (window as any).electronAPI?.fileSystem?.getAllReports?.();
    return Array.isArray(reports) ? reports : [];
  } catch {
    return [];
  }
};

export const getAllReportsWithSync = async (): Promise<Report[]> => {
  return await getAllReports();
};

export const updateReport = async (id: string, updates: Partial<Report>): Promise<Report | null> => {
  try {
    const existing = await getReportById(id);
    if (!existing) return null;
    const updated: Report = { ...existing, ...updates, updatedAt: new Date().toISOString() } as Report;
    await (window as any).electronAPI?.fileSystem?.saveReport?.(updated);
    return updated;
  } catch {
    return null;
  }
};

export const deleteReport = async (id: string): Promise<boolean> => {
  try {
    const ok = await (window as any).electronAPI?.fileSystem?.deleteReport?.(id);
    return !!ok;
  } catch {
    return false;
  }
};

export const exportReports = async (): Promise<string> => {
  const all = await getAllReports();
  return JSON.stringify(all);
};

export const importReports = async (data: string): Promise<boolean> => {
  try {
    const reports = JSON.parse(data) as Report[];
    for (const r of reports) {
      await (window as any).electronAPI?.fileSystem?.saveReport?.(r);
    }
    return true;
  } catch {
    return false;
  }
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
  try {
    const reports = await getAllReports();
    const all: ReportLog[] = [];
    for (const r of reports) {
      const rs = await (window as any).electronAPI?.fileSystem?.getReportLogs?.(r.id);
      if (Array.isArray(rs)) all.push(...rs);
    }
    return all;
  } catch {
    return [];
  }
};

export const getReportLogByIdWithSync = async (id: string): Promise<ReportLog | null> => {
  const all = await getAllReportLogsWithSync();
  return all.find((l: any) => l.id === id) ?? null;
};

export const deleteReportLog = async (id: string): Promise<boolean> => {
  try {
    await (window as any).electronAPI?.fileSystem?.deleteReportLog?.(id);
    return true;
  } catch {
    return false;
  }
};

export const cleanupOrphanedData = async (): Promise<number> => {
  try {
    const n = await (window as any).electronAPI?.fileSystem?.cleanupOrphanedData?.();
    return typeof n === 'number' ? n : 0;
  } catch {
    return 0;
  }
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

// ============================================================================
// Facade objects to satisfy legacy imports (no business logic; thin cache only)
// ============================================================================

let cachedReports: Report[] = [];
let cachedGenerations: Map<string, ReportGenerationState> = new Map();

export const primeReportsCache = async (): Promise<void> => {
  try {
    cachedReports = await getAllReports();
  } catch {
    cachedReports = [];
  }
};

export const reportService = {
  getReportById: (id: string): Report | null => cachedReports.find(r => r.id === id) ?? null,
  getReportByIdAsync: (id: string) => getReportById(id),
  async getAllReportsWithSync(): Promise<Report[]> { cachedReports = await getAllReportsWithSync(); return cachedReports; },
  getAllReports(): Report[] { return cachedReports; },
  async createReport(req: { name: string; prompt: string }): Promise<Report> { const r = await createReport(req); cachedReports = [r, ...cachedReports.filter(x => x.id !== r.id)]; return r; },
  async updateReport(id: string, updates: Partial<Report>): Promise<Report | null> { const r = await updateReport(id, updates); if (r) cachedReports = [r, ...cachedReports.filter(x => x.id !== id)]; return r; },
  async deleteReport(id: string): Promise<boolean> { const ok = await deleteReport(id); if (ok) cachedReports = cachedReports.filter(r => r.id !== id); return ok; },
  exportReports: () => exportReports(),
  importReports: (data: string) => importReports(data),
  cleanupOrphanedData: () => cleanupOrphanedData(),
  getCleanupSummary: () => getCleanupSummary(),
  forceSyncFromFileSystem: async (): Promise<boolean> => { const r = await forceSyncFromFileSystemReports(); if (r) cachedReports = await getAllReports(); return r; },
  hasReports: (): boolean => cachedReports.length > 0
};

export const reportLogService = {
  createReportLogFromGeneration: (params: CreateReportLogParams) => createReportLogFromGeneration(params),
  createFromReportGeneration: async (
    reportId: string,
    reportName: string,
    prompt: string,
    tableData: TableData,
    processed: number,
    total: number,
    timestamp: number,
    status: 'completed' | 'failed' | 'paused'
  ): Promise<ReportLog> => {
    const safeStatus = status === 'paused' ? 'failed' : status; // map unsupported to allowed set
    return await createReportLogFromGeneration({
      reportId,
      reportName,
      prompt,
      tableData,
      totalTasks: total,
      processedTasks: processed,
      startTime: timestamp,
      status: safeStatus as 'completed' | 'failed'
    });
  },
  getAllReportLogsWithSync: () => getAllReportLogsWithSync(),
  getReportLogByIdWithSync: (id: string) => getReportLogByIdWithSync(id),
  deleteReportLog: (id: string) => deleteReportLog(id),
  clearAllReportLogs: async (): Promise<boolean> => false,
  hasReportLogs: () => hasReportLogs()
};

export const reportCheckpointService = {
  getCheckpoint: (reportId: string) => getCheckpoint(reportId),
  hasCheckpoint: (reportId: string) => hasCheckpoint(reportId),
  canResume: (reportId: string) => canResume(reportId),
  createCheckpoint: (p: CreateCheckpointParams) => createCheckpoint(p),
  updateCheckpoint: (p: UpdateCheckpointParams) => updateCheckpoint(p),
  markCompleted: (reportId: string) => markCheckpointCompleted(reportId),
  markFailed: (reportId: string, msg: string) => markCheckpointFailed(reportId, msg),
  markPaused: (reportId: string) => markCheckpointPaused(reportId),
  resumeCheckpoint: (reportId: string) => resumeCheckpoint(reportId),
  clearCheckpoint: (reportId: string) => clearCheckpoint(reportId),
  getResumeOffset: (reportId: string) => getResumeOffset(reportId),
  getResumableCheckpoints: (): any[] => []
};

export const reportGenerationService = {
  getActiveGenerations: (): Map<string, ReportGenerationState> => cachedGenerations,
  async getGenerationStateAsync(reportId: string): Promise<ReportGenerationState | null> {
    const st = await getGenerationState(reportId);
    if (st) cachedGenerations.set(reportId, st);
    return st;
  },
  getGenerationState: (reportId: string): ReportGenerationState | null => cachedGenerations.get(reportId) ?? null,
  isGenerating: (reportId: string): boolean => (cachedGenerations.get(reportId)?.status === 'in_progress'),
  getGenerationStatus: (reportId: string): GenerationStatus => (cachedGenerations.get(reportId)?.status ?? 'ready') as GenerationStatus,
  updateGenerationStatus: async (reportId: string, status: GenerationStatus, errorMessage?: string): Promise<void> => {
    await updateGenerationStatus(reportId, status, errorMessage);
    const current = cachedGenerations.get(reportId) ?? { reportId, status: 'ready', progress: null, tableData: null, startTime: Date.now() } as ReportGenerationState;
    cachedGenerations.set(reportId, { ...current, status });
  },
  resetToReady: async (reportId: string): Promise<boolean> => { const ok = await resetToReady(reportId); if (ok) cachedGenerations.set(reportId, { reportId, status: 'ready', progress: null, tableData: null, startTime: Date.now() } as ReportGenerationState); return ok; },
  setToPaused: async (reportId: string): Promise<boolean> => { const ok = await setToPaused(reportId); if (ok) { const cur = cachedGenerations.get(reportId); if (cur) cachedGenerations.set(reportId, { ...cur, status: 'paused' }); } return ok; },
  setToCompleted: async (reportId: string): Promise<boolean> => { const ok = await setToCompleted(reportId); if (ok) { const cur = cachedGenerations.get(reportId); if (cur) cachedGenerations.set(reportId, { ...cur, status: 'completed' }); } return ok; },
  rerunFromCompleted: (reportId: string) => rerunFromCompleted(reportId),
  restartFromFailed: (reportId: string) => restartFromFailed(reportId),
  startGeneration: async (
    reportId: string,
    reportText: string,
    authToken: string,
    selectedServer: string,
    onProgress: (progress: TableData) => void,
    onComplete: (result: TableData) => void,
    onError: (error: any) => void,
    startOffset?: number,
    parameters?: any
  ): Promise<void> => {
    await startGeneration({ reportId, reportText, authToken, selectedServer, onProgress, onComplete, onError, startOffset, parameters } as any);
    const cur = cachedGenerations.get(reportId) ?? { reportId, status: 'in_progress', progress: null, tableData: null, startTime: Date.now() } as ReportGenerationState;
    cachedGenerations.set(reportId, { ...cur, status: 'in_progress' });
  },
  resumeGeneration: (params: ResumeGenerationParams) => resumeGeneration(params),
  stopGeneration: async (reportId: string): Promise<boolean> => { const ok = await stopGeneration(reportId); if (ok) { const cur = cachedGenerations.get(reportId); if (cur) cachedGenerations.set(reportId, { ...cur, status: 'paused' }); } return ok; },
  clearGeneration: async (reportId: string): Promise<void> => { await clearGeneration(reportId); cachedGenerations.delete(reportId); },
  clearAllReportData: async (): Promise<void> => {},
  reconnectToGeneration: async (_reportId: string, _callbacks: any): Promise<boolean> => true,
  clearExtractedParameters: (reportId: string) => clearExtractedParameters(reportId)
};

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
export const checkMigrationNeeded = (): boolean => {
  return isMigrationNeeded();
};

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
    }).pipe(Effect.provide(createAdapterServicesLayer()))
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
