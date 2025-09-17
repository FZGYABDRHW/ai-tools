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
    return (fromArg || fromSettings || fromLocal || '').trim();
  };

  return {
    chatJSON: (system: string, user: string) =>
      Effect.tryPromise({
        try: async () => {
          const key = getApiKey();
          if (!key) {
            throw new Error('OpenAI API key is not configured');
          }
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
