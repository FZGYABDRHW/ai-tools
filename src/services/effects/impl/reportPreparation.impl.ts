import { Context, Effect } from 'effect';
import { FileSystemService, FileSystemServiceTag } from './fileSystem.impl';
import { ParameterExtractionServiceFx, ParameterExtractionServiceFxTag } from './parameterExtraction.impl';
import { SchemaDerivationService, SchemaDerivationServiceTag } from './schemaDerivation.impl';
import { ReportGenerationState, GenerationStatus } from '../shared-types';

export interface ReportPreparationService {
  readonly prepare: (
    reportId: string,
    prompt: string
  ) => Effect.Effect<{ parameters: any; columns: string[] }, Error, FileSystemService | ParameterExtractionServiceFx | SchemaDerivationService | import('./openai.impl').OpenAIService>;
}

export const ReportPreparationServiceTag = Context.GenericTag<ReportPreparationService>('ReportPreparationService');

export const makeReportPreparationService = (): ReportPreparationService => ({
  prepare: (reportId: string, prompt: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;
      const paramSvc = yield* ParameterExtractionServiceFxTag;
      const schemaSvc = yield* SchemaDerivationServiceTag;
      // eslint-disable-next-line no-console
      console.log('[Preparation] Started for report', reportId);
      const { parameters, humanReadable } = yield* paramSvc.extract(prompt);
      const columns = yield* schemaSvc.derive(prompt);

      const header = columns.join(',');
      const csv = `${header}\n`;

      const initial: ReportGenerationState = {
        reportId,
        status: 'preparing' as GenerationStatus,
        progress: null,
        tableData: { columns: [...columns], results: [], csv },
        startTime: Date.now(),
        extractedParameters: { parameters, humanReadable },
        parameters
      } as any;

      yield* fs.saveGenerationState(reportId, initial);
      // Persist to report record so Results panel can render header immediately
      try {
        const existing = (yield* fs.getReport(reportId)) as any;
        if (existing) {
          const updated = { ...existing, tableData: initial.tableData, extractedParameters: initial.extractedParameters, updatedAt: new Date().toISOString() };
          yield* fs.saveReport(updated as any);
        }
      } catch {}
      // eslint-disable-next-line no-console
      console.log('[Preparation] State persisted', { columnsCount: columns.length });
      return { parameters, columns };
    })
});


