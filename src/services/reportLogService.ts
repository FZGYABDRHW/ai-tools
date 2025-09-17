import { ReportLog } from '../types';

const REPORT_LOGS_STORAGE_KEY = 'wowworks_report_logs';

class ReportLogService {
    private migrationCheckInProgress = false;
    private fileSystemReportLogs: ReportLog[] | null = null;

    private getStorageKey(): string {
        return REPORT_LOGS_STORAGE_KEY;
    }

    private getReportLogs(): ReportLog[] {
        try {
            const stored = localStorage.getItem(this.getStorageKey());
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading report logs:', error);
            return [];
        }
    }

    private saveReportLogs(reportLogs: ReportLog[]): void {
        try {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(reportLogs));
        } catch (error) {
            console.error('Error saving report logs:', error);
        }
    }

    private async saveReportLogToFileSystem(reportLog: ReportLog): Promise<boolean> {
        try {
            if ((window.electronAPI as any)?.fileSystem?.saveReportLog) {
                return await (window.electronAPI as any).fileSystem.saveReportLog(reportLog);
            }
            return false;
        } catch (error) {
            console.error('Error saving report log to file system:', error);
            return false;
        }
    }

    // Check if migration has been completed and sync report logs if needed
    private async syncReportLogsFromFileSystem(): Promise<void> {
        if (this.migrationCheckInProgress) {
            console.log('Report logs migration check already in progress, skipping...');
            return;
        }

        this.migrationCheckInProgress = true;
        console.log('Starting report logs sync from file system...');

        try {
            // Check if migration has been completed
            console.log('Checking migration status for report logs...');
            const migrationCompleted = await (window.electronAPI as any)?.migration?.hasCompletedMigration();
            console.log('Migration completed:', migrationCompleted);

            if (migrationCompleted) {
                // Get report logs from file system
                console.log('Getting report logs from file system...');
                const fileSystemReportLogs = await (window.electronAPI as any)?.fileSystem?.getAllReportLogs();
                console.log('File system report logs:', fileSystemReportLogs);

                if (fileSystemReportLogs && fileSystemReportLogs.length > 0) {
                    // Always sync from file system when migration is completed
                    // This ensures we have the complete migrated data
                    this.saveReportLogs(fileSystemReportLogs);
                    this.fileSystemReportLogs = fileSystemReportLogs;
                    console.log(`✅ Synced ${fileSystemReportLogs.length} report logs from file system to localStorage`);
                } else {
                    console.log('No report logs found in file system');
                }
            } else {
                console.log('Migration not completed, skipping report logs sync');
            }
        } catch (error) {
            console.error('❌ Error syncing report logs from file system:', error);
        } finally {
            this.migrationCheckInProgress = false;
        }
    }

    async createReportLog(reportLog: Omit<ReportLog, 'id'>): Promise<ReportLog> {
        const newReportLog: ReportLog = {
            ...reportLog,
            id: this.generateId(),
        };

        // Save to file system first
        const fileSystemSaved = await this.saveReportLogToFileSystem(newReportLog);
        if (fileSystemSaved) {
            console.log(`✅ Created report log in file system: ${newReportLog.id}`);
        } else {
            console.warn(`⚠️ Failed to save report log to file system, falling back to localStorage: ${newReportLog.id}`);
        }

        // Also save to localStorage for immediate UI updates
        const reportLogs = this.getReportLogs();
        reportLogs.unshift(newReportLog); // Add to beginning of array
        this.saveReportLogs(reportLogs);

        return newReportLog;
    }

    getAllReportLogs(): ReportLog[] {
        const localReportLogs = this.getReportLogs();

        // If localStorage has report logs, use them
        if (localReportLogs.length > 0) {
            return localReportLogs;
        }

        // If localStorage is empty, return empty array
        // The sync will happen in the background and populate localStorage
        // UI components should use getAllReportLogsWithSync() for immediate sync
        return localReportLogs;
    }

    // Synchronous method that waits for sync to complete
    async getAllReportLogsWithSync(): Promise<ReportLog[]> {
        console.log('getAllReportLogsWithSync called');
        const localReportLogs = this.getReportLogs();
        console.log('Local report logs count:', localReportLogs.length);
        console.log('Local report logs:', localReportLogs.map(r => ({ id: r.id, reportId: r.reportId, reportName: r.reportName })));

        // Always check if we need to sync from file system
        console.log('Checking if report logs sync is needed...');
        await this.syncReportLogsFromFileSystem();

        // Return the report logs (either from localStorage or newly synced)
        const finalReportLogs = this.getReportLogs();
        console.log('Final report logs count:', finalReportLogs.length);
        console.log('Final report logs:', finalReportLogs.map(r => ({ id: r.id, reportId: r.reportId, reportName: r.reportName })));
        return finalReportLogs;
    }

    getReportLogsByReportId(reportId: string): ReportLog[] {
        const reportLogs = this.getReportLogs();
        return reportLogs.filter(log => log.reportId === reportId);
    }

    // Async version that waits for sync to complete
    async getReportLogsByReportIdWithSync(reportId: string): Promise<ReportLog[]> {
        console.log('getReportLogsByReportIdWithSync called for reportId:', reportId);
        let reportLogs = this.getReportLogsByReportId(reportId);

        if (reportLogs.length === 0) {
            // If no logs found, try to sync from file system
            console.log('No report logs found in localStorage, syncing from file system...');
            await this.syncReportLogsFromFileSystem();
            reportLogs = this.getReportLogsByReportId(reportId);
        }

        console.log('Found report logs for reportId:', reportId, 'count:', reportLogs.length);
        return reportLogs;
    }

    getReportLogById(id: string): ReportLog | null {
        const reportLogs = this.getReportLogs();
        return reportLogs.find(log => log.id === id) || null;
    }

    // Async version that waits for sync to complete
    async getReportLogByIdWithSync(id: string): Promise<ReportLog | null> {
        console.log('getReportLogByIdWithSync called for ID:', id);
        let reportLog = this.getReportLogById(id);

        if (!reportLog) {
            // If not found, try to sync from file system
            console.log('Report log not found in localStorage, syncing from file system...');
            await this.syncReportLogsFromFileSystem();
            reportLog = this.getReportLogById(id);
        }

        console.log('Found report log:', reportLog ? { id: reportLog.id, reportName: reportLog.reportName } : null);
        return reportLog;
    }

    // Method to manually trigger sync from file system
    async forceSyncFromFileSystem(): Promise<boolean> {
        try {
            await this.syncReportLogsFromFileSystem();
            return true;
        } catch (error) {
            console.error('Failed to force sync report logs from file system:', error);
            return false;
        }
    }

    // Method to check if report logs are available (useful for UI)
    hasReportLogs(): boolean {
        return this.getAllReportLogs().length > 0;
    }

    async deleteReportLog(id: string): Promise<boolean> {
        const reportLogs = this.getReportLogs();
        const filteredLogs = reportLogs.filter(log => log.id !== id);

        if (filteredLogs.length !== reportLogs.length) {
            // Delete from file system first
            try {
                if ((window.electronAPI as any)?.fileSystem?.deleteReportLog) {
                    const fileSystemDeleted = await (window.electronAPI as any).fileSystem.deleteReportLog(id);
                    if (fileSystemDeleted) {
                        console.log(`✅ Deleted report log from file system: ${id}`);
                    } else {
                        console.warn(`⚠️ Failed to delete report log from file system: ${id}`);
                    }
                }
            } catch (error) {
                console.error(`Error deleting report log from file system: ${id}:`, error);
            }

            // Also remove from localStorage
            this.saveReportLogs(filteredLogs);
            return true;
        }
        return false;
    }

    async deleteReportLogsByReportId(reportId: string): Promise<number> {
        const reportLogs = this.getReportLogs();
        const logsToDelete = reportLogs.filter(log => log.reportId === reportId);
        const filteredLogs = reportLogs.filter(log => log.reportId !== reportId);
        const deletedCount = reportLogs.length - filteredLogs.length;

        if (deletedCount > 0) {
            // Delete from file system first
            for (const log of logsToDelete) {
                try {
                    if ((window.electronAPI as any)?.fileSystem?.deleteReportLog) {
                        const fileSystemDeleted = await (window.electronAPI as any).fileSystem.deleteReportLog(log.id);
                        if (fileSystemDeleted) {
                            console.log(`✅ Deleted report log from file system: ${log.id}`);
                        } else {
                            console.warn(`⚠️ Failed to delete report log from file system: ${log.id}`);
                        }
                    }
                } catch (error) {
                    console.error(`Error deleting report log from file system: ${log.id}:`, error);
                }
            }

            // Also remove from localStorage
            this.saveReportLogs(filteredLogs);
        }

        return deletedCount;
    }

    async clearAllReportLogs(): Promise<void> {
        // Get all logs to delete from file system
        const reportLogs = this.getReportLogs();

        // Delete from file system first
        for (const log of reportLogs) {
            try {
                if ((window.electronAPI as any)?.fileSystem?.deleteReportLog) {
                    const fileSystemDeleted = await (window.electronAPI as any).fileSystem.deleteReportLog(log.id);
                    if (fileSystemDeleted) {
                        console.log(`✅ Deleted report log from file system: ${log.id}`);
                    } else {
                        console.warn(`⚠️ Failed to delete report log from file system: ${log.id}`);
                    }
                }
            } catch (error) {
                console.error(`Error deleting report log from file system: ${log.id}:`, error);
            }
        }

        // Also clear localStorage
        this.saveReportLogs([]);
    }

    private generateId(): string {
        return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Helper method to create a report log from a completed report generation
    async createFromReportGeneration(
        reportId: string,
        reportName: string,
        prompt: string,
        tableData: { columns: string[]; results: Array<Record<string, unknown>>; csv: string },
        totalTasks: number,
        processedTasks: number,
        startTime: number,
        status: 'completed' | 'failed' = 'completed',
        errorMessage?: string,
        extractedParameters?: {
            parameters: {
                limit?: number;
                taskStatus?: 'new' | 'done' | 'canceled' | 'in-work' | 'on-moderation' | 'awaiting-approve' | 'on-payment' | 'in-queue';
                timeRangeFrom?: string;
                timeRangeTo?: string;
            };
            humanReadable: string[];
        }
    ): Promise<ReportLog> {
        const completedAt = new Date().toISOString();
        const duration = Date.now() - startTime;

        return await this.createReportLog({
            reportId,
            reportName,
            prompt,
            generatedAt: new Date(startTime).toISOString(),
            completedAt,
            status,
            totalTasks,
            processedTasks,
            tableData,
            extractedParameters,
            metadata: {
                duration,
                errorMessage,
                userAgent: navigator.userAgent,
                version: '1.0.0'
            }
        });
    }
}

export const reportLogService = new ReportLogService();
