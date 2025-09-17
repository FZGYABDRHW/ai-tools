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
exports.fileSystemService = void 0;
const electron_1 = require("electron");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FileSystemService {
    constructor() {
        this.initialized = false;
        const userDataPath = electron_1.app.getPath('userData');
        this.config = {
            baseDir: path.join(userDataPath, 'wowworks-ai-tools'),
            dataDir: path.join(userDataPath, 'wowworks-ai-tools', 'data'),
            reportsDir: path.join(userDataPath, 'wowworks-ai-tools', 'data', 'reports'),
            logsDir: path.join(userDataPath, 'wowworks-ai-tools', 'data', 'logs'),
            checkpointsDir: path.join(userDataPath, 'wowworks-ai-tools', 'data', 'checkpoints'),
            generationStatesDir: path.join(userDataPath, 'wowworks-ai-tools', 'data', 'generation-states'),
            schemasDir: path.join(userDataPath, 'wowworks-ai-tools', 'schemas'),
            migrationsDir: path.join(userDataPath, 'wowworks-ai-tools', 'migrations')
        };
    }
    async initialize() {
        if (this.initialized)
            return;
        try {
            // Create all directories
            await this.ensureDirectories();
            // Initialize schema files
            await this.initializeSchemas();
            this.initialized = true;
            console.log('FileSystemService initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize FileSystemService:', error);
            throw error;
        }
    }
    async ensureDirectories() {
        const dirs = [
            this.config.baseDir,
            this.config.dataDir,
            this.config.reportsDir,
            this.config.logsDir,
            this.config.checkpointsDir,
            this.config.generationStatesDir,
            this.config.schemasDir,
            this.config.migrationsDir
        ];
        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
    }
    async initializeSchemas() {
        const schemas = {
            'Report.schema.json': {
                type: 'object',
                required: ['id', 'name', 'prompt', 'createdAt', 'updatedAt'],
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    prompt: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                    lastGeneratedAt: { type: 'string' },
                    tableData: { type: 'object' },
                    extractedParameters: { type: 'object' }
                }
            },
            'ReportLog.schema.json': {
                type: 'object',
                required: ['id', 'reportId', 'reportName', 'prompt', 'generatedAt', 'completedAt', 'status', 'totalTasks', 'processedTasks', 'tableData'],
                properties: {
                    id: { type: 'string' },
                    reportId: { type: 'string' },
                    reportName: { type: 'string' },
                    prompt: { type: 'string' },
                    generatedAt: { type: 'string' },
                    completedAt: { type: 'string' },
                    status: { type: 'string', enum: ['completed', 'failed'] },
                    totalTasks: { type: 'number' },
                    processedTasks: { type: 'number' },
                    tableData: { type: 'object' },
                    extractedParameters: { type: 'object' },
                    metadata: { type: 'object' }
                }
            }
        };
        for (const [filename, schema] of Object.entries(schemas)) {
            const filePath = path.join(this.config.schemasDir, filename);
            if (!fs.existsSync(filePath)) {
                await fs.promises.writeFile(filePath, JSON.stringify(schema, null, 2));
            }
        }
    }
    // Generic file operations
    async saveFile(filePath, data) {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        }
        catch (error) {
            console.error('Error saving file:', error);
            return false;
        }
    }
    async loadFile(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                return null;
            }
            const data = await fs.promises.readFile(filePath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error loading file:', error);
            return null;
        }
    }
    async deleteFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
            return true;
        }
        catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    // Reports operations
    async saveReport(report) {
        const filePath = path.join(this.config.reportsDir, `report-${report.id}.json`);
        const success = await this.saveFile(filePath, report);
        if (success) {
            await this.updateReportsIndex(report);
        }
        return success;
    }
    async getReport(id) {
        const filePath = path.join(this.config.reportsDir, `report-${id}.json`);
        return await this.loadFile(filePath);
    }
    async getAllReports() {
        console.log('FileSystemService.getAllReports() called');
        const indexPath = path.join(this.config.reportsDir, 'index.json');
        console.log('Index path:', indexPath);
        const index = await this.loadFile(indexPath);
        console.log('Index loaded:', index);
        if (!index || !index.reports) {
            console.log('No index or reports found, returning empty array');
            return [];
        }
        console.log('Found report IDs:', index.reports);
        const reports = [];
        for (const reportId of index.reports) {
            const report = await this.getReport(reportId);
            if (report) {
                reports.push(report);
                console.log('Loaded report:', report.name);
            }
        }
        console.log(`Returning ${reports.length} reports`);
        return reports.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    async deleteReport(id) {
        const filePath = path.join(this.config.reportsDir, `report-${id}.json`);
        const success = await this.deleteFile(filePath);
        if (success) {
            await this.removeFromReportsIndex(id);
        }
        return success;
    }
    async updateReportsIndex(report) {
        const indexPath = path.join(this.config.reportsDir, 'index.json');
        const index = await this.loadFile(indexPath) || { reports: [] };
        if (!index.reports.includes(report.id)) {
            index.reports.push(report.id);
        }
        await this.saveFile(indexPath, index);
    }
    async removeFromReportsIndex(id) {
        const indexPath = path.join(this.config.reportsDir, 'index.json');
        const index = await this.loadFile(indexPath);
        if (index && index.reports) {
            index.reports = index.reports.filter((reportId) => reportId !== id);
            await this.saveFile(indexPath, index);
        }
    }
    // Report Logs operations
    async saveReportLog(log) {
        const filePath = path.join(this.config.logsDir, `log-${log.id}.json`);
        const success = await this.saveFile(filePath, log);
        if (success) {
            await this.updateLogsIndex(log);
        }
        return success;
    }
    async getReportLogs(reportId) {
        const indexPath = path.join(this.config.logsDir, 'index.json');
        const index = await this.loadFile(indexPath);
        if (!index || !index.logs) {
            return [];
        }
        const logs = [];
        for (const logId of index.logs) {
            const log = await this.loadFile(path.join(this.config.logsDir, `log-${logId}.json`));
            if (log && (!reportId || log.reportId === reportId)) {
                logs.push(log);
            }
        }
        return logs.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    }
    async deleteReportLog(id) {
        const filePath = path.join(this.config.logsDir, `log-${id}.json`);
        const success = await this.deleteFile(filePath);
        if (success) {
            await this.removeFromLogsIndex(id);
        }
        return success;
    }
    async updateLogsIndex(log) {
        const indexPath = path.join(this.config.logsDir, 'index.json');
        const index = await this.loadFile(indexPath) || { logs: [] };
        if (!index.logs.includes(log.id)) {
            index.logs.push(log.id);
        }
        await this.saveFile(indexPath, index);
    }
    async removeFromLogsIndex(id) {
        const indexPath = path.join(this.config.logsDir, 'index.json');
        const index = await this.loadFile(indexPath);
        if (index && index.logs) {
            index.logs = index.logs.filter((logId) => logId !== id);
            await this.saveFile(indexPath, index);
        }
    }
    // Checkpoints operations
    async saveCheckpoint(reportId, checkpoint) {
        const filePath = path.join(this.config.checkpointsDir, `checkpoint-${reportId}.json`);
        return await this.saveFile(filePath, checkpoint);
    }
    async getCheckpoint(reportId) {
        const filePath = path.join(this.config.checkpointsDir, `checkpoint-${reportId}.json`);
        return await this.loadFile(filePath);
    }
    async deleteCheckpoint(reportId) {
        const filePath = path.join(this.config.checkpointsDir, `checkpoint-${reportId}.json`);
        return await this.deleteFile(filePath);
    }
    async getAllCheckpoints() {
        try {
            const files = await fs.promises.readdir(this.config.checkpointsDir);
            const checkpointFiles = files.filter(file => file.startsWith('checkpoint-') && file.endsWith('.json'));
            const checkpoints = [];
            for (const file of checkpointFiles) {
                const filePath = path.join(this.config.checkpointsDir, file);
                const checkpoint = await this.loadFile(filePath);
                if (checkpoint) {
                    checkpoints.push(checkpoint);
                }
            }
            return checkpoints;
        }
        catch (error) {
            console.error('Error getting all checkpoints:', error);
            return [];
        }
    }
    // Generation States operations
    async saveGenerationState(reportId, state) {
        const filePath = path.join(this.config.generationStatesDir, `state-${reportId}.json`);
        return await this.saveFile(filePath, state);
    }
    async getGenerationState(reportId) {
        const filePath = path.join(this.config.generationStatesDir, `state-${reportId}.json`);
        return await this.loadFile(filePath);
    }
    async deleteGenerationState(reportId) {
        const filePath = path.join(this.config.generationStatesDir, `state-${reportId}.json`);
        return await this.deleteFile(filePath);
    }
    async getAllGenerationStates() {
        try {
            const files = await fs.promises.readdir(this.config.generationStatesDir);
            const stateFiles = files.filter(file => file.startsWith('state-') && file.endsWith('.json'));
            const states = [];
            for (const file of stateFiles) {
                const filePath = path.join(this.config.generationStatesDir, file);
                const state = await this.loadFile(filePath);
                if (state) {
                    states.push(state);
                }
            }
            return states;
        }
        catch (error) {
            console.error('Error getting all generation states:', error);
            return [];
        }
    }
    // Storage size calculation
    async getStorageSize() {
        let totalSize = 0;
        const calculateDirSize = async (dir) => {
            let size = 0;
            try {
                const files = await fs.promises.readdir(dir);
                for (const file of files) {
                    const filePath = path.join(dir, file);
                    const stats = await fs.promises.stat(filePath);
                    if (stats.isFile()) {
                        size += stats.size;
                    }
                }
            }
            catch (error) {
                // Directory might not exist
            }
            return size;
        };
        totalSize += await calculateDirSize(this.config.reportsDir);
        totalSize += await calculateDirSize(this.config.logsDir);
        totalSize += await calculateDirSize(this.config.checkpointsDir);
        totalSize += await calculateDirSize(this.config.generationStatesDir);
        return totalSize;
    }
    // Get configuration for external use
    getConfig() {
        return { ...this.config };
    }
    // Cleanup orphaned data
    async cleanupOrphanedData() {
        let cleanedCount = 0;
        try {
            // Get all report IDs
            const reports = await this.getAllReports();
            const reportIds = new Set(reports.map(r => r.id));
            // Clean up orphaned checkpoints
            const checkpoints = await this.getAllCheckpoints();
            for (const checkpoint of checkpoints) {
                if (!reportIds.has(checkpoint.reportId)) {
                    await this.deleteCheckpoint(checkpoint.reportId);
                    cleanedCount++;
                }
            }
            // Clean up orphaned generation states
            const states = await this.getAllGenerationStates();
            for (const state of states) {
                if (!reportIds.has(state.reportId)) {
                    await this.deleteGenerationState(state.reportId);
                    cleanedCount++;
                }
            }
            // Clean up orphaned report logs
            const logs = await this.getReportLogs();
            for (const log of logs) {
                if (!reportIds.has(log.reportId)) {
                    await this.deleteReportLog(log.id);
                    cleanedCount++;
                }
            }
            if (cleanedCount > 0) {
                console.log(`Cleaned up ${cleanedCount} orphaned data entries`);
            }
        }
        catch (error) {
            console.error('Error cleaning up orphaned data:', error);
        }
        return cleanedCount;
    }
}
exports.fileSystemService = new FileSystemService();
//# sourceMappingURL=FileSystemService.js.map