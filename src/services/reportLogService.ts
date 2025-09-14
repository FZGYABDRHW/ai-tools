import { ReportLog } from '../types';

const REPORT_LOGS_STORAGE_KEY = 'wowworks_report_logs';

class ReportLogService {
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
        return this.getReportLogs();
    }

    getReportLogsByReportId(reportId: string): ReportLog[] {
        const reportLogs = this.getReportLogs();
        return reportLogs.filter(log => log.reportId === reportId);
    }

    getReportLogById(id: string): ReportLog | null {
        const reportLogs = this.getReportLogs();
        return reportLogs.find(log => log.id === id) || null;
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
