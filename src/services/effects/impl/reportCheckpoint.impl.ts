import { Effect, Context } from 'effect';
import {
  TableData,
  StorageError
} from '../shared-types';
import { FileSystemService, FileSystemServiceTag } from './fileSystem.impl';

// ============================================================================
// Checkpoint Types
// ============================================================================

export interface ReportCheckpoint {
  readonly reportId: string;
  readonly prompt: string;
  readonly currentTaskIndex: number;
  readonly completedTasks: readonly CompletedTask[];
  readonly totalTasks: number;
  readonly startTime: number;
  readonly lastCheckpointTime: number;
  readonly status: 'in_progress' | 'completed' | 'failed' | 'paused';
  readonly errorMessage?: string;
  readonly startOffset: number;
  readonly tableData?: TableData;
}

export interface CompletedTask {
  readonly taskId: string;
  readonly result: Record<string, unknown>;
  readonly timestamp: number;
}

// ============================================================================
// Parameter Types
// ============================================================================

export interface CreateCheckpointParams {
  readonly reportId: string;
  readonly prompt: string;
  readonly totalTasks: number;
  readonly startTime: number;
  readonly startOffset?: number;
}

export interface UpdateCheckpointParams {
  readonly reportId: string;
  readonly taskId: string;
  readonly result: Record<string, unknown>;
  readonly currentTaskIndex: number;
  readonly tableData?: TableData;
}

// ============================================================================
// Service Interface
// ============================================================================

export interface ReportCheckpointService {
  readonly getCheckpoint: (reportId: string) => Effect.Effect<ReportCheckpoint | null, StorageError, FileSystemService>;
  readonly hasCheckpoint: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly canResume: (reportId: string) => Effect.Effect<boolean, StorageError, FileSystemService>;
  readonly createCheckpoint: (params: CreateCheckpointParams) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly updateCheckpoint: (params: UpdateCheckpointParams) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly markCompleted: (reportId: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly markFailed: (reportId: string, errorMessage: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly markPaused: (reportId: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly resumeCheckpoint: (reportId: string) => Effect.Effect<ReportCheckpoint | null, StorageError, FileSystemService>;
  readonly clearCheckpoint: (reportId: string) => Effect.Effect<void, StorageError, FileSystemService>;
  readonly getResumeOffset: (reportId: string) => Effect.Effect<number, StorageError, FileSystemService>;
}

// ============================================================================
// Service Tag
// ============================================================================

export const ReportCheckpointServiceTag = Context.GenericTag<ReportCheckpointService>('ReportCheckpointService');

export const makeReportCheckpointService = (): ReportCheckpointService => ({
  getCheckpoint: (reportId: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      return yield* fs.getCheckpoint(reportId);
    }),

  hasCheckpoint: (reportId: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint = yield* fs.getCheckpoint(reportId);
      return checkpoint !== null;
    }),

  canResume: (reportId: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint = yield* fs.getCheckpoint(reportId);
      return checkpoint !== null && (checkpoint.status === 'in_progress' || checkpoint.status === 'paused');
    }),

  createCheckpoint: (params: CreateCheckpointParams) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint: ReportCheckpoint = {
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
      yield* fs.saveCheckpoint(params.reportId, checkpoint);
    }),

  updateCheckpoint: (params: UpdateCheckpointParams) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint = yield* fs.getCheckpoint(params.reportId);
      if (!checkpoint) {
        return yield* Effect.fail(new StorageError('Checkpoint not found', 'read', params.reportId));
      }
      const updatedCheckpoint: ReportCheckpoint = {
        ...checkpoint,
        completedTasks: [...checkpoint.completedTasks, {
          taskId: params.taskId,
          result: params.result,
          timestamp: Date.now()
        }],
        currentTaskIndex: params.currentTaskIndex,
        lastCheckpointTime: Date.now(),
        startOffset: Math.floor(params.currentTaskIndex / 30) * 30,
        tableData: params.tableData ? {
          columns: [...params.tableData.columns],
          results: [...params.tableData.results],
          csv: params.tableData.csv
        } : checkpoint.tableData
      };
      yield* fs.saveCheckpoint(params.reportId, updatedCheckpoint);
    }),

  markCompleted: (reportId: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint = yield* fs.getCheckpoint(reportId);
      if (!checkpoint) {
        return yield* Effect.fail(new StorageError('Checkpoint not found', 'read', reportId));
      }
      const updatedCheckpoint: ReportCheckpoint = {
        ...checkpoint,
        status: 'completed',
        lastCheckpointTime: Date.now()
      };
      yield* fs.saveCheckpoint(reportId, updatedCheckpoint);
    }),

  markFailed: (reportId: string, errorMessage: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint = yield* fs.getCheckpoint(reportId);
      if (!checkpoint) {
        return yield* Effect.fail(new StorageError('Checkpoint not found', 'read', reportId));
      }
      const updatedCheckpoint: ReportCheckpoint = {
        ...checkpoint,
        status: 'failed',
        errorMessage,
        lastCheckpointTime: Date.now()
      };
      yield* fs.saveCheckpoint(reportId, updatedCheckpoint);
    }),

  markPaused: (reportId: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint = yield* fs.getCheckpoint(reportId);
      if (!checkpoint) {
        return yield* Effect.fail(new StorageError('Checkpoint not found', 'read', reportId));
      }
      const updatedCheckpoint: ReportCheckpoint = {
        ...checkpoint,
        status: 'paused',
        lastCheckpointTime: Date.now()
      };
      yield* fs.saveCheckpoint(reportId, updatedCheckpoint);
    }),

  resumeCheckpoint: (reportId: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint = yield* fs.getCheckpoint(reportId);
      if (!checkpoint) {
        return yield* Effect.fail(new StorageError('Checkpoint not found', 'read', reportId));
      }
      if (checkpoint.status !== 'paused' && checkpoint.status !== 'in_progress') {
        return yield* Effect.fail(new StorageError(`Cannot resume checkpoint with status: ${checkpoint.status}`, 'read', reportId));
      }
      const updatedCheckpoint: ReportCheckpoint = {
        ...checkpoint,
        status: 'in_progress',
        lastCheckpointTime: Date.now()
      };
      yield* fs.saveCheckpoint(reportId, updatedCheckpoint);
      return updatedCheckpoint;
    }),

  clearCheckpoint: (reportId: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      yield* fs.deleteCheckpoint(reportId);
    }),

  getResumeOffset: (reportId: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const checkpoint = yield* fs.getCheckpoint(reportId);
      if (!checkpoint) return 0;
      return Math.floor(checkpoint.currentTaskIndex / 30) * 30;
    })
});
