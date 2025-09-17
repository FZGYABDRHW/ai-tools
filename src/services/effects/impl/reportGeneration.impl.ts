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
  readonly getActiveGenerations: () => Effect.Effect<Map<string, ReportGenerationState>, StorageError, FileSystemService>;
  readonly getGenerationState: (reportId: string) => Effect.Effect<ReportGenerationState | null, StorageError, FileSystemService>;
  readonly setCallbacks: (reportId: string, callbacks: GenerationCallbacks) => Effect.Effect<void, never, never>;
  readonly getCallbacks: (reportId: string) => Effect.Effect<GenerationCallbacks | null, never, never>;
  readonly clearCallbacks: (reportId: string) => Effect.Effect<void, never, never>;
  readonly isGenerating: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly getGenerationStatus: (reportId: string) => Effect.Effect<GenerationStatus | null, StorageError, FileSystemService>;
  readonly updateGenerationStatus: (reportId: string, status: GenerationStatus, errorMessage?: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly resetToReady: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly setToPaused: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly setToCompleted: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly rerunFromCompleted: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly restartFromFailed: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly startGeneration: (params: StartGenerationParams) => Effect.Effect<void, GenerationError, FileSystemService | import('./reportPreparation.impl').ReportPreparationService | import('./reportProcessing.impl').ReportProcessingService | import('./parameterExtraction.impl').ParameterExtractionServiceFx | import('./schemaDerivation.impl').SchemaDerivationService | import('./openai.impl').OpenAIService>;
  readonly stopGeneration: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly clearGeneration: (reportId: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly clearExtractedParameters: (reportId: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly clearAllReportData: (reportId: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly clearAllGenerations: () => Effect.Effect<void, StorageError, FileSystemService>;
  readonly reconnectToGeneration: (reportId: string, callbacks: GenerationCallbacks) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly resumeGeneration: (params: ResumeGenerationParams) => Effect.Effect<void, StorageError, FileSystemService | import('./reportPreparation.impl').ReportPreparationService | import('./reportProcessing.impl').ReportProcessingService | import('./parameterExtraction.impl').ParameterExtractionServiceFx | import('./schemaDerivation.impl').SchemaDerivationService | import('./openai.impl').OpenAIService>;
}

// ============================================================================
// Service Tag
// ============================================================================

export const ReportGenerationServiceTag = Context.GenericTag<ReportGenerationService>('ReportGenerationService');

import { makeReportService } from './report.impl';
import { makeReportCheckpointService } from './reportCheckpoint.impl';
import { makeReportLogService } from './reportLog.impl';
import { makeFileSystemService } from './fileSystem.impl';
import { ReportPreparationServiceTag } from './reportPreparation.impl';
import { ReportProcessingServiceTag } from './reportProcessing.impl';

export const makeReportGenerationService = (): ReportGenerationService => {
  return {
    getActiveGenerations: () =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const all = yield* fs.getAllGenerationStates();
        const map = new Map<string, ReportGenerationState>();
        for (const st of all as ReadonlyArray<ReportGenerationState>) {
          map.set(st.reportId, st);
        }
        return map;
      }),

    getGenerationState: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        return yield* fs.getGenerationState(reportId);
      }),

    // No-ops: in-memory callbacks removed
    setCallbacks: (_reportId: string, _callbacks: GenerationCallbacks) => Effect.succeed<void>(undefined),
    getCallbacks: (_reportId: string) => Effect.succeed<GenerationCallbacks | null>(null),
    clearCallbacks: (_reportId: string) => Effect.succeed<void>(undefined),

    isGenerating: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = yield* fs.getGenerationState(reportId);
        return (state?.status === 'preparing' || state?.status === 'in_progress') ?? false;
      }),

    getGenerationStatus: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = yield* fs.getGenerationState(reportId);
        return state?.status ?? null;
      }),

    updateGenerationStatus: (reportId: string, status: GenerationStatus, errorMessage?: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const existing = yield* fs.getGenerationState(reportId);
        if (!existing) {
          return yield* Effect.fail(new StorageError(`Generation state not found: ${reportId}`, 'read', reportId));
        }
        const updated: ReportGenerationState = {
          ...existing,
          status,
          errorMessage
        };
        yield* fs.saveGenerationState(reportId, updated);
      }),

    resetToReady: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = yield* fs.getGenerationState(reportId);
        if (state?.status === 'in_progress') {
          // Stop generation if in progress
          const updatedState = { ...state, status: 'failed' as GenerationStatus };
          yield* fs.saveGenerationState(reportId, updatedState);
        }
        // Clear generation state
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
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = yield* fs.getGenerationState(reportId);
        if (state && (state.status === 'preparing' || state.status === 'in_progress' || state.status === 'failed')) {
          const updatedState: ReportGenerationState = { ...state, status: 'paused' };
          yield* fs.saveGenerationState(reportId, updatedState);
          return true;
        }
        return false;
      }),

    setToCompleted: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = yield* fs.getGenerationState(reportId);
        if (state && (state.status === 'preparing' || state.status === 'in_progress' || state.status === 'paused')) {
          const updatedState: ReportGenerationState = { ...state, status: 'completed' };
          yield* fs.saveGenerationState(reportId, updatedState);
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
        const state = yield* fs.getGenerationState(reportId);
        if (state && state.status === 'completed') {
          // Clear generation state
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
        const state = yield* fs.getGenerationState(reportId);
        if (state && state.status === 'failed') {
          // Clear generation state
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
        {
          const fs = yield* FileSystemServiceTag;
          yield* fs.saveGenerationState(params.reportId, initialState);
        }

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

        // New: preparation then processing services
        const fs = yield* FileSystemServiceTag;
        const prep = yield* ReportPreparationServiceTag;
        const proc = yield* ReportProcessingServiceTag;

        yield* prep.prepare(params.reportId, params.reportText);
        yield* proc.process({
          reportId: params.reportId,
          prompt: params.reportText,
          columns: [],
          parameters: params.parameters,
          startOffset: params.startOffset ?? 0,
          authToken: params.authToken,
          server: (params.selectedServer as any) || 'EU'
        });

        // On completion, persist to report log using current state
        try {
          const st = yield* fs.getGenerationState(params.reportId);
          if (st && st.tableData) {
            try {
              yield* makeReportService().saveReportData(
                params.reportId,
                { columns: [...(st.tableData.columns || [])], results: [...(st.tableData.results || [])], csv: st.tableData.csv },
                (st as any).extractedParameters
              ).pipe(Effect.provide(Layer.succeed(FileSystemServiceTag, makeFileSystemService())));
            } catch {}
            try {
              const reportName = report?.name ?? 'Custom Operational Report';
              const logParams: CreateReportLogParams = {
                reportId: params.reportId,
                reportName,
                prompt: params.reportText,
                tableData: st.tableData,
                totalTasks: st.tableData.results.length,
                processedTasks: st.tableData.results.length,
                startTime,
                status: 'completed'
              };
              yield* makeReportLogService().createFromReportGeneration(logParams).pipe(
                Effect.provide(Layer.succeed(FileSystemServiceTag, makeFileSystemService()))
              );
            } catch {}
          }
        } catch {}

        return;
      }).pipe(Effect.catchAll((e) => Effect.fail(e as GenerationError))),

    stopGeneration: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = yield* fs.getGenerationState(reportId);
        if (state?.status === 'in_progress') {
          // Mark checkpoint as paused
          const checkpoint = yield* fs.getCheckpoint(reportId);
          if (checkpoint) {
            const updatedCheckpoint = { ...checkpoint, status: 'paused' as const, lastCheckpointTime: Date.now() };
            yield* fs.saveCheckpoint(reportId, updatedCheckpoint);
          }

          // Update generation status
          const updatedState = { ...state, status: 'paused' as GenerationStatus } as ReportGenerationState;
          yield* fs.saveGenerationState(reportId, updatedState);
          return true;
        }
        return false;
      }),

    clearGeneration: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        yield* fs.deleteGenerationState(reportId);
      }),

    clearExtractedParameters: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = yield* fs.getGenerationState(reportId);
        if (state) {
          const updatedState: ReportGenerationState = { ...state, extractedParameters: undefined };
          yield* fs.saveGenerationState(reportId, updatedState);
        }
      }),

    clearAllReportData: (reportId: string) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        // Clear generation state
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
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const all = yield* fs.getAllGenerationStates();
        for (const st of all as ReadonlyArray<ReportGenerationState>) {
          yield* fs.deleteGenerationState(st.reportId);
        }
      }),

    reconnectToGeneration: (reportId: string, _callbacks: GenerationCallbacks) =>
      Effect.gen(function* () {
        const fs = yield* FileSystemServiceTag;
        const state = yield* fs.getGenerationState(reportId);
        return (state?.status === 'preparing' || state?.status === 'in_progress') ?? false;
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
        return yield* makeReportGenerationService().startGeneration(startParams).pipe(
          Effect.mapError((e) => new StorageError(`Failed to resume generation: ${e instanceof Error ? e.message : String(e)}`, 'read', params.reportId))
        );
      })
  };
};
