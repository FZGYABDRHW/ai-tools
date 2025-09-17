// ============================================================================
// Effect-based Report Generation Service
// ============================================================================
//
// This module provides a functional, effects-based implementation of the
// report generation service using the Effect library. It replaces the
// class-based, imperative architecture with a functional approach that
// emphasizes:
//
// - Strict typing with no `any` types
// - Pure functions and immutable data
// - Composable effects for side effects
// - Structured error handling
// - Resource management
// - Easy testability
//
// ============================================================================

// Export types (excluding ServicesLayer to avoid conflicts)
export type {
  ReportGenerationService,
  ReportService,
  ReportCheckpointService,
  ReportLogService,
  FileSystemService,
  ReportGenerationState,
  GenerationCallbacks,
  GenerationStatus,
  StartGenerationParams,
  ResumeGenerationParams,
  CreateCheckpointParams,
  UpdateCheckpointParams,
  CreateReportLogParams,
  ReportCheckpoint,
  TableData,
  ExtractedParameters,
  Report,
  ReportLog,
  GenerationError,
  StorageError,
  CheckpointError,
  TaskListParameters,
  ProgressInfo
} from './types';

// Export pure business logic functions (excluding duplicates)
export {
  createGenerationState,
  updateGenerationStatus as updateGenerationStatusState,
  updateGenerationProgress,
  updateGenerationTableData,
  updateGenerationExtractedParameters,
  mergeTableData,
  generateCsv,
  calculateProgress,
  isGenerating as isGeneratingState,
  canResumeGeneration,
  canRestartGeneration,
  validateGenerationParams,
  createCheckpoint as createCheckpointState,
  updateCheckpoint as updateCheckpointState,
  markCheckpointCompleted as markCheckpointCompletedState,
  markCheckpointFailed as markCheckpointFailedState,
  markCheckpointPaused as markCheckpointPausedState,
  resumeCheckpoint as resumeCheckpointState,
  calculateResumeOffset,
  calculateCheckpointProgress,
  calculateEstimatedTimeRemaining,
  validateCheckpointParams,
  validateUpdateCheckpointParams,
  createGenerationError,
  createCheckpointError,
  shouldPersistGenerationState,
  shouldPersistCheckpoint,
  safeCallback,
  safeErrorCallback,
  mergeMultipleTableData,
  filterTableData,
  sortTableData
} from './pure';

// Export service implementations (excluding ServicesLayer)
export {
  makeReportService,
  makeReportCheckpointService,
  makeReportLogService,
  makeReportGenerationService,
  FileSystemServiceLive,
  ReportServiceLive,
  ReportCheckpointServiceLive,
  ReportLogServiceLive,
  ReportGenerationServiceLive
} from './implementations';

// Export integration adapters
export {
  createReportServiceAdapter,
  createReportCheckpointServiceAdapter,
  createReportLogServiceAdapter,
  createReportGenerationServiceAdapter,
  migrateLegacyData,
  isMigrationNeeded
} from './adapters';

// Export public API
export {
  initializeServices,
  getActiveGenerations,
  getGenerationState,
  setGenerationCallbacks,
  getGenerationCallbacks,
  clearGenerationCallbacks,
  isGenerating,
  getGenerationStatus,
  updateGenerationStatus,
  resetToReady,
  setToPaused,
  setToCompleted,
  rerunFromCompleted,
  restartFromFailed,
  startGeneration,
  stopGeneration,
  clearGeneration,
  clearExtractedParameters,
  clearAllReportData,
  clearAllGenerations,
  reconnectToGeneration,
  resumeGeneration,
  getReportById as apiGetReportById,
  createReport as apiCreateReport,
  saveReportData as apiSaveReportData,
  clearReportData as apiClearReportData,
  getCheckpoint as apiGetCheckpoint,
  hasCheckpoint as apiHasCheckpoint,
  canResume as apiCanResume,
  createCheckpoint as apiCreateCheckpoint,
  updateCheckpoint as apiUpdateCheckpoint,
  markCheckpointCompleted,
  markCheckpointFailed,
  markCheckpointPaused,
  resumeCheckpoint as apiResumeCheckpoint,
  clearCheckpoint as apiClearCheckpoint,
  getResumeOffset as apiGetResumeOffset,
  createReportLogFromGeneration,
  handleGenerationError,
  handleStorageError,
  handleCheckpointError,
  checkMigrationNeeded,
  getServiceHealth,
  createEffectWrapper,
  createSafeWrapper
} from './api';

// Export context and runtime setup
export {
  createRuntime,
  defaultRuntime
} from './context';

// ============================================================================
// Main Service Factory
// ============================================================================

import { Runtime, Context, RuntimeFlags, FiberRefs } from 'effect';
import { ServicesLayer } from './implementations';
import { initializeServices } from './api';

/**
 * Create a new runtime instance with all services
 */
export const createReportGenerationRuntime = () => Runtime.make({
  context: Context.empty(),
  runtimeFlags: RuntimeFlags.none,
  fiberRefs: FiberRefs.empty()
});

/**
 * Default runtime instance (re-exported from context)
 */

/**
 * Initialize the services and migrate legacy data if needed
 * Call this once at application startup
 */
export const initializeReportGenerationServices = initializeServices;

// ============================================================================
// Service Health Check
// ============================================================================

import { getServiceHealth } from './api';

/**
 * Check the health of all services
 */
export const checkServiceHealth = getServiceHealth;

// ============================================================================
// Migration Utilities
// ============================================================================

import { checkMigrationNeeded } from './api';

/**
 * Check if migration from legacy services is needed (re-exported from adapters)
 */

// ============================================================================
// Error Handling
// ============================================================================

import {
  handleGenerationError,
  handleStorageError,
  handleCheckpointError
} from './api';

/**
 * Error handlers for different error types
 */
export const errorHandlers = {
  generation: handleGenerationError,
  storage: handleStorageError,
  checkpoint: handleCheckpointError
};

// ============================================================================
// Utility Functions
// ============================================================================

import { createEffectWrapper, createSafeWrapper } from './api';

/**
 * Utility functions for working with Effects in React components
 */
export const effectUtils = {
  createWrapper: createEffectWrapper,
  createSafeWrapper: createSafeWrapper
};
