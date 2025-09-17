import { Effect, Context } from 'effect';
import {
  Report,
  TableData,
  ExtractedParameters,
  StorageError
} from '../shared-types';
import { FileSystemService, FileSystemServiceTag } from './fileSystem.impl';

// ============================================================================
// Service Interface
// ============================================================================

export interface ReportService {
  readonly getReportById: (id: string) => Effect.Effect<Report | null, StorageError, FileSystemService>;
  readonly createReport: (request: { name: string; prompt: string }) => Effect.Effect<Report, StorageError, FileSystemService>;
  readonly saveReportData: (id: string, tableData: TableData, extractedParameters?: ExtractedParameters) => Effect.Effect<Report | null, StorageError, FileSystemService>;
  readonly clearReportData: (id: string) => Effect.Effect<Report | null, StorageError, FileSystemService>;
}

// ============================================================================
// Service Tag
// ============================================================================

export const ReportServiceTag = Context.GenericTag<ReportService>('ReportService');

export const makeReportService = (): ReportService => ({
  getReportById: (id: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      return yield* fs.getReport(id);
    }),

  createReport: (request: { name: string; prompt: string }) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const newReport: Report = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: request.name.trim(),
        prompt: request.prompt || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      yield* fs.saveReport(newReport);
      return newReport;
    }),

  saveReportData: (id: string, tableData: TableData, extractedParameters?: ExtractedParameters) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const existingReport = yield* fs.getReport(id);
      if (!existingReport) return null;

      const updatedReport: Report = {
        ...existingReport,
        tableData: tableData ? {
          columns: [...tableData.columns],
          results: [...tableData.results],
          csv: tableData.csv
        } : undefined,
        extractedParameters: extractedParameters ? {
          parameters: extractedParameters.parameters,
          humanReadable: [...extractedParameters.humanReadable]
        } : undefined,
        lastGeneratedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      yield* fs.saveReport(updatedReport);
      return updatedReport;
    }),

  clearReportData: (id: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const existingReport = yield* fs.getReport(id);
      if (!existingReport) return null;

      const { tableData, extractedParameters, lastGeneratedAt, ...reportWithoutData } = existingReport;
      const clearedReport: Report = {
        ...reportWithoutData,
        updatedAt: new Date().toISOString()
      };
      yield* fs.saveReport(clearedReport);
      return clearedReport;
    })
});
