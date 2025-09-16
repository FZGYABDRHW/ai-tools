import { Report } from '../../types';
import { TaskListParameters, ExtractedParameters } from '../../services/parameterExtractionService';

export type ReportLifecycleState =
  | 'idle'
  | 'loading'
  | 'generating'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ReportGenerationPhase = 'preparing' | 'processing' | 'finalizing';

export interface ReportProgress {
  processed: number;
  total: number;
  percentage: number;
  etaMs?: number;
}

export interface ReportCheckpointSummary {
  reportId: string;
  status: 'in_progress' | 'completed' | 'failed' | 'paused';
  currentTaskIndex: number;
  totalTasks: number;
  startOffset: number;
}

export interface ReportActorContext {
  reportId: string;
  report?: Report | null;
  prompt?: string;
  lifecycle: ReportLifecycleState;
  generationPhase?: ReportGenerationPhase;
  progress?: ReportProgress | null;
  extractedParameters?: ExtractedParameters;
  parameters?: TaskListParameters;
  error?: string | null;
  checkpoint?: ReportCheckpointSummary | null;
  authToken?: string;
  server?: 'EU' | 'RU';
}

export type ReportActorEvent =
  | { type: 'LOAD'; id: string }
  | { type: 'LOADED'; report: Report }
  | { type: 'LOAD_FAILED'; error: string }
  | { type: 'GENERATE'; prompt: string; parameters?: TaskListParameters }
  | { type: 'PROGRESS'; processed: number; total: number; etaMs?: number }
  | { type: 'EXTRACTED_PARAMS'; extracted: ExtractedParameters }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'CANCEL' }
  | { type: 'COMPLETED' }
  | { type: 'FAILED'; error: string }
  | { type: 'RESET_TO_READY' }
  | { type: 'RERUN_FROM_COMPLETED' }
  | { type: 'RESTART_FROM_FAILED' }
  | { type: 'SYNC_CHECKPOINT'; checkpoint: ReportCheckpointSummary | null };

export interface ReportsListFilters {
  query?: string;
  status?: 'all' | 'ready' | 'in_progress' | 'paused' | 'completed' | 'failed';
}

export interface ReportsListContext {
  reports: Report[];
  filters: ReportsListFilters;
  isLoading: boolean;
  error?: string | null;
}

export type ReportsListEvent =
  | { type: 'REFRESH' }
  | { type: 'REFRESHED'; reports: Report[] }
  | { type: 'REFRESH_FAILED'; error: string }
  | { type: 'CREATE'; name: string; prompt: string }
  | { type: 'CREATED'; report: Report }
  | { type: 'CREATE_FAILED'; error: string }
  | { type: 'UPDATE'; id: string; updates: Partial<Pick<Report, 'name' | 'prompt'>> }
  | { type: 'UPDATED'; report: Report }
  | { type: 'UPDATE_FAILED'; error: string }
  | { type: 'DELETE'; id: string }
  | { type: 'DELETED'; id: string }
  | { type: 'DELETE_FAILED'; error: string }
  | { type: 'FILTER'; filters: ReportsListFilters };

export interface ReportsRegistryContext {
  // Map of reportId to actor ref id (string) for simplicity
  actors: Record<string, any>;
  // Track generating report ids for quick lookup
  generating: Set<string>;
  // Subscriptions to child actors to manage cleanup
  subscriptions?: Record<string, { unsubscribe: () => void } | undefined>;
  // Concurrency control
  concurrencyLimit?: number;
  queue?: Array<{ id: string; prompt: string; parameters?: TaskListParameters }>;
}

export type ReportsRegistryEvent =
  | { type: 'REGISTER'; id: string }
  | { type: 'UNREGISTER'; id: string }
  | { type: 'GENERATE'; id: string; prompt: string; parameters?: TaskListParameters }
  | { type: 'PAUSE'; id: string }
  | { type: 'RESUME'; id: string }
  | { type: 'CANCEL'; id: string }
  | { type: 'RERUN_FROM_COMPLETED'; id: string }
  | { type: 'RESTART_FROM_FAILED'; id: string }
  | { type: 'SYNC_FROM_STORAGE' }
  | { type: 'SET_CONCURRENCY'; value: number }
  | { type: 'DEQUEUE_AND_START' }
  | { type: 'CHILD_PROGRESS'; id: string; processed: number; total: number }
  | { type: 'CHILD_COMPLETED'; id: string }
  | { type: 'CHILD_FAILED'; id: string; error: string };
