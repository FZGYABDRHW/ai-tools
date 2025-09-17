import { Effect, Context, Layer, Runtime, RuntimeFlags, FiberRefs } from 'effect';
import {
  GenerationError,
  StorageError,
  CheckpointError,
  ReportGenerationState,
  GenerationCallbacks,
  GenerationStatus,
  StartGenerationParams,
  ResumeGenerationParams,
  TableData,
  ExtractedParameters,
  Report,
  ReportLog
} from './shared-types';
import { FileSystemServiceTag } from './impl/fileSystem.impl';
import { ReportServiceTag } from './impl/report.impl';
import { ReportCheckpointServiceTag } from './impl/reportCheckpoint.impl';
import { ReportLogServiceTag } from './impl/reportLog.impl';
import { ReportGenerationServiceTag } from './impl/reportGeneration.impl';

// ============================================================================
// Local Storage Service Implementation
// ============================================================================


// ============================================================================
// File System Service Implementation
// ============================================================================

import { makeFileSystemService } from './impl';

const FileSystemServiceLive = Layer.succeed(FileSystemServiceTag, makeFileSystemService());

// ============================================================================
// Report Service Implementation
// ============================================================================

// Import the actual implementation from implementations.ts
import { makeReportService } from './impl';

const ReportServiceLive = Layer.succeed(ReportServiceTag, makeReportService());

// ============================================================================
// Report Checkpoint Service Implementation
// ============================================================================

// Import the actual implementation from implementations.ts
import { makeReportCheckpointService } from './impl';

const ReportCheckpointServiceLive = Layer.succeed(ReportCheckpointServiceTag, makeReportCheckpointService());

// ============================================================================
// Report Log Service Implementation
// ============================================================================

// Import the actual implementation from implementations.ts
import { makeReportLogService } from './impl';

const ReportLogServiceLive = Layer.succeed(ReportLogServiceTag, makeReportLogService());

// ============================================================================
// Report Generation Service Implementation
// ============================================================================

// Import the actual implementation from implementations.ts
import { makeReportGenerationService } from './impl';

const ReportGenerationServiceLive = Layer.succeed(ReportGenerationServiceTag, makeReportGenerationService());

// ============================================================================
// Service Layer Composition
// ============================================================================

export const ServicesLayer = Layer.mergeAll(
  FileSystemServiceLive,
  ReportServiceLive,
  ReportCheckpointServiceLive,
  ReportLogServiceLive,
  ReportGenerationServiceLive
);

// ============================================================================
// Runtime Setup
// ============================================================================

export const createRuntime = () => Runtime.make({
  context: Context.empty(),
  runtimeFlags: RuntimeFlags.none,
  fiberRefs: FiberRefs.empty()
});

export const defaultRuntime = createRuntime();
