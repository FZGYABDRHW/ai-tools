import { Context, Effect } from 'effect';
import OpenAI from 'openai';
import { settingsService } from '../../settingsService';

export interface OpenAIService {
  readonly chatJSON: (system: string, user: string) => Effect.Effect<string, Error>;
}

export const OpenAIServiceTag = Context.GenericTag<OpenAIService>('OpenAIService');

export const makeOpenAIService = (apiKey?: string): OpenAIService => {
  const getApiKey = (): string => {
    const fromArg = apiKey && apiKey.trim();
    const fromSettings = settingsService.getOpenAIKey?.() || '';
    const fromLocal = (typeof localStorage !== 'undefined' && localStorage.getItem('openai_api_key')) || '';
    const fromEnv = (typeof process !== 'undefined' && (process as any).env && (process as any).env.OPENAI_API_KEY) || '';
    return (fromArg || fromSettings || fromLocal || fromEnv || '').trim();
  };

  return {
    chatJSON: (system: string, user: string) =>
      Effect.tryPromise({
        try: async () => {
          const key = getApiKey();
          if (!key) {
            // Diagnostic: surface missing key clearly in console
            // Do not log any stored values
            // eslint-disable-next-line no-console
            console.warn('[OpenAIService] No API key configured (settings/localStorage/env)');
            throw new Error('OpenAI API key is not configured');
          }
          // eslint-disable-next-line no-console
          console.log(`[OpenAIService] Preparing OpenAI request (key length=${key.length})`);
          const client = new OpenAI({ dangerouslyAllowBrowser: true, apiKey: key });
          const res = await client.chat.completions.create({
            model: 'o3',
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user }
            ]
          });
          return (res.choices[0]?.message?.content ?? '').trim();
        },
        catch: (e) => e as Error
      })
  };
};
