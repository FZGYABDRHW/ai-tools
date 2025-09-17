# Effect-based Report Generation Service Migration Guide

This guide explains how to migrate from the class-based `reportGenerationService` to the new functional, effects-based implementation using the Effect library.

## Overview

The new implementation provides:
- **Strict typing**: No `any` types, comprehensive type safety
- **Functional programming**: Pure functions, immutable data, composable effects
- **Effects-based**: All side effects handled through Effect library
- **Structured error handling**: Explicit error types with proper error handling
- **Resource management**: Proper cleanup and resource management
- **Testability**: Easy to test pure functions and effects

## Key Changes

### 1. Architecture Change

**Before (Class-based):**
```typescript
class ReportGenerationService {
  private activeGenerations: Map<string, ReportGenerationState> = new Map();
  private generationCallbacks: Map<string, GenerationCallbacks> = new Map();

  async startGeneration(reportId: string, reportText: string, ...): Promise<void> {
    // Imperative implementation with mixed concerns
  }
}

export const reportGenerationService = new ReportGenerationService();
```

**After (Effect-based):**
```typescript
// Pure functions for business logic
export const createGenerationState = (reportId: string, startTime: number): ReportGenerationState => ({
  reportId,
  status: 'preparing',
  progress: null,
  tableData: null,
  startTime
});

// Effect-based service implementation
const makeReportGenerationService = (): ReportGenerationService => ({
  startGeneration: (params: StartGenerationParams) =>
    pipe(
      validateGenerationParams(params),
      Effect.flatMap(() => /* effect-based implementation */)
    )
});

// Service layer composition
export const ServicesLayer = Context.mergeAll(/* all services */);
```

### 2. Type Safety Improvements

**Before:**
```typescript
interface GenerationCallbacks {
  onProgress?: (progress: any) => void;  // ❌ any type
  onComplete?: (result: any) => void;    // ❌ any type
  onError?: (error: any) => void;        // ❌ any type
}
```

**After:**
```typescript
interface GenerationCallbacks {
  readonly onProgress?: (progress: TableData) => void;     // ✅ Strict typing
  readonly onComplete?: (result: TableData) => void;       // ✅ Strict typing
  readonly onError?: (error: GenerationError) => void;     // ✅ Strict typing
}
```

### 3. Error Handling

**Before:**
```typescript
try {
  await reportGenerationService.startGeneration(...);
} catch (error: any) {  // ❌ any type
  console.error('Error:', error);
}
```

**After:**
```typescript
import { startGeneration, handleGenerationError } from './services/effects';

try {
  await startGeneration(params);
} catch (error) {
  if (error instanceof GenerationError) {
    handleGenerationError(error);  // ✅ Structured error handling
  }
}
```

## Migration Steps

### Step 1: Install Dependencies

The Effect library has been added to `package.json`:
```json
{
  "dependencies": {
    "effect": "^3.4.0"
  }
}
```

### Step 2: Initialize Services

Replace the old service initialization with the new Effect-based services:

**Before:**
```typescript
import { reportGenerationService } from './services/reportGenerationService';
// Service is ready to use immediately
```

**After:**
```typescript
import { initializeReportGenerationServices } from './services/effects';

// Initialize services and migrate legacy data
await initializeReportGenerationServices();
```

### Step 3: Update Service Calls

Replace direct service method calls with the new API functions:

**Before:**
```typescript
// Direct service calls
const isGenerating = reportGenerationService.isGenerating(reportId);
const state = reportGenerationService.getGenerationState(reportId);
await reportGenerationService.startGeneration(reportId, reportText, authToken, ...);
```

**After:**
```typescript
import {
  isGenerating,
  getGenerationState,
  startGeneration
} from './services/effects';

// Promise-based API calls
const isGeneratingResult = await isGenerating(reportId);
const state = await getGenerationState(reportId);
await startGeneration({
  reportId,
  reportText,
  authToken,
  selectedServer,
  onProgress: (progress) => { /* handle progress */ },
  onComplete: (result) => { /* handle completion */ },
  onError: (error) => { /* handle error */ }
});
```

### Step 4: Update Error Handling

Replace generic error handling with structured error handling:

**Before:**
```typescript
try {
  await reportGenerationService.startGeneration(...);
} catch (error: any) {
  console.error('Generation failed:', error);
  // Generic error handling
}
```

**After:**
```typescript
import { handleGenerationError } from './services/effects';

try {
  await startGeneration(params);
} catch (error) {
  if (error instanceof GenerationError) {
    handleGenerationError(error);
    // Handle specific error types
    switch (error.code) {
      case 'ABORTED':
        // Handle abort
        break;
      case 'NETWORK_ERROR':
        // Handle network error
        break;
      case 'VALIDATION_ERROR':
        // Handle validation error
        break;
    }
  }
}
```

### Step 5: Update React Components

Update React components to use the new API:

**Before:**
```typescript
import { reportGenerationService } from '../services/reportGenerationService';

const ReportComponent = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartGeneration = async () => {
    try {
      setIsGenerating(true);
      await reportGenerationService.startGeneration(
        reportId,
        reportText,
        authToken,
        'EU',
        (progress) => setProgress(progress),
        (result) => setResult(result),
        (error) => setError(error)
      );
    } catch (error) {
      setError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button onClick={handleStartGeneration} disabled={isGenerating}>
      {isGenerating ? 'Generating...' : 'Start Generation'}
    </button>
  );
};
```

**After:**
```typescript
import {
  startGeneration,
  isGenerating,
  getGenerationState
} from '../services/effects';

const ReportComponent = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleStartGeneration = async () => {
    try {
      setIsGenerating(true);
      await startGeneration({
        reportId,
        reportText,
        authToken,
        selectedServer: 'EU',
        onProgress: (progress) => setProgress(progress),
        onComplete: (result) => setResult(result),
        onError: (error) => setError(error)
      });
    } catch (error) {
      setError(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button onClick={handleStartGeneration} disabled={isGenerating}>
      {isGenerating ? 'Generating...' : 'Start Generation'}
    </button>
  );
};
```

## API Reference

### Core Functions

#### Generation Management
- `startGeneration(params: StartGenerationParams): Promise<void>`
- `stopGeneration(reportId: string): Promise<boolean>`
- `resumeGeneration(params: ResumeGenerationParams): Promise<void>`
- `isGenerating(reportId: string): Promise<boolean>`
- `getGenerationState(reportId: string): Promise<ReportGenerationState | null>`
- `getGenerationStatus(reportId: string): Promise<GenerationStatus | null>`

#### State Management
- `updateGenerationStatus(reportId: string, status: GenerationStatus, errorMessage?: string): Promise<void>`
- `resetToReady(reportId: string): Promise<boolean>`
- `setToPaused(reportId: string): Promise<boolean>`
- `setToCompleted(reportId: string): Promise<boolean>`
- `rerunFromCompleted(reportId: string): Promise<boolean>`
- `restartFromFailed(reportId: string): Promise<boolean>`

#### Data Management
- `clearGeneration(reportId: string): Promise<void>`
- `clearExtractedParameters(reportId: string): Promise<void>`
- `clearAllReportData(reportId: string): Promise<void>`
- `clearAllGenerations(): Promise<void>`

#### Callback Management
- `setGenerationCallbacks(reportId: string, callbacks: GenerationCallbacks): Promise<void>`
- `getGenerationCallbacks(reportId: string): Promise<GenerationCallbacks | null>`
- `clearGenerationCallbacks(reportId: string): Promise<void>`
- `reconnectToGeneration(reportId: string, callbacks: GenerationCallbacks): Promise<boolean>`

### Error Types

#### GenerationError
```typescript
class GenerationError extends Error {
  constructor(
    message: string,
    public readonly code: GenerationErrorCode,
    public readonly reportId: string,
    public readonly cause?: Error
  );
}

type GenerationErrorCode =
  | 'ABORTED'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'VALIDATION_ERROR'
  | 'STORAGE_ERROR'
  | 'CHECKPOINT_ERROR'
  | 'REPORT_NOT_FOUND'
  | 'INVALID_PARAMETERS'
  | 'OPENAI_ERROR'
  | 'UNKNOWN_ERROR';
```

#### StorageError
```typescript
class StorageError extends Error {
  constructor(
    message: string,
    public readonly operation: 'read' | 'write' | 'delete',
    public readonly key: string,
    public readonly cause?: Error
  );
}
```

#### CheckpointError
```typescript
class CheckpointError extends Error {
  constructor(
    message: string,
    public readonly reportId: string,
    public readonly operation: 'create' | 'update' | 'resume' | 'clear',
    public readonly cause?: Error
  );
}
```

## Testing

The new implementation is much easier to test due to its functional nature:

```typescript
import { createGenerationState, updateGenerationStatus } from './services/effects/pure';

describe('Generation State Management', () => {
  it('should create a new generation state', () => {
    const state = createGenerationState('report-1', Date.now());
    expect(state.reportId).toBe('report-1');
    expect(state.status).toBe('preparing');
  });

  it('should update generation status', () => {
    const initialState = createGenerationState('report-1', Date.now());
    const updatedState = updateGenerationStatus(initialState, 'in_progress');
    expect(updatedState.status).toBe('in_progress');
  });
});
```

## Benefits

1. **Type Safety**: No more `any` types, comprehensive type checking
2. **Functional Programming**: Pure functions, immutable data, composable effects
3. **Error Handling**: Structured error types with explicit error handling
4. **Testability**: Easy to test pure functions and effects
5. **Resource Management**: Proper cleanup and resource management
6. **Composability**: Effects can be easily composed and combined
7. **Maintainability**: Clear separation of concerns and functional architecture

## Backward Compatibility

The new implementation includes adapters that provide backward compatibility with the existing services. This allows for a gradual migration:

1. **Phase 1**: Use adapters to maintain compatibility
2. **Phase 2**: Migrate components to use new API
3. **Phase 3**: Remove legacy services

## Migration Checklist

- [ ] Install Effect library dependency
- [ ] Initialize new services at application startup
- [ ] Update service calls to use new API
- [ ] Update error handling to use structured errors
- [ ] Update React components to use new API
- [ ] Test all functionality
- [ ] Remove legacy service imports
- [ ] Clean up unused code

## Support

For questions or issues during migration, refer to:
- Effect library documentation: https://effect.website/
- Type definitions in `src/services/effects/types.ts`
- Pure functions in `src/services/effects/pure.ts`
- API functions in `src/services/effects/api.ts`
