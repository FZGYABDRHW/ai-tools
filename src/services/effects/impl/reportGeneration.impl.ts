import { Effect, Layer, Context } from 'effect';
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
  StorageError
} from '../shared-types';
import { FileSystemService, FileSystemServiceTag } from './fileSystem.impl';
import { CreateCheckpointParams } from './reportCheckpoint.impl';
import { CreateReportLogParams } from './reportLog.impl';

// ============================================================================
// Service Interface
// ============================================================================

export interface ReportGenerationService {
  readonly getActiveGenerations: () => Effect.Effect<Map<string, ReportGenerationState>, never, never>;
  readonly getGenerationState: (reportId: string) => Effect.Effect<ReportGenerationState | null, never, never>;
  readonly setCallbacks: (reportId: string, callbacks: GenerationCallbacks) => Effect.Effect<void, never, never>;
  readonly getCallbacks: (reportId: string) => Effect.Effect<GenerationCallbacks | null, never, never>;
  readonly clearCallbacks: (reportId: string) => Effect.Effect<void, never, never>;
  readonly isGenerating: (reportId: string) => Effect.Effect<boolean, never, never>;
  readonly getGenerationStatus: (reportId: string) => Effect.Effect<GenerationStatus | null, never, never>;
  readonly updateGenerationStatus: (reportId: string, status: GenerationStatus, errorMessage?: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly resetToReady: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly setToPaused: (reportId: string) => Effect.Effect<boolean, never, never>;
  readonly setToCompleted: (reportId: string) => Effect.Effect<boolean, never, never>;
  readonly rerunFromCompleted: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly restartFromFailed: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly startGeneration: (params: StartGenerationParams) => Effect.Effect<void, GenerationError, FileSystemService>;
  readonly stopGeneration: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly clearGeneration: (reportId: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly clearExtractedParameters: (reportId: string) => Effect.Effect<void, never, never>;
  readonly clearAllReportData: (reportId: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly clearAllGenerations: () => Effect.Effect<void, never, never>;
  readonly reconnectToGeneration: (reportId: string, callbacks: GenerationCallbacks) => Effect.Effect<boolean, never, never>;
  readonly resumeGeneration: (params: ResumeGenerationParams) => Effect.Effect<void, StorageError, FileSystemService>;
}

// ============================================================================
// Service Tag
// ============================================================================

export const ReportGenerationServiceTag = Context.GenericTag<ReportGenerationService>('ReportGenerationService');

import { makeReportService } from './report.impl';
import { makeReportCheckpointService } from './reportCheckpoint.impl';
import { makeReportLogService } from './reportLog.impl';
import { makeFileSystemService } from './fileSystem.impl';
import { buildServiceInitializer } from '../../../serviceInit';
import { buildReport } from '../../../reportBuilder';
import builder from '../../../builder';

export const makeReportGenerationService = (): ReportGenerationService => {
  // Internal state management
  const activeGenerations = new Map<string, ReportGenerationState>();
  const generationCallbacks = new Map<string, GenerationCallbacks>();

  return {
    getActiveGenerations: () => Effect.sync(() => activeGenerations),

    getGenerationState: (reportId: string) =>
      Effect.sync(() => activeGenerations.get(reportId) || null),

    setCallbacks: (reportId: string, callbacks: GenerationCallbacks) =>
      Effect.sync(() => {
        generationCallbacks.set(reportId, callbacks);
      }),

    getCallbacks: (reportId: string) =>
      Effect.sync(() => generationCallbacks.get(reportId) || null),

    clearCallbacks: (reportId: string) =>
      Effect.sync(() => {
        generationCallbacks.delete(reportId);
      }),

    isGenerating: (reportId: string) =>
      Effect.sync(() => {
        const state = activeGenerations.get(reportId);
        return state?.status === 'preparing' || state?.status === 'in_progress';
      }),

    getGenerationStatus: (reportId: string) =>
      Effect.sync(() => {
        const state = activeGenerations.get(reportId);
        return state?.status || null;
      }),

    updateGenerationStatus: (reportId: string, status: GenerationStatus, errorMessage?: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = activeGenerations.get(reportId);
        if (!state) {
          return yield* Effect.fail(new StorageError(`Generation state not found: ${reportId}`, 'read', reportId));
        }
        const updatedState: ReportGenerationState = {
          ...state,
          status,
          errorMessage
        };
        activeGenerations.set(reportId, updatedState);

        // Save to file system
        const stateToSave: Omit<ReportGenerationState, 'abortController'> = {
          reportId: updatedState.reportId,
          status: updatedState.status,
          progress: updatedState.progress,
          tableData: updatedState.tableData,
          startTime: updatedState.startTime,
          errorMessage: updatedState.errorMessage,
          parameters: updatedState.parameters,
          extractedParameters: updatedState.extractedParameters
        };
        yield* fs.saveGenerationState(reportId, stateToSave);
      }),

    resetToReady: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = activeGenerations.get(reportId);
        if (state?.status === 'in_progress') {
          // Stop generation if in progress
          const updatedState = { ...state, status: 'failed' as GenerationStatus };
          activeGenerations.set(reportId, updatedState);
        }
        // Clear generation state
        activeGenerations.delete(reportId);
        yield* fs.deleteGenerationState(reportId);

        // Clear checkpoint
        yield* fs.deleteCheckpoint(reportId);

        // Clear report data
        const report = yield* fs.getReport(reportId);
        if (report) {
          const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = report;
          const clearedReport: Report = {
            ...reportWithoutData,
            updatedAt: new Date().toISOString()
          };
          yield* fs.saveReport(clearedReport);
        }
        return true;
      }).pipe(Effect.mapError((error) => new StorageError(`Failed to reset to ready: ${error.message}`, 'write', reportId, error))),

    setToPaused: (reportId: string) =>
      Effect.sync(() => {
        const state = activeGenerations.get(reportId);
        if (state && (state.status === 'preparing' || state.status === 'in_progress' || state.status === 'failed')) {
          const updatedState = { ...state, status: 'paused' as GenerationStatus };
          activeGenerations.set(reportId, updatedState);
          return true;
        }
        return false;
      }),

    setToCompleted: (reportId: string) =>
      Effect.sync(() => {
        const state = activeGenerations.get(reportId);
        if (state && (state.status === 'preparing' || state.status === 'in_progress' || state.status === 'paused')) {
          const updatedState = { ...state, status: 'completed' as GenerationStatus };
          activeGenerations.set(reportId, updatedState);
          return true;
        }
        return false;
      }),

    rerunFromCompleted: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const report = yield* fs.getReport(reportId);
        if (!report) {
          return yield* Effect.fail(new StorageError(`Report ${reportId} not found for rerun`, 'read', reportId));
        }
        const state = activeGenerations.get(reportId);
        if (state && state.status === 'completed') {
          // Clear generation state
          activeGenerations.delete(reportId);
          yield* fs.deleteGenerationState(reportId);

          // Clear report data
          const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = report;
          const clearedReport: Report = {
            ...reportWithoutData,
            updatedAt: new Date().toISOString()
          };
          yield* fs.saveReport(clearedReport);
          return true;
        }
        return false;
      }),

    restartFromFailed: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const report = yield* fs.getReport(reportId);
        if (!report) {
          return yield* Effect.fail(new StorageError(`Report ${reportId} not found for restart`, 'read', reportId));
        }
        const state = activeGenerations.get(reportId);
        if (state && state.status === 'failed') {
          // Clear generation state
          activeGenerations.delete(reportId);
          yield* fs.deleteGenerationState(reportId);

          // Clear report data
          const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = report;
          const clearedReport: Report = {
            ...reportWithoutData,
            updatedAt: new Date().toISOString()
          };
          yield* fs.saveReport(clearedReport);
          return true;
        }
        return false;
      }),

    startGeneration: (params: StartGenerationParams) =>
      Effect.gen(function* () {
        // Validate parameters
        if (!params.reportId || params.reportId.trim() === '') {
          throw new GenerationError('Report ID is required', 'VALIDATION_ERROR', params.reportId);
        }
        if (!params.reportText || params.reportText.trim() === '') {
          throw new GenerationError('Report text is required', 'VALIDATION_ERROR', params.reportId);
        }
        if (!params.authToken || params.authToken.trim() === '') {
          throw new GenerationError('Auth token is required', 'VALIDATION_ERROR', params.reportId);
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

        const startTime = Date.now();
        // Initialize generation state
        const initialState: ReportGenerationState = {
          reportId: params.reportId,
          status: 'preparing',
          progress: null,
          tableData: null,
          startTime,
          parameters: params.parameters
        };
        activeGenerations.set(params.reportId, initialState);

        // Attempt to create initial checkpoint if missing (ignore errors)
        yield* Effect.catchAll(
          Effect.gen(function* () {
            const has = yield* makeReportCheckpointService().hasCheckpoint(params.reportId);
            if (!has) {
              const cp: CreateCheckpointParams = {
                reportId: params.reportId,
                prompt: params.reportText,
                totalTasks: 0,
                startTime,
                startOffset: params.startOffset ?? 0
              };
              yield* makeReportCheckpointService().createCheckpoint(cp);
            }
            return Effect.void;
          }),
          () => Effect.void
        );

        // Run builder pipeline
        const si = buildServiceInitializer(params.authToken, (params.selectedServer as any) || 'EU');

        yield* Effect.tryPromise({
          try: async () => {
            const onProgress = (progress: TableData) => {
              // Update in-memory state and notify callback
              const st = activeGenerations.get(params.reportId);
              const processed = progress.results.length;
              const updated: ReportGenerationState = {
                reportId: params.reportId,
                status: 'in_progress',
                progress: { processed, total: processed },
                tableData: progress,
                startTime: st?.startTime ?? startTime,
                parameters: st?.parameters,
                extractedParameters: st?.extractedParameters
              };
              activeGenerations.set(params.reportId, updated);
              generationCallbacks.get(params.reportId)?.onProgress?.(progress as any);
            };

            const onParametersExtracted = (extracted: ExtractedParameters) => {
              const st = activeGenerations.get(params.reportId);
              if (st) {
                activeGenerations.set(params.reportId, { ...st, extractedParameters: extracted });
              }
            };

            const onStatusUpdate = (status: 'preparing' | 'in_progress') => {
              const st = activeGenerations.get(params.reportId);
              if (st) {
                activeGenerations.set(params.reportId, { ...st, status });
              }
            };

            const result = await buildReport(
              params.reportText,
              si,
              (taskId) => builder(taskId, params.authToken, (params.selectedServer as any) || 'EU'),
              onProgress,
              onParametersExtracted,
              undefined,
              params.startOffset ?? 0,
              params.parameters,
              undefined,
              onStatusUpdate
            );

            // Completion handling
            const finalState = activeGenerations.get(params.reportId);
            if (finalState) {
              activeGenerations.set(params.reportId, { ...finalState, status: 'completed', tableData: result });
            }
            // Create a report log
            try {
              const reportName = report?.name ?? 'Custom Operational Report';
              const logParams: CreateReportLogParams = {
                reportId: params.reportId,
                reportName,
                prompt: params.reportText,
                tableData: result,
                totalTasks: result.results.length,
                processedTasks: result.results.length,
                startTime,
                status: 'completed'
              };
              // Persist report log via filesystem-enabled service
              await Effect.runPromise(
                makeReportLogService().createFromReportGeneration(logParams).pipe(
                  Effect.provide(Layer.succeed(FileSystemServiceTag, makeFileSystemService()))
                )
              );
            } catch {}

            generationCallbacks.get(params.reportId)?.onComplete?.(result as any);
          },
          catch: (error) => new GenerationError(
            `Generation failed: ${String((error as Error)?.message || error)}`,
            'UNKNOWN_ERROR',
            params.reportId,
            error as Error
          )
        });

        return;
      }).pipe(Effect.catchAll((e) => Effect.fail(e as GenerationError))),

    stopGeneration: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = activeGenerations.get(reportId);
        if (state?.status === 'in_progress') {
          // Mark checkpoint as paused
          const checkpoint = yield* fs.getCheckpoint(reportId);
          if (checkpoint) {
            const updatedCheckpoint = { ...checkpoint, status: 'paused' as const, lastCheckpointTime: Date.now() };
            yield* fs.saveCheckpoint(reportId, updatedCheckpoint);
          }

          // Update generation status
          const updatedState = { ...state, status: 'paused' as GenerationStatus };
          activeGenerations.set(reportId, updatedState);
          return true;
        }
        return false;
      }),

    clearGeneration: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        activeGenerations.delete(reportId);
        yield* fs.deleteGenerationState(reportId);
      }),

    clearExtractedParameters: (reportId: string) =>
      Effect.sync(() => {
        const state = activeGenerations.get(reportId);
        if (state) {
          const updatedState = { ...state, extractedParameters: undefined };
          activeGenerations.set(reportId, updatedState);
        }
      }),

    clearAllReportData: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        // Clear generation state
        activeGenerations.delete(reportId);
        yield* fs.deleteGenerationState(reportId);

        // Clear checkpoint
        yield* fs.deleteCheckpoint(reportId);

        // Clear report data
        const report = yield* fs.getReport(reportId);
        if (report) {
          const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = report;
          const clearedReport: Report = {
            ...reportWithoutData,
            updatedAt: new Date().toISOString()
          };
          yield* fs.saveReport(clearedReport);
        }
      }),

    clearAllGenerations: () =>
      Effect.sync(() => {
        activeGenerations.clear();
        generationCallbacks.clear();
      }),

    reconnectToGeneration: (reportId: string, callbacks: GenerationCallbacks) =>
      Effect.gen(function* () {
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

    resumeGeneration: (params: ResumeGenerationParams) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const checkpoint = yield* fs.getCheckpoint(params.reportId);
        if (!checkpoint) {
          return yield* Effect.fail(new StorageError('No checkpoint found for this report', 'read', params.reportId));
        }
        if (checkpoint.status !== 'paused' && checkpoint.status !== 'in_progress') {
          return yield* Effect.fail(new StorageError(`Checkpoint status is ${checkpoint.status}, cannot resume`, 'read', params.reportId));
        }

        // Resume checkpoint
        const updatedCheckpoint = { ...checkpoint, status: 'in_progress' as const, lastCheckpointTime: Date.now() };
        yield* fs.saveCheckpoint(params.reportId, updatedCheckpoint);

        const startOffset = Math.floor(checkpoint.currentTaskIndex / 30) * 30;

        // Start generation from where it left off
        const startParams: StartGenerationParams = {
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
      })
  };
};
