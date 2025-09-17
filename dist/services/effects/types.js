"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = exports.FileSystemService = exports.ReportLogService = exports.ReportCheckpointService = exports.ReportService = exports.ReportGenerationService = exports.CheckpointError = exports.StorageError = exports.GenerationError = void 0;
const effect_1 = require("effect");
// ============================================================================
// Error Types
// ============================================================================
class GenerationError extends Error {
    constructor(message, code, reportId, cause) {
        super(message);
        this.code = code;
        this.reportId = reportId;
        this.cause = cause;
        this.name = 'GenerationError';
    }
}
exports.GenerationError = GenerationError;
class StorageError extends Error {
    constructor(message, operation, key, cause) {
        super(message);
        this.operation = operation;
        this.key = key;
        this.cause = cause;
        this.name = 'StorageError';
    }
}
exports.StorageError = StorageError;
class CheckpointError extends Error {
    constructor(message, reportId, operation, cause) {
        super(message);
        this.reportId = reportId;
        this.operation = operation;
        this.cause = cause;
        this.name = 'CheckpointError';
    }
}
exports.CheckpointError = CheckpointError;
// ============================================================================
// Service Tags
// ============================================================================
exports.ReportGenerationService = effect_1.Context.GenericTag('ReportGenerationService');
exports.ReportService = effect_1.Context.GenericTag('ReportService');
exports.ReportCheckpointService = effect_1.Context.GenericTag('ReportCheckpointService');
exports.ReportLogService = effect_1.Context.GenericTag('ReportLogService');
exports.FileSystemService = effect_1.Context.GenericTag('FileSystemService');
exports.LocalStorageService = effect_1.Context.GenericTag('LocalStorageService');
//# sourceMappingURL=types.js.map