import { Context, Effect } from 'effect';
import { TaskListParameters } from '../../parameterExtractionService';
import { OpenAIService, OpenAIServiceTag } from './openai.impl';

export interface ParameterExtractionServiceFx {
  readonly extract: (prompt: string) => Effect.Effect<{ parameters: TaskListParameters; humanReadable: string[] }, Error, OpenAIService>;
}

export const ParameterExtractionServiceFxTag = Context.GenericTag<ParameterExtractionServiceFx>('ParameterExtractionServiceFx');

export const makeParameterExtractionService = (): ParameterExtractionServiceFx => ({
  extract: (prompt: string) => Effect.gen(function* () {
    const ai = yield* OpenAIServiceTag;
    // Diagnostic log
    // eslint-disable-next-line no-console
    console.log('[Preparation] Parameter extraction started');
    const system = `You are a parameter extraction specialist. From the user prompt, extract task list parameters and return ONLY a JSON object with keys: limit, taskStatus, timeRangeFrom, timeRangeTo. Dates must be YYYY-MM-DD.`;
    const content = yield* ai.chatJSON(system, prompt);
    let parsed: any = {};
    try { parsed = JSON.parse(content || '{}'); } catch {}
    const parameters: TaskListParameters = {
      limit: parsed.limit,
      taskStatus: parsed.taskStatus,
      timeRangeFrom: parsed.timeRangeFrom,
      timeRangeTo: parsed.timeRangeTo
    };
    const humanReadable: string[] = [];
    if (parameters.limit) humanReadable.push(`Limit: ${parameters.limit} tasks`);
    if (parameters.taskStatus) humanReadable.push(`Status: ${parameters.taskStatus}`);
    if (parameters.timeRangeFrom && parameters.timeRangeTo) humanReadable.push(`Date Range: ${parameters.timeRangeFrom} to ${parameters.timeRangeTo}`);
    // eslint-disable-next-line no-console
    console.log('[Preparation] Parameter extraction finished', parameters);
    return { parameters, humanReadable };
  })
});
