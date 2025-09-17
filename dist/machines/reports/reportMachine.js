"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialReportContext = void 0;
const xstate_1 = require("xstate");
const compatibility_1 = require("../../services/effects/compatibility");
const parameterExtractionService_1 = require("../../services/parameterExtractionService");
const createInitialReportContext = (reportId, authToken, server) => ({
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
exports.createInitialReportContext = createInitialReportContext;
exports.default = (0, xstate_1.setup)({
    types: {},
    actors: {
        loadReport: (0, xstate_1.fromPromise)(async ({ input }) => {
            const report = await compatibility_1.reportService.getReportByIdAsync(input.reportId);
            return report;
        }),
        syncCheckpoint: (0, xstate_1.fromPromise)(async ({ input }) => {
            return compatibility_1.reportCheckpointService.getCheckpoint(input.reportId);
        }),
        generation: (0, xstate_1.fromCallback)(({ input, sendBack }) => {
            const { reportId, prompt, parameters, authToken, server } = input;
            const token = authToken || localStorage.getItem('authToken') || '';
            const selectedServer = server || localStorage.getItem('selectedServer') || 'EU';
            // Handle async operation inside the callback
            compatibility_1.reportCheckpointService.getResumeOffset(reportId).then(startOffset => {
                void compatibility_1.reportGenerationService.startGeneration(reportId, prompt, token, selectedServer, (progress) => {
                    const processed = progress?.results?.length || 0;
                    const total = progress?.results?.length || 0;
                    sendBack({ type: 'PROGRESS', processed, total });
                    if (progress?.extractedParameters) {
                        sendBack({ type: 'EXTRACTED_PARAMS', extracted: progress.extractedParameters });
                    }
                }, () => {
                    sendBack({ type: 'COMPLETED' });
                }, (error) => {
                    sendBack({ type: 'FAILED', error: error?.message || 'Generation failed' });
                }, startOffset, parameters);
            });
            return () => {
                // Cleanup is handled externally via stop/cancel
            };
        })
    }
}).createMachine({
    id: 'reportMachine',
    initial: 'idle',
    context: ({ input }) => (0, exports.createInitialReportContext)(input.reportId, input.authToken, input.server),
    input: {},
    states: {
        idle: {
            on: {
                LOAD: {
                    target: 'loading'
                },
                GENERATE: {
                    target: 'generating.preparing',
                    actions: (0, xstate_1.assign)(({ context, event }) => {
                        if (event.type !== 'GENERATE')
                            return {};
                        const extracted = event.parameters
                            ? { parameters: event.parameters, humanReadable: [], isValid: true, errors: [] }
                            : parameterExtractionService_1.ParameterExtractionService.extractParameters(event.prompt);
                        return {
                            prompt: event.prompt,
                            parameters: extracted.parameters,
                            extractedParameters: extracted,
                            lifecycle: 'generating',
                            generationPhase: 'preparing',
                            progress: { processed: 0, total: 0, percentage: 0 },
                            error: null
                        };
                    })
                }
            }
        },
        loading: {
            entry: (0, xstate_1.assign)({ lifecycle: 'loading', error: null }),
            invoke: {
                src: 'loadReport',
                input: ({ context }) => ({ reportId: context.reportId }),
                onDone: {
                    target: 'idle',
                    actions: (0, xstate_1.assign)(({ event }) => ({ report: event.output, error: null }))
                },
                onError: {
                    target: 'idle',
                    actions: (0, xstate_1.assign)(({ event }) => ({ error: event.error?.message || 'Failed to load report' }))
                }
            }
        },
        generating: {
            initial: 'preparing',
            on: {
                PAUSE: {
                    target: '.paused',
                    actions: (0, xstate_1.assign)({ lifecycle: 'paused' })
                },
                CANCEL: {
                    target: '.cancelled',
                    actions: (0, xstate_1.assign)({ lifecycle: 'cancelled' })
                },
                RESET_TO_READY: {
                    target: 'idle',
                    actions: ({ context }) => { void compatibility_1.reportGenerationService.resetToReady(context.reportId); }
                }
            },
            states: {
                preparing: {
                    entry: (0, xstate_1.assign)({ generationPhase: 'preparing' }),
                    always: [
                        {
                            target: 'preparingFailed',
                            guard: ({ context }) => Boolean(context.extractedParameters && context.extractedParameters.isValid === false),
                            actions: (0, xstate_1.assign)(({ context }) => ({
                                error: context.extractedParameters?.errors?.join?.(', ') || 'Invalid parameters'
                            }))
                        }
                    ],
                    invoke: {
                        src: 'syncCheckpoint',
                        input: ({ context }) => ({ reportId: context.reportId }),
                        onDone: {
                            target: 'processing',
                            actions: (0, xstate_1.assign)(({ event, context }) => {
                                const cp = event.output;
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
                            actions: ({ context }) => { void (async () => { await compatibility_1.reportCheckpointService.markPaused(context.reportId); await compatibility_1.reportGenerationService.updateGenerationStatus(context.reportId, 'paused'); })(); }
                        },
                        CANCEL: {
                            target: 'preparingCancelling'
                        }
                    }
                },
                preparingPaused: {
                    entry: [
                        (0, xstate_1.assign)({ lifecycle: 'paused', generationPhase: 'preparing' }),
                        ({ context }) => { void (async () => { await compatibility_1.reportCheckpointService.markPaused(context.reportId); await compatibility_1.reportGenerationService.updateGenerationStatus(context.reportId, 'paused'); })(); }
                    ],
                    on: {
                        RESUME: 'preparing',
                        CANCEL: 'preparingCancelling'
                    }
                },
                preparingCancelling: {
                    entry: [
                        (0, xstate_1.assign)({ lifecycle: 'cancelled' }),
                        ({ context }) => { void (async () => { await compatibility_1.reportGenerationService.stopGeneration(context.reportId); await compatibility_1.reportGenerationService.clearGeneration(context.reportId); await compatibility_1.reportCheckpointService.clearCheckpoint(context.reportId); })(); }
                    ],
                    always: '#reportMachine.idle'
                },
                preparingFailed: {
                    entry: (0, xstate_1.assign)({ lifecycle: 'failed' }),
                    // User can trigger GENERATE again to retry after fixing prompt/params
                    on: {}
                },
                processing: {
                    entry: (0, xstate_1.assign)({ generationPhase: 'processing', lifecycle: 'generating' }),
                    on: {
                        PROGRESS: {
                            actions: (0, xstate_1.assign)(({ event, context }) => {
                                if (event.type !== 'PROGRESS')
                                    return {};
                                const processed = event.processed;
                                const total = context.checkpoint?.totalTasks ?? Math.max(event.processed, context.progress?.total || 0);
                                const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
                                return { progress: { processed, total, percentage, etaMs: event.etaMs } };
                            })
                        },
                        EXTRACTED_PARAMS: {
                            actions: (0, xstate_1.assign)(({ event }) => (event.type === 'EXTRACTED_PARAMS' ? { extractedParameters: event.extracted } : {}))
                        },
                        COMPLETED: {
                            target: 'finalizing'
                        },
                        FAILED: {
                            target: '#reportMachine.failed',
                            actions: (0, xstate_1.assign)(({ event }) => (event.type === 'FAILED' ? { error: event.error } : {}))
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
                    entry: (0, xstate_1.assign)({ generationPhase: 'finalizing' }),
                    always: '#reportMachine.completed'
                },
                paused: {
                    entry: ({ context }) => { void (async () => { await compatibility_1.reportGenerationService.stopGeneration(context.reportId); await compatibility_1.reportGenerationService.updateGenerationStatus(context.reportId, 'paused'); })(); },
                    on: {
                        RESUME: {
                            target: 'processing',
                            actions: ({ context }) => { void compatibility_1.reportCheckpointService.resumeCheckpoint(context.reportId); }
                        }
                    }
                },
                cancelled: {
                    entry: ({ context }) => { void (async () => { await compatibility_1.reportGenerationService.stopGeneration(context.reportId); await compatibility_1.reportGenerationService.clearGeneration(context.reportId); await compatibility_1.reportCheckpointService.clearCheckpoint(context.reportId); })(); },
                    always: '#reportMachine.idle'
                }
            }
        },
        completed: {
            entry: (0, xstate_1.assign)({ lifecycle: 'completed', generationPhase: undefined }),
            on: {
                RERUN_FROM_COMPLETED: {
                    target: 'idle',
                    actions: ({ context }) => { void compatibility_1.reportGenerationService.rerunFromCompleted(context.reportId); }
                }
            }
        },
        failed: {
            entry: (0, xstate_1.assign)({ lifecycle: 'failed' }),
            on: {
                RESTART_FROM_FAILED: {
                    target: 'idle',
                    actions: ({ context }) => { void compatibility_1.reportGenerationService.restartFromFailed(context.reportId); }
                }
            }
        }
    }
});
//# sourceMappingURL=reportMachine.js.map