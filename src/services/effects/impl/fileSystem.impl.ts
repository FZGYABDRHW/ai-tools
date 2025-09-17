import { Effect, Context } from 'effect';
import {
  Report,
  ReportLog,
  ReportGenerationState,
  StorageError
} from '../shared-types';
import { ReportCheckpoint } from './reportCheckpoint.impl';

// ============================================================================
// FileSystem Service Types
// ============================================================================

export interface FileSystemService {
  // Report operations
  readonly getReport: (reportId: string) => Effect.Effect<Report | null, StorageError, never>;
  readonly getAllReports: () => Effect.Effect<readonly Report[], StorageError, never>;
  readonly saveReport: (report: Report) => Effect.Effect<boolean, StorageError, never>;
  readonly deleteReport: (reportId: string) => Effect.Effect<boolean, StorageError, never>;

  // Checkpoint operations
  readonly getCheckpoint: (reportId: string) => Effect.Effect<ReportCheckpoint | null, StorageError, never>;
  readonly getAllCheckpoints: () => Effect.Effect<readonly ReportCheckpoint[], StorageError, never>;
  readonly saveCheckpoint: (reportId: string, checkpoint: ReportCheckpoint) => Effect.Effect<boolean, StorageError, never>;
  readonly deleteCheckpoint: (reportId: string) => Effect.Effect<boolean, StorageError, never>;

  // Report log operations
  readonly getReportLog: (id: string) => Effect.Effect<ReportLog | null, StorageError, never>;
  readonly getAllReportLogs: () => Effect.Effect<readonly ReportLog[], StorageError, never>;
  readonly saveReportLog: (reportLog: ReportLog) => Effect.Effect<boolean, StorageError, never>;
  readonly deleteReportLog: (id: string) => Effect.Effect<boolean, StorageError, never>;

  // Generation state operations
  readonly getGenerationState: (reportId: string) => Effect.Effect<Omit<ReportGenerationState, 'abortController'> | null, StorageError, never>;
  readonly getAllGenerationStates: () => Effect.Effect<readonly Omit<ReportGenerationState, 'abortController'>[], StorageError, never>;
  readonly saveGenerationState: (reportId: string, state: Omit<ReportGenerationState, 'abortController'>) => Effect.Effect<boolean, StorageError, never>;
  readonly deleteGenerationState: (reportId: string) => Effect.Effect<boolean, StorageError, never>;
}

// ============================================================================
// Service Tag
// ============================================================================

export const FileSystemServiceTag = Context.GenericTag<FileSystemService>('FileSystemService');

export const makeFileSystemService = (): FileSystemService => ({
  // Report operations
  getReport: (reportId: string) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.getReport) {
          return await (window.electronAPI as any).fileSystem.getReport(reportId);
        }
        return null;
      },
      catch: (error) => new StorageError(`Failed to get report: ${reportId}`, 'read', reportId, error as Error)
    }),

  getAllReports: () =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.getAllReports) {
          return await (window.electronAPI as any).fileSystem.getAllReports();
        }
        return [];
      },
      catch: (error) => new StorageError(`Failed to get all reports`, 'read', '', error as Error)
    }),

  saveReport: (report: Report) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.saveReport) {
          return await (window.electronAPI as any).fileSystem.saveReport(report);
        }
        return false;
      },
      catch: (error) => new StorageError(`Failed to save report: ${report.id}`, 'write', report.id, error as Error)
    }),

  deleteReport: (reportId: string) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.deleteReport) {
          return await (window.electronAPI as any).fileSystem.deleteReport(reportId);
        }
        return false;
      },
      catch: (error) => new StorageError(`Failed to delete report: ${reportId}`, 'delete', reportId, error as Error)
    }),

  // Checkpoint operations
  getCheckpoint: (reportId: string) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.getCheckpoint) {
          return await (window.electronAPI as any).fileSystem.getCheckpoint(reportId);
        }
        return null;
      },
      catch: (error) => new StorageError(`Failed to get checkpoint: ${reportId}`, 'read', reportId, error as Error)
    }),

  getAllCheckpoints: () =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.getAllCheckpoints) {
          return await (window.electronAPI as any).fileSystem.getAllCheckpoints();
        }
        return [];
      },
      catch: (error) => new StorageError(`Failed to get all checkpoints`, 'read', '', error as Error)
    }),

  saveCheckpoint: (reportId: string, checkpoint: ReportCheckpoint) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.saveCheckpoint) {
          return await (window.electronAPI as any).fileSystem.saveCheckpoint(reportId, checkpoint);
        }
        return false;
      },
      catch: (error) => new StorageError(`Failed to save checkpoint: ${reportId}`, 'write', reportId, error as Error)
    }),

  deleteCheckpoint: (reportId: string) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.deleteCheckpoint) {
          return await (window.electronAPI as any).fileSystem.deleteCheckpoint(reportId);
        }
        return false;
      },
      catch: (error) => new StorageError(`Failed to delete checkpoint: ${reportId}`, 'delete', reportId, error as Error)
    }),

  // Report log operations
  getReportLog: (id: string) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.getReportLog) {
          return await (window.electronAPI as any).fileSystem.getReportLog(id);
        }
        return null;
      },
      catch: (error) => new StorageError(`Failed to get report log: ${id}`, 'read', id, error as Error)
    }),

  getAllReportLogs: () =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.getAllReportLogs) {
          return await (window.electronAPI as any).fileSystem.getAllReportLogs();
        }
        return [];
      },
      catch: (error) => new StorageError(`Failed to get all report logs`, 'read', '', error as Error)
    }),

  saveReportLog: (reportLog: ReportLog) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.saveReportLog) {
          return await (window.electronAPI as any).fileSystem.saveReportLog(reportLog);
        }
        return false;
      },
      catch: (error) => new StorageError(`Failed to save report log: ${reportLog.id}`, 'write', reportLog.id, error as Error)
    }),

  deleteReportLog: (id: string) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.deleteReportLog) {
          return await (window.electronAPI as any).fileSystem.deleteReportLog(id);
        }
        return false;
      },
      catch: (error) => new StorageError(`Failed to delete report log: ${id}`, 'delete', id, error as Error)
    }),

  // Generation state operations
  getGenerationState: (reportId: string) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.getGenerationState) {
          return await (window.electronAPI as any).fileSystem.getGenerationState(reportId);
        }
        return null;
      },
      catch: (error) => new StorageError(`Failed to get generation state: ${reportId}`, 'read', reportId, error as Error)
    }),

  getAllGenerationStates: () =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.getAllGenerationStates) {
          return await (window.electronAPI as any).fileSystem.getAllGenerationStates();
        }
        return [];
      },
      catch: (error) => new StorageError(`Failed to get all generation states`, 'read', '', error as Error)
    }),

  saveGenerationState: (reportId: string, state: Omit<ReportGenerationState, 'abortController'>) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.saveGenerationState) {
          return await (window.electronAPI as any).fileSystem.saveGenerationState(reportId, state);
        }
        return false;
      },
      catch: (error) => new StorageError(`Failed to save generation state: ${reportId}`, 'write', reportId, error as Error)
    }),

  deleteGenerationState: (reportId: string) =>
    Effect.tryPromise({
      try: async () => {
        if ((window.electronAPI as any)?.fileSystem?.deleteGenerationState) {
          return await (window.electronAPI as any).fileSystem.deleteGenerationState(reportId);
        }
        return false;
      },
      catch: (error) => new StorageError(`Failed to delete generation state: ${reportId}`, 'delete', reportId, error as Error)
    })
});
