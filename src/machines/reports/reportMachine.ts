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
    generation: fromCallback(({ input, sendBack }) => {
      const {
        reportId,
        prompt,
        parameters,
        authToken,
        server
      } = input as { reportId: string; prompt: string; parameters?: TaskListParameters; authToken?: string; server?: 'EU' | 'RU' };

      const token = authToken || localStorage.getItem('authToken') || '';
      const selectedServer = server || (localStorage.getItem('selectedServer') as 'EU' | 'RU') || 'EU';

      // Handle async operation inside the callback
      effectsApi.getResumeOffset(reportId).then(startOffset => {
        void effectsApi.startGeneration({
          reportId,
          reportText: prompt,
          authToken: token,
          selectedServer,
          onProgress: (progress) => {
            const processed = progress?.results?.length || 0;
            const total = progress?.results?.length || 0;
            sendBack({ type: 'PROGRESS', processed, total });
          },
          onComplete: () => {
            sendBack({ type: 'COMPLETED' });
          },
          onError: (error) => {
            sendBack({ type: 'FAILED', error: (error as Error)?.message || 'Generation failed' });
          },
          startOffset,
          parameters
        });
      });

      return () => {
        // Cleanup is handled externally via stop/cancel
      };
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
          target: 'generating.preparing',
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
              generationPhase: 'preparing' as ReportGenerationPhase,
              progress: { processed: 0, total: 0, percentage: 0 } as ReportProgress,
              error: null
            };
          })
        }
      }
    },
    loading: {
      entry: assign({ lifecycle: 'loading' as const, error: null }),
      invoke: {
        src: 'loadReport',
        input: ({ context }) => ({ reportId: context.reportId }),
        onDone: {
          target: 'idle',
          actions: assign(({ event }) => ({ report: event.output as Report, error: null }))
        },
        onError: {
          target: 'idle',
          actions: assign(({ event }) => ({ error: (event.error as Error)?.message || 'Failed to load report' }))
        }
      }
    },
    generating: {
      initial: 'preparing',
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
        preparing: {
          entry: assign({ generationPhase: 'preparing' as const }),
          always: [
            {
              target: 'preparingFailed',
              guard: ({ context }) => Boolean(context.extractedParameters && context.extractedParameters.isValid === false),
              actions: assign(({ context }) => ({
                error: context.extractedParameters?.errors?.join?.(', ') || 'Invalid parameters'
              }))
            }
          ],
          invoke: {
            src: 'syncCheckpoint',
            input: ({ context }) => ({ reportId: context.reportId }),
            onDone: {
              target: 'processing',
              actions: assign(({ event, context }) => {
                const cp = event.output as any;
                const checkpoint = cp ? {
                  reportId: context.reportId,
                  status: cp.status,
                  currentTaskIndex: cp.currentTaskIndex,
                  totalTasks: cp.totalTasks,
                  startOffset: cp.startOffset
                } : null;
                return { checkpoint };
              })
            },
            onError: {
              target: 'processing'
            }
          },
          on: {
            PAUSE: {
              target: 'preparingPaused',
              actions: ({ context }) => { void (async () => { await effectsApi.markCheckpointPaused(context.reportId); await effectsApi.updateGenerationStatus(context.reportId, 'paused'); })(); }
            },
            CANCEL: {
              target: 'preparingCancelling'
            }
          }
        },
        preparingPaused: {
          entry: [
            assign({ lifecycle: 'paused' as const, generationPhase: 'preparing' as const }),
            ({ context }) => { void (async () => { await effectsApi.markCheckpointPaused(context.reportId); await effectsApi.updateGenerationStatus(context.reportId, 'paused'); })(); }
          ],
          on: {
            RESUME: 'preparing',
            CANCEL: 'preparingCancelling'
          }
        },
        preparingCancelling: {
          entry: [
            assign({ lifecycle: 'cancelled' as const }),
            ({ context }) => { void (async () => { await effectsApi.stopGeneration(context.reportId); await effectsApi.clearGeneration(context.reportId); await effectsApi.clearCheckpoint(context.reportId); })(); }
          ],
          always: '#reportMachine.idle'
        },
        preparingFailed: {
          entry: assign({ lifecycle: 'failed' as const }),
          // User can trigger GENERATE again to retry after fixing prompt/params
          on: {}
        },
        processing: {
          entry: assign({ generationPhase: 'processing' as const, lifecycle: 'generating' as const }),
          on: {
            PROGRESS: {
              actions: assign(({ event, context }) => {
                if (event.type !== 'PROGRESS') return {};
                const processed = event.processed;
                const total = context.checkpoint?.totalTasks ?? Math.max(event.processed, context.progress?.total || 0);
                const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
                return { progress: { processed, total, percentage, etaMs: event.etaMs } };
              })
            },
            EXTRACTED_PARAMS: {
              actions: assign(({ event }) => (event.type === 'EXTRACTED_PARAMS' ? { extractedParameters: event.extracted } : {}))
            },
            COMPLETED: {
              target: 'finalizing'
            },
            FAILED: {
              target: '#reportMachine.failed',
              actions: assign(({ event }) => (event.type === 'FAILED' ? { error: event.error } : {}))
            }
          },
          invoke: {
            src: 'generation',
            input: ({ context }) => ({
              reportId: context.reportId,
              prompt: context.prompt || context.report?.prompt || '',
              parameters: context.parameters,
              authToken: context.authToken,
              server: context.server
            })
          }
        },
        finalizing: {
          entry: assign({ generationPhase: 'finalizing' as const }),
          always: '#reportMachine.completed'
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
