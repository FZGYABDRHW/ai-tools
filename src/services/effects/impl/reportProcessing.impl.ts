import { Context, Effect, Ref, Schedule, Stream } from 'effect';
import { FileSystemService, FileSystemServiceTag } from './fileSystem.impl';
import { TaskSourceServiceTag } from './taskSource.impl';
import { OpenAIServiceTag } from './openai.impl';
import { ReportGenerationState, TableData } from '../shared-types';

export interface ReportProcessingService {
  readonly process: (args: {
    reportId: string;
    prompt: string;
    columns: string[];
    parameters: any;
    startOffset: number;
    authToken: string;
    server: 'EU' | 'RU';
  }) => Effect.Effect<void, Error, FileSystemService>;
}

export const ReportProcessingServiceTag = Context.GenericTag<ReportProcessingService>('ReportProcessingService');

export const makeReportProcessingService = (): ReportProcessingService => ({
  process: ({ reportId, prompt, columns, parameters, startOffset, authToken, server }) =>
    Effect.gen(function* () {
      const fs = yield* FileSystemServiceTag;

      // Resolve effective columns: prefer provided, otherwise use those from prepared state
      const stInit = yield* fs.getGenerationState(reportId);
      let effectiveColumns: string[] = Array.isArray(columns) && columns.length > 0
        ? [...columns]
        : Array.isArray(stInit?.tableData?.columns)
          ? [...(stInit!.tableData as any).columns]
          : [];
      if (!effectiveColumns.includes('taskId')) effectiveColumns.unshift('taskId');

      const resultsRef = yield* Ref.make<TableData>({ columns: effectiveColumns, results: [], csv: `${effectiveColumns.join(',')}\n` });

      // Save status to in_progress
      const st0 = yield* fs.getGenerationState(reportId);
      if (st0) {
        const updated: ReportGenerationState = { ...st0, status: 'in_progress', tableData: yield* Ref.get(resultsRef) } as any;
        yield* fs.saveGenerationState(reportId, updated);
      }

      // Command watcher: pause/stop
      // Lightweight polling loop (non-blocking)
      const watcher = yield* Effect.forkDaemon(
        Effect.gen(function* loop() {
          const cmd = yield* fs.getGenerationCommand(reportId);
          if (cmd === 'pause' || cmd === 'stop') {
            const st = yield* fs.getGenerationState(reportId);
            if (st) yield* fs.saveGenerationState(reportId, { ...st, status: 'paused' });
            yield* fs.setGenerationCommand(reportId, 'none');
            yield* Effect.interrupt;
          }
          yield* Effect.sleep(200);
          return yield* loop();
        })
      );

      // Build task stream
      const taskStream = yield* Effect.gen(function* () { const svc = yield* TaskSourceServiceTag; return svc.stream({ authToken, server, startOffset, parameters }); });

      // Process tasks with limited parallelism
      const processOne = (taskId: number) =>
        Effect.gen(function* () {
          const ai = yield* OpenAIServiceTag;
          const content = yield* ai.chatJSON(
            'You are an expert task analyst. Return ONLY a valid JSON object with exactly the requested keys. No extra keys or text.',
            `${prompt}\nReturn JSON with keys: ${effectiveColumns.join(', ')} for taskId ${taskId}.`
          );
          const parsed = yield* Effect.try({ try: () => JSON.parse(content || '{}') as Record<string, unknown>, catch: () => ({ raw: content }) as any });
          yield* Ref.update(resultsRef, (td) => {
            const row = { ...parsed, taskId } as Record<string, unknown>;
            const nextResults = [...td.results, row];
            const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
            const line = effectiveColumns.map((c) => escape((row as any)[c])).join(',');
            return { columns: td.columns, results: nextResults, csv: td.csv + line + '\n' };
          });
          // Persist immediately for visibility (in addition to periodic loop)
          try {
            const td = yield* Ref.get(resultsRef);
            const st = yield* fs.getGenerationState(reportId);
            if (st) {
              yield* fs.saveGenerationState(reportId, { ...st, tableData: td, progress: { processed: td.results.length, total: td.results.length }, status: 'in_progress' } as any);
              // Also mirror into report record so UI can render without waiting
              const existing = (yield* fs.getReport(reportId)) as any;
              if (existing) {
                const updated = { ...existing, tableData: td, updatedAt: new Date().toISOString() };
                yield* fs.saveReport(updated as any);
              }
            }
            // eslint-disable-next-line no-console
            console.log('[Processing] row appended', { total: (yield* Ref.get(resultsRef)).results.length });
          } catch {}
        });

      const concurrency = 20;
      const runStream = Stream.runForEach(taskStream, (id) => processOne(id));

      // Periodically persist progress
      const persistLoop = Effect.forever(
        Effect.gen(function* () {
          const td = yield* Ref.get(resultsRef);
          const st = yield* fs.getGenerationState(reportId);
          if (st && st.status === 'in_progress') {
            const processed = td.results.length;
            yield* fs.saveGenerationState(reportId, { ...st, tableData: td, progress: { processed, total: processed } } as any);
          }
          yield* Effect.sleep(200);
        })
      );

      // Run processing with watcher and persistence
      // Run with error handling: set failed state if stream errors
      yield* Effect.all([runStream, persistLoop]).pipe(
        Effect.catchAll((err) =>
          Effect.gen(function* () {
            // eslint-disable-next-line no-console
            console.error('[Processing] stream failed', err);
            const st = yield* fs.getGenerationState(reportId);
            if (st) {
              yield* fs.saveGenerationState(reportId, { ...st, status: 'failed', errorMessage: String((err as Error)?.message || err) } as any);
            }
            return undefined as unknown as void;
          })
        )
      );

      // Mark complete
      const finalTd = yield* Ref.get(resultsRef);
      const st = yield* fs.getGenerationState(reportId);
      if (st && st.status === 'in_progress') {
        yield* fs.saveGenerationState(reportId, { ...st, status: 'completed', tableData: finalTd } as any);
      }
    })
});
