"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationService = void 0;
const FileSystemService_1 = require("./FileSystemService");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class MigrationService {
    constructor() {
        this.config = FileSystemService_1.fileSystemService.getConfig();
    }
    async migrateFromLocalStorage(localStorageData) {
        const result = {
            success: true,
            migratedData: { reports: 0, logs: 0, checkpoints: 0, generationStates: 0 },
            errors: [],
            backupCreated: false
        };
        try {
            // Create backup of localStorage data
            await this.createBackup(localStorageData);
            result.backupCreated = true;
            // Migrate reports
            if (localStorageData.reports && Array.isArray(localStorageData.reports)) {
                console.log(`Migrating ${localStorageData.reports.length} reports...`);
                for (const report of localStorageData.reports) {
                    try {
                        if (await FileSystemService_1.fileSystemService.saveReport(report)) {
                            result.migratedData.reports++;
                        }
                        else {
                            result.errors.push(`Failed to migrate report: ${report.id}`);
                        }
                    }
                    catch (error) {
                        result.errors.push(`Error migrating report ${report.id}: ${error.message}`);
                    }
                }
            }
            // Migrate report logs
            if (localStorageData.reportLogs && Array.isArray(localStorageData.reportLogs)) {
                console.log(`Migrating ${localStorageData.reportLogs.length} report logs...`);
                for (const log of localStorageData.reportLogs) {
                    try {
                        if (await FileSystemService_1.fileSystemService.saveReportLog(log)) {
                            result.migratedData.logs++;
                        }
                        else {
                            result.errors.push(`Failed to migrate log: ${log.id}`);
                        }
                    }
                    catch (error) {
                        result.errors.push(`Error migrating log ${log.id}: ${error.message}`);
                    }
                }
            }
            // Migrate checkpoints
            if (localStorageData.checkpoints && typeof localStorageData.checkpoints === 'object') {
                const checkpointEntries = Object.entries(localStorageData.checkpoints);
                console.log(`Migrating ${checkpointEntries.length} checkpoints...`);
                for (const [reportId, checkpoint] of checkpointEntries) {
                    try {
                        if (await FileSystemService_1.fileSystemService.saveCheckpoint(reportId, checkpoint)) {
                            result.migratedData.checkpoints++;
                        }
                        else {
                            result.errors.push(`Failed to migrate checkpoint: ${reportId}`);
                        }
                    }
                    catch (error) {
                        result.errors.push(`Error migrating checkpoint ${reportId}: ${error.message}`);
                    }
                }
            }
            // Migrate generation states
            if (localStorageData.generationStates && typeof localStorageData.generationStates === 'object') {
                const stateEntries = Object.entries(localStorageData.generationStates);
                console.log(`Migrating ${stateEntries.length} generation states...`);
                for (const [reportId, state] of stateEntries) {
                    try {
                        if (await FileSystemService_1.fileSystemService.saveGenerationState(reportId, state)) {
                            result.migratedData.generationStates++;
                        }
                        else {
                            result.errors.push(`Failed to migrate generation state: ${reportId}`);
                        }
                    }
                    catch (error) {
                        result.errors.push(`Error migrating generation state ${reportId}: ${error.message}`);
                    }
                }
            }
            // Mark migration as completed
            await this.markMigrationCompleted(result);
            console.log('Migration completed:', result);
        }
        catch (error) {
            result.success = false;
            result.errors.push(`Migration failed: ${error.message}`);
            console.error('Migration error:', error);
        }
        return result;
    }
    async createBackup(localStorageData) {
        const backupPath = path.join(this.config.migrationsDir, `localStorage-backup-${Date.now()}.json`);
        await FileSystemService_1.fileSystemService.saveFile(backupPath, {
            timestamp: new Date().toISOString(),
            data: localStorageData
        });
        console.log('Backup created at:', backupPath);
    }
    async markMigrationCompleted(result) {
        const migrationRecord = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            result: result
        };
        const recordPath = path.join(this.config.migrationsDir, 'completed.json');
        await FileSystemService_1.fileSystemService.saveFile(recordPath, migrationRecord);
    }
    async hasCompletedMigration() {
        console.log('MigrationService.hasCompletedMigration() called');
        const recordPath = path.join(this.config.migrationsDir, 'completed.json');
        console.log('Migration record path:', recordPath);
        const record = await FileSystemService_1.fileSystemService.loadFile(recordPath);
        console.log('Migration record:', record);
        const completed = record !== null;
        console.log('Migration completed:', completed);
        return completed;
    }
    async getMigrationHistory() {
        try {
            const migrationsDir = this.config.migrationsDir;
            const files = await fs.promises.readdir(migrationsDir);
            const migrationFiles = files.filter(file => file.startsWith('localStorage-backup-'));
            const history = [];
            for (const file of migrationFiles) {
                const filePath = path.join(migrationsDir, file);
                const data = await FileSystemService_1.fileSystemService.loadFile(filePath);
                if (data) {
                    history.push({
                        file,
                        timestamp: data.timestamp,
                        dataSize: JSON.stringify(data.data).length
                    });
                }
            }
            return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        catch (error) {
            console.error('Error getting migration history:', error);
            return [];
        }
    }
    async getLastMigrationResult() {
        const recordPath = path.join(this.config.migrationsDir, 'completed.json');
        return await FileSystemService_1.fileSystemService.loadFile(recordPath);
    }
    async validateMigrationData(localStorageData) {
        const issues = [];
        let isValid = true;
        const dataSummary = {
            reports: 0,
            logs: 0,
            checkpoints: 0,
            generationStates: 0,
            totalSize: 0
        };
        try {
            // Validate reports
            if (localStorageData.reports) {
                if (Array.isArray(localStorageData.reports)) {
                    dataSummary.reports = localStorageData.reports.length;
                    for (const report of localStorageData.reports) {
                        if (!report.id || !report.name) {
                            issues.push(`Report missing required fields: ${JSON.stringify(report)}`);
                            isValid = false;
                        }
                    }
                }
                else {
                    issues.push('Reports data is not an array');
                    isValid = false;
                }
            }
            // Validate logs
            if (localStorageData.reportLogs) {
                if (Array.isArray(localStorageData.reportLogs)) {
                    dataSummary.logs = localStorageData.reportLogs.length;
                    for (const log of localStorageData.reportLogs) {
                        if (!log.id || !log.reportId) {
                            issues.push(`Log missing required fields: ${JSON.stringify(log)}`);
                            isValid = false;
                        }
                    }
                }
                else {
                    issues.push('Report logs data is not an array');
                    isValid = false;
                }
            }
            // Validate checkpoints
            if (localStorageData.checkpoints) {
                if (typeof localStorageData.checkpoints === 'object') {
                    dataSummary.checkpoints = Object.keys(localStorageData.checkpoints).length;
                }
                else {
                    issues.push('Checkpoints data is not an object');
                    isValid = false;
                }
            }
            // Validate generation states
            if (localStorageData.generationStates) {
                if (typeof localStorageData.generationStates === 'object') {
                    dataSummary.generationStates = Object.keys(localStorageData.generationStates).length;
                }
                else {
                    issues.push('Generation states data is not an object');
                    isValid = false;
                }
            }
            // Calculate total size
            dataSummary.totalSize = JSON.stringify(localStorageData).length;
        }
        catch (error) {
            issues.push(`Validation error: ${error.message}`);
            isValid = false;
        }
        return {
            isValid,
            issues,
            dataSummary
        };
    }
}
exports.migrationService = new MigrationService();
//# sourceMappingURL=MigrationService.js.map