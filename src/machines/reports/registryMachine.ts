import { setup, createActor, assign } from 'xstate';
import reportMachine from './reportMachine';
import { ReportsRegistryContext, ReportsRegistryEvent } from './types';
import { reportGenerationService } from '../../services/reportGenerationService';

type ReportActorRef = any;

const initialContext: ReportsRegistryContext = {
  actors: {},
  generating: new Set<string>(),
  subscriptions: {},
  concurrencyLimit: 2,
  queue: []
};

export default setup({
  types: {} as {
    context: ReportsRegistryContext;
    events: ReportsRegistryEvent;
    emitted: never;
  }
}).createMachine({
  id: 'reportsRegistry',
  initial: 'ready',
  context: initialContext,
  states: {
    ready: {
      entry: assign(({ context }) => {
        // Sync active generations on entry
        try {
          const { settingsService } = require('../../services/settingsService');
          const limit = settingsService.getConcurrencyLimit();
          context.concurrencyLimit = limit;
        } catch {}
        const active = reportGenerationService.getActiveGenerations();
        const nextActors = { ...context.actors } as Record<string, ReportActorRef>;
        const subs = { ...(context.subscriptions || {}) } as NonNullable<ReportsRegistryContext['subscriptions']>;
        active.forEach((_state, id) => {
          if (!nextActors[id]) {
            const ref = createActor(reportMachine, { input: { reportId: id } });
            ref.start();
            nextActors[id] = ref;
          }
        });
        return { actors: nextActors, subscriptions: subs };
      }),
      on: {
        REGISTER: {
          actions: assign(({ context, event, self }) => {
            if (event.type !== 'REGISTER') return {};
            if (context.actors[event.id]) return {};
            const ref = createActor(reportMachine, { input: { reportId: event.id } });
            ref.start();
            const subscriptions = { ...(context.subscriptions || {}) } as NonNullable<ReportsRegistryContext['subscriptions']>;
            const subscription = ref.subscribe((snapshot: any) => {
              if (snapshot?.value === 'completed' || snapshot?.matches?.('completed')) {
                (self as any).send({ type: 'CHILD_COMPLETED', id: event.id });
              } else if (snapshot?.value === 'failed' || snapshot?.matches?.('failed')) {
                (self as any).send({ type: 'CHILD_FAILED', id: event.id, error: snapshot?.context?.error || '' });
              } else if (snapshot?.matches?.('generating')) {
                (self as any).send({ type: 'CHILD_PROGRESS', id: event.id, processed: snapshot?.context?.progress?.processed || 0, total: snapshot?.context?.progress?.total || 0 });
              }
            });
            subscriptions[event.id] = { unsubscribe: () => subscription.unsubscribe?.() };
            return { actors: { ...context.actors, [event.id]: ref }, subscriptions };
          })
        },
        UNREGISTER: {
          actions: assign(({ context, event }) => {
            if (event.type !== 'UNREGISTER') return {};
            const ref = context.actors[event.id] as ReportActorRef | undefined;
            if (ref) ref.stop();
            const { [event.id]: _removed, ...rest } = context.actors;
            const nextGenerating = new Set(context.generating);
            nextGenerating.delete(event.id);
            const subs = { ...(context.subscriptions || {}) };
            if (subs[event.id]) {
              subs[event.id]?.unsubscribe?.();
              delete subs[event.id];
            }
            return { actors: rest, generating: nextGenerating, subscriptions: subs };
          })
        },
        GENERATE: {
          actions: assign(({ context, event }) => {
            if (event.type !== 'GENERATE') return {};
            const ref = context.actors[event.id] as ReportActorRef | undefined;
            const running = context.generating.size;
            const limit = context.concurrencyLimit ?? 2;
            if (running < limit) {
              ref?.send({ type: 'GENERATE', prompt: event.prompt, parameters: event.parameters });
              const nextGenerating = new Set(context.generating);
              nextGenerating.add(event.id);
              return { generating: nextGenerating };
            } else {
              const nextQueue = [...(context.queue || []), { id: event.id, prompt: event.prompt, parameters: event.parameters }];
              return { queue: nextQueue };
            }
          })
        },
        PAUSE: {
          actions: ({ context, event }) => {
            if (event.type !== 'PAUSE') return;
            const ref = context.actors[event.id] as ReportActorRef | undefined;
            if (ref) ref.send({ type: 'PAUSE' });
          }
        },
        RESUME: {
          actions: ({ context, event }) => {
            if (event.type !== 'RESUME') return;
            const ref = context.actors[event.id] as ReportActorRef | undefined;
            if (ref) ref.send({ type: 'RESUME' });
          }
        },
        CANCEL: {
          actions: ({ context, event }) => {
            if (event.type !== 'CANCEL') return;
            const ref = context.actors[event.id] as ReportActorRef | undefined;
            if (ref) ref.send({ type: 'CANCEL' });
          }
        },
        RERUN_FROM_COMPLETED: {
          actions: ({ context, event }) => {
            if (event.type !== 'RERUN_FROM_COMPLETED') return;
            const ref = context.actors[event.id] as ReportActorRef | undefined;
            if (ref) ref.send({ type: 'RERUN_FROM_COMPLETED' });
          }
        },
        RESTART_FROM_FAILED: {
          actions: ({ context, event }) => {
            if (event.type !== 'RESTART_FROM_FAILED') return;
            const ref = context.actors[event.id] as ReportActorRef | undefined;
            if (ref) ref.send({ type: 'RESTART_FROM_FAILED' });
          }
        },
        CHILD_PROGRESS: {
          actions: assign(({ context, event }) => {
            if (event.type !== 'CHILD_PROGRESS') return {};
            const next = new Set(context.generating);
            next.add(event.id);
            return { generating: next };
          })
        },
        CHILD_COMPLETED: {
          actions: assign(({ context, event, self }) => {
            if (event.type !== 'CHILD_COMPLETED') return {};
            const next = new Set(context.generating);
            next.delete(event.id);
            const dequeued = (context.queue || []).shift();
            if (dequeued) {
              const ref = context.actors[dequeued.id] as ReportActorRef | undefined;
              ref?.send({ type: 'GENERATE', prompt: dequeued.prompt, parameters: dequeued.parameters });
              next.add(dequeued.id);
            }
            return { generating: next, queue: [...(context.queue || [])] };
          })
        },
        CHILD_FAILED: {
          actions: assign(({ context, event }) => {
            if (event.type !== 'CHILD_FAILED') return {};
            const next = new Set(context.generating);
            next.delete(event.id);
            const dequeued = (context.queue || []).shift();
            if (dequeued) {
              const ref = context.actors[dequeued.id] as ReportActorRef | undefined;
              ref?.send({ type: 'GENERATE', prompt: dequeued.prompt, parameters: dequeued.parameters });
              next.add(dequeued.id);
            }
            return { generating: next, queue: [...(context.queue || [])] };
          })
        }
        ,
        SET_CONCURRENCY: {
          actions: assign(({ context, event }) => (event.type === 'SET_CONCURRENCY' ? { concurrencyLimit: Math.max(1, event.value) } : {}))
        }
      }
    }
  }
});
