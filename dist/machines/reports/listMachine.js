"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstate_1 = require("xstate");
const compatibility_1 = require("../../services/effects/compatibility");
const initialContext = {
    reports: [],
    filters: { status: 'all' },
    isLoading: false,
    error: null
};
exports.default = (0, xstate_1.setup)({
    types: {},
    actors: {
        loadReports: (0, xstate_1.fromPromise)(async () => {
            const reports = await compatibility_1.reportService.getAllReportsWithSync();
            return reports;
        }),
        createReport: (0, xstate_1.fromPromise)(async ({ input }) => {
            return await compatibility_1.reportService.createReport({ name: input.name, prompt: input.prompt });
        }),
        updateReport: (0, xstate_1.fromPromise)(async ({ input }) => {
            return await compatibility_1.reportService.updateReport(input.id, input.updates);
        }),
        deleteReport: (0, xstate_1.fromPromise)(async ({ input }) => {
            await compatibility_1.reportService.deleteReport(input.id);
            return true;
        })
    }
}).createMachine({
    id: 'reportsList',
    initial: 'idle',
    context: initialContext,
    states: {
        idle: {
            on: {
                REFRESH: 'loading',
                FILTER: {
                    target: 'idle',
                    actions: (0, xstate_1.assign)(({ event }) => (event.type === 'FILTER' ? { filters: event.filters } : {}))
                }
            }
        },
        loading: {
            entry: (0, xstate_1.assign)({ isLoading: true, error: null }),
            invoke: {
                src: 'loadReports',
                onDone: {
                    target: 'ready',
                    actions: (0, xstate_1.assign)(({ event }) => ({ reports: event.output, isLoading: false }))
                },
                onError: {
                    target: 'idle',
                    actions: (0, xstate_1.assign)(({ event }) => ({ error: event.error?.message || 'Failed to load reports', isLoading: false }))
                }
            }
        },
        ready: {
            on: {
                REFRESH: 'loading',
                FILTER: {
                    target: 'ready',
                    actions: (0, xstate_1.assign)(({ event }) => (event.type === 'FILTER' ? { filters: event.filters } : {}))
                },
                CREATE: {
                    target: 'creating'
                },
                UPDATE: {
                    target: 'updating'
                },
                DELETE: {
                    target: 'deleting'
                }
            }
        },
        creating: {
            invoke: {
                src: 'createReport',
                input: ({ event }) => (event.type === 'CREATE' ? { name: event.name, prompt: event.prompt } : { name: '', prompt: '' }),
                onDone: {
                    target: 'loading'
                },
                onError: {
                    target: 'ready',
                    actions: (0, xstate_1.assign)(({ event }) => ({ error: event.error?.message || 'Failed to create report' }))
                }
            }
        },
        updating: {
            invoke: {
                src: 'updateReport',
                input: ({ event }) => (event.type === 'UPDATE' ? { id: event.id, updates: event.updates } : { id: '', updates: {} }),
                onDone: {
                    target: 'loading'
                },
                onError: {
                    target: 'ready',
                    actions: (0, xstate_1.assign)(({ event }) => ({ error: event.error?.message || 'Failed to update report' }))
                }
            }
        },
        deleting: {
            invoke: {
                src: 'deleteReport',
                input: ({ event }) => (event.type === 'DELETE' ? { id: event.id } : { id: '' }),
                onDone: {
                    target: 'loading'
                },
                onError: {
                    target: 'ready',
                    actions: (0, xstate_1.assign)(({ event }) => ({ error: event.error?.message || 'Failed to delete report' }))
                }
            }
        }
    }
});
//# sourceMappingURL=listMachine.js.map