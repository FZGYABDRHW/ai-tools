import { Effect, Context, Layer } from 'effect';
import { buildServiceInitializer } from '../../serviceInit';
import { buildReport } from '../../reportBuilder';
import builder from '../../builder';
import { makeFileSystemService } from './impl/fileSystem.impl';
import { makeReportService } from './impl/report.impl';
import { makeReportCheckpointService } from './impl/reportCheckpoint.impl';
import { makeReportLogService } from './impl/reportLog.impl';
import { makeReportGenerationService } from './impl/reportGeneration.impl';
import {
  ReportGenerationServiceTag,
  ReportServiceTag,
  ReportCheckpointServiceTag,
  ReportLogServiceTag,
  FileSystemServiceTag
} from './types';

// ============================================================================
// Storage Keys
// ============================================================================


// ============================================================================
// File System Service Implementation
// ============================================================================

// Re-export from impl directory
export { makeFileSystemService } from './impl/fileSystem.impl';

// ============================================================================
// Service Layer
// ============================================================================


// ============================================================================
// Report Service Implementation
// ============================================================================

// Re-export from impl directory
export { makeReportService } from './impl/report.impl';

// ============================================================================
// Report Checkpoint Service Implementation
// ============================================================================

// Re-export from impl directory
export { makeReportCheckpointService } from './impl/reportCheckpoint.impl';

// ============================================================================
// Report Log Service Implementation
// ============================================================================

// Re-export from impl directory
export { makeReportLogService } from './impl/reportLog.impl';

// ============================================================================
// Report Generation Service Implementation
// ============================================================================

// Re-export from impl directory
export { makeReportGenerationService } from './impl/reportGeneration.impl';

// ============================================================================
// Service Layer Implementations
// ============================================================================

export const FileSystemServiceLive = Layer.succeed(FileSystemServiceTag, makeFileSystemService());
export const ReportServiceLive = Layer.succeed(ReportServiceTag, makeReportService());
export const ReportCheckpointServiceLive = Layer.succeed(ReportCheckpointServiceTag, makeReportCheckpointService());
export const ReportLogServiceLive = Layer.succeed(ReportLogServiceTag, makeReportLogService());
export const ReportGenerationServiceLive = Layer.succeed(ReportGenerationServiceTag, makeReportGenerationService());

export const ServicesLayer = Layer.mergeAll(
  FileSystemServiceLive,
  ReportServiceLive,
  ReportCheckpointServiceLive,
  ReportLogServiceLive,
  ReportGenerationServiceLive
);
