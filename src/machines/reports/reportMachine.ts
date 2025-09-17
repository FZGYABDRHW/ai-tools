import { assign, fromCallback, fromPromise, setup } from 'xstate';
import { Report } from '../../types';
import * as effectsApi from '../../services/effects/api';
import { ParameterExtractionService, TaskListParameters } from '../../services/parameterExtractionService';
import { ReportActorContext, ReportActorEvent, ReportGenerationPhase, ReportProgress } from './types';

export const createInitialReportContext = (reportId: string, authToken?: string, server?: 'EU' | 'RU'): ReportActorContext => ({
  reportId,
  report: null,
  lifecycle: 'idle',
  generationPhase: undefined,
  progress: null,
  extractedParameters: undefined,
  parameters: undefined,
  error: null,
  checkpoint: null,
  authToken,
  server
});

export default setup({
  types: {} as {
    context: ReportActorContext;
    events: ReportActorEvent;
    input: { reportId: string; authToken?: string; server?: 'EU' | 'RU' };
    emitted: never;
  },
  actors: {
    loadReport: fromPromise(async ({ input }: { input: { reportId: string } }) => {
      const report = await effectsApi.getReportById(input.reportId);
      return report;
    }),
    syncCheckpoint: fromPromise(async ({ input }: { input: { reportId: string } }) => {
      return effectsApi.getCheckpoint(input.reportId);
    }),
    prepareGeneration: fromPromise(async ({ input }: { input: { reportId: string; prompt: string } }) => {
      return effectsApi.prepareGeneration(input.reportId, input.prompt);
    }),
    processing: fromCallback(({ input, sendBack }) => {
      const { reportId, prompt, parameters, authToken, server } = input as { reportId: string; prompt: string; parameters?: any; authToken?: string; server?: 'EU' | 'RU' };
      const token = authToken || localStorage.getItem('authToken') || '';
      const selectedServer = server || (localStorage.getItem('selectedServer') as 'EU' | 'RU') || 'EU';
      void effectsApi.startProcessing({ reportId, prompt, authToken: token, server: selectedServer });
      return () => {};
    })
  }
}).createMachine({
  id: 'reportMachine',
  initial: 'idle',
  context: ({ input }) => createInitialReportContext(input.reportId, input.authToken, input.server),
  input: {} as { reportId: string; authToken?: string; server?: 'EU' | 'RU' },
  states: {
    idle: {
      on: {
        LOAD: {
          target: 'loading'
        },
        GENERATE: {
          target: 'preparing.extracting',
          actions: assign(({ context, event }) => {
            if (event.type !== 'GENERATE') return {};
            const extracted = event.parameters
              ? { parameters: event.parameters, humanReadable: [], isValid: true, errors: [] }
              : ParameterExtractionService.extractParameters(event.prompt);
            return {
              prompt: event.prompt,
              parameters: extracted.parameters,
              extractedParameters: extracted,
              lifecycle: 'generating' as const,
              generationPhase: 'preparing',
              progress: { processed: 0, total: 0, percentage: 0 },
              error: null
            };
          })
        }
      }
    },
    // New preparing branch decoupled from processing
    preparing: {
      initial: 'extracting',
      states: {
        extracting: {
          entry: assign({ generationPhase: 'preparing' as const }),
          invoke: {
            src: 'prepareGeneration',
            input: ({ context }) => ({ reportId: context.reportId, prompt: context.prompt || context.report?.prompt || '' }),
            onDone: {
              target: 'persisted',
              actions: assign(({ event }) => ({ parameters: (event.output as any)?.parameters }))
            },
            onError: {
              target: '#reportMachine.failed',
              actions: assign(({ event }) => ({ error: (event.error as Error)?.message || 'Preparation failed' }))
            }
          }
        },
        persisted: {
          always: '#reportMachine.generating.processing'
        }
      }
    },
    generating: {
      initial: 'processing',
      on: {
        PAUSE: {
          target: '.paused',
          actions: assign({ lifecycle: 'paused' as const })
        },
        CANCEL: {
          target: '.cancelled',
          actions: assign({ lifecycle: 'cancelled' as const })
        },
        RESET_TO_READY: {
          target: 'idle',
          actions: ({ context }) => { void effectsApi.resetToReady(context.reportId); }
        }
      },
      states: {
        processing: {
          entry: assign({ generationPhase: 'processing' as const, lifecycle: 'generating' as const }),
          invoke: {
            src: 'processing',
            input: ({ context }) => ({
              reportId: context.reportId,
              prompt: context.prompt || context.report?.prompt || '',
              parameters: context.parameters,
              authToken: context.authToken,
              server: context.server
            })
          }
        },
        paused: {
          entry: ({ context }) => { void (async () => { await effectsApi.stopGeneration(context.reportId); await effectsApi.updateGenerationStatus(context.reportId, 'paused'); })(); },
          on: {
            RESUME: {
              target: 'processing',
              actions: ({ context }) => { void effectsApi.resumeCheckpoint(context.reportId); }
            }
          }
        },
        cancelled: {
          entry: ({ context }) => { void (async () => { await effectsApi.stopGeneration(context.reportId); await effectsApi.clearGeneration(context.reportId); await effectsApi.clearCheckpoint(context.reportId); })(); },
          always: '#reportMachine.idle'
        }
      }
    },
    completed: {
      entry: assign({ lifecycle: 'completed' as const, generationPhase: undefined }),
      on: {
        RERUN_FROM_COMPLETED: {
          target: 'idle',
          actions: ({ context }) => { void effectsApi.rerunFromCompleted(context.reportId); }
        }
      }
    },
    failed: {
      entry: assign({ lifecycle: 'failed' as const }),
      on: {
        RESTART_FROM_FAILED: {
          target: 'idle',
          actions: ({ context }) => { void effectsApi.restartFromFailed(context.reportId); }
        }
      }
    }
  }
});
