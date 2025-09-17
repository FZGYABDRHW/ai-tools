import { Context, Effect } from 'effect';
import OpenAI from 'openai';

export interface OpenAIService {
  readonly chatJSON: (system: string, user: string) => Effect.Effect<string, Error>;
}

export const OpenAIServiceTag = Context.GenericTag<OpenAIService>('OpenAIService');

export const makeOpenAIService = (apiKey?: string): OpenAIService => {
  const client = new OpenAI({ dangerouslyAllowBrowser: true, apiKey: apiKey || localStorage.getItem('openai_api_key') || '' });
  return {
    chatJSON: (system: string, user: string) =>
      Effect.tryPromise({
        try: async () => {
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


