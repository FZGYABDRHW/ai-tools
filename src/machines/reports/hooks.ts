import { useEffect, useMemo } from 'react';
import { useActor, useMachine } from '@xstate/react';
import reportMachine from './reportMachine';
import reportsListMachine from './listMachine';
import reportsRegistryMachine from './registryMachine';

export const useReportsList = () => {
  const [state, send] = useMachine(reportsListMachine);
  const reports = state.context.reports;
  const filters = state.context.filters;
  const isLoading = state.context.isLoading;
  const error = state.context.error;

  return {
    reports,
    filters,
    isLoading,
    error,
    refresh: () => send({ type: 'REFRESH' }),
    setFilters: (filters: typeof state.context.filters) => send({ type: 'FILTER', filters }),
    create: (name: string, prompt: string) => send({ type: 'CREATE', name, prompt }),
    update: (id: string, updates: { name?: string; prompt?: string }) => send({ type: 'UPDATE', id, updates }),
    remove: (id: string) => send({ type: 'DELETE', id })
  };
};

export const useReport = (reportId: string, options?: { authToken?: string; server?: 'EU' | 'RU' }) => {
  const [state, send] = useMachine(reportMachine, { input: { reportId, authToken: options?.authToken, server: options?.server } });

  useEffect(() => {
    send({ type: 'LOAD', id: reportId });
  }, [reportId, send]);

  return {
    state,
    context: state.context,
    load: () => send({ type: 'LOAD', id: reportId }),
    generate: (prompt: string, parameters?: any) => send({ type: 'GENERATE', prompt, parameters }),
    pause: () => send({ type: 'PAUSE' }),
    resume: () => send({ type: 'RESUME' }),
    cancel: () => send({ type: 'CANCEL' }),
    rerunFromCompleted: () => send({ type: 'RERUN_FROM_COMPLETED' }),
    restartFromFailed: () => send({ type: 'RESTART_FROM_FAILED' })
  };
};

export const useReportsRegistry = () => {
  const [state, send] = useMachine(reportsRegistryMachine);

  return {
    actorRefs: state.context.actors,
    generatingIds: useMemo(() => Array.from(state.context.generating), [state.context.generating]),
    register: (id: string) => send({ type: 'REGISTER', id }),
    unregister: (id: string) => send({ type: 'UNREGISTER', id }),
    generate: (id: string, prompt: string, parameters?: any) => send({ type: 'GENERATE', id, prompt, parameters }),
    pause: (id: string) => send({ type: 'PAUSE', id }),
    resume: (id: string) => send({ type: 'RESUME', id }),
    cancel: (id: string) => send({ type: 'CANCEL', id }),
    rerunFromCompleted: (id: string) => send({ type: 'RERUN_FROM_COMPLETED', id }),
    restartFromFailed: (id: string) => send({ type: 'RESTART_FROM_FAILED', id })
  };
};
