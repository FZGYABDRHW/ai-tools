// ============================================================================
// Central Types File - Re-exports from shared and implementation files
// ============================================================================

// Re-export all shared types
export * from './shared-types';

// Re-export service interfaces and types from implementation files
export type { FileSystemService } from './impl/fileSystem.impl';
export { FileSystemServiceTag } from './impl/fileSystem.impl';

export type { ReportService } from './impl/report.impl';
export { ReportServiceTag } from './impl/report.impl';

export type {
  ReportCheckpointService,
  ReportCheckpoint,
  CompletedTask,
  CreateCheckpointParams,
  UpdateCheckpointParams
} from './impl/reportCheckpoint.impl';
export { ReportCheckpointServiceTag } from './impl/reportCheckpoint.impl';

export type {
  ReportLogService,
  CreateReportLogParams
} from './impl/reportLog.impl';
export { ReportLogServiceTag } from './impl/reportLog.impl';

export type { ReportGenerationService } from './impl/reportGeneration.impl';
export { ReportGenerationServiceTag } from './impl/reportGeneration.impl';

// ============================================================================
// Effect Types (for backward compatibility)
// ============================================================================

import { Effect } from 'effect';
import type {
  GenerationError,
  StorageError,
  CheckpointError
} from './shared-types';
import type { ReportGenerationService } from './impl/reportGeneration.impl';
import type { ReportService } from './impl/report.impl';
import type { ReportCheckpointService } from './impl/reportCheckpoint.impl';
import type { ReportLogService } from './impl/reportLog.impl';
import type { FileSystemService } from './impl/fileSystem.impl';

export type GenerationEffect<A> = Effect.Effect<A, GenerationError, ReportGenerationService | ReportService | ReportCheckpointService | ReportLogService | FileSystemService>;
export type StorageEffect<A> = Effect.Effect<A, StorageError, FileSystemService>;
export type CheckpointEffect<A> = Effect.Effect<A, CheckpointError, ReportCheckpointService | FileSystemService>;

// ============================================================================
// Service Layer Type (for backward compatibility)
// ============================================================================

export type ServicesLayer = ReportGenerationService | ReportService | ReportCheckpointService | ReportLogService | FileSystemService;
