import { assign, fromPromise, setup } from 'xstate';
import * as effectsApi from '../../services/effects/api';
const { reportService } = effectsApi as any;
import { Report } from '../../types';
import { ReportsListContext, ReportsListEvent } from './types';

const initialContext: ReportsListContext = {
  reports: [],
  filters: { status: 'all' },
  isLoading: false,
  error: null
};

export default setup({
  types: {} as {
    context: ReportsListContext;
    events: ReportsListEvent;
    emitted: never;
  },
  actors: {
    loadReports: fromPromise(async () => {
      const reports = await reportService.getAllReportsWithSync();
      return reports as Report[];
    }),
    createReport: fromPromise(async ({ input }: { input: { name: string; prompt: string } }) => {
      return await reportService.createReport({ name: input.name, prompt: input.prompt });
    }),
    updateReport: fromPromise(async ({ input }: { input: { id: string; updates: Partial<Pick<Report, 'name' | 'prompt'>> } }) => {
      return await reportService.updateReport(input.id, input.updates);
    }),
    deleteReport: fromPromise(async ({ input }: { input: { id: string } }) => {
      await reportService.deleteReport(input.id);
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
          actions: assign(({ event }) => (event.type === 'FILTER' ? { filters: event.filters } : {}))
        }
      }
    },
    loading: {
      entry: assign({ isLoading: true, error: null }),
      invoke: {
        src: 'loadReports',
        onDone: {
          target: 'ready',
          actions: assign(({ event }) => ({ reports: event.output as Report[], isLoading: false }))
        },
        onError: {
          target: 'idle',
          actions: assign(({ event }) => ({ error: (event.error as Error)?.message || 'Failed to load reports', isLoading: false }))
        }
      }
    },
    ready: {
      on: {
        REFRESH: 'loading',
        FILTER: {
          target: 'ready',
          actions: assign(({ event }) => (event.type === 'FILTER' ? { filters: event.filters } : {}))
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
          actions: assign(({ event }) => ({ error: (event.error as Error)?.message || 'Failed to create report' }))
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
          actions: assign(({ event }) => ({ error: (event.error as Error)?.message || 'Failed to update report' }))
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
          actions: assign(({ event }) => ({ error: (event.error as Error)?.message || 'Failed to delete report' }))
        }
      }
    }
  }
});
