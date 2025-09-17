import { Context, Effect } from 'effect';
import { OpenAIService, OpenAIServiceTag } from './openai.impl';

export interface SchemaDerivationService {
  readonly derive: (prompt: string) => Effect.Effect<string[], Error, OpenAIService>;
}

export const SchemaDerivationServiceTag = Context.GenericTag<SchemaDerivationService>('SchemaDerivationService');

export const makeSchemaDerivationService = (): SchemaDerivationService => ({
  derive: (prompt: string) => Effect.gen(function* () {
    const ai = yield* OpenAIServiceTag;
    // eslint-disable-next-line no-console
    console.log('[Preparation] Schema derivation started');
    const system = 'From the user prompt, output ONLY a JSON array of column names for an agile task report. Return only a JSON string.';
    const content = yield* ai.chatJSON(system, prompt);
    let columns: string[] = [];
    try {
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
        columns = parsed;
      }
    } catch {}
    if (!columns.includes('taskId')) columns.unshift('taskId');
    // eslint-disable-next-line no-console
    console.log('[Preparation] Schema derivation finished', columns);
    return columns;
  })
});
