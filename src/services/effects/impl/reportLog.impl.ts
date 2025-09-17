import { Effect, Context } from 'effect';
import {
  ReportLog,
  TableData,
  ExtractedParameters,
  StorageError
} from '../shared-types';
import { FileSystemService, FileSystemServiceTag } from './fileSystem.impl';

// ============================================================================
// Parameter Types
// ============================================================================

export interface CreateReportLogParams {
  readonly reportId: string;
  readonly reportName: string;
  readonly prompt: string;
  readonly tableData: TableData;
  readonly totalTasks: number;
  readonly processedTasks: number;
  readonly startTime: number;
  readonly status: 'completed' | 'failed';
  readonly errorMessage?: string;
  readonly extractedParameters?: ExtractedParameters;
}

// ============================================================================
// Service Interface
// ============================================================================

export interface ReportLogService {
  readonly createFromReportGeneration: (params: CreateReportLogParams) => Effect.Effect<ReportLog, StorageError, FileSystemService>;
}

// ============================================================================
// Service Tag
// ============================================================================

export const ReportLogServiceTag = Context.GenericTag<ReportLogService>('ReportLogService');

export const makeReportLogService = (): ReportLogService => ({
  createFromReportGeneration: (params: CreateReportLogParams) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const completedAt = new Date().toISOString();
      const duration = Date.now() - params.startTime;

      const newReportLog: ReportLog = {
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

      yield* fs.saveReportLog(newReportLog);
      return newReportLog;
    })
});
