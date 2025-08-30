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

    createReportLog(reportLog: Omit<ReportLog, 'id'>): ReportLog {
        const newReportLog: ReportLog = {
            ...reportLog,
            id: this.generateId(),
        };

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

    deleteReportLog(id: string): boolean {
        const reportLogs = this.getReportLogs();
        const filteredLogs = reportLogs.filter(log => log.id !== id);
        
        if (filteredLogs.length !== reportLogs.length) {
            this.saveReportLogs(filteredLogs);
            return true;
        }
        return false;
    }

    deleteReportLogsByReportId(reportId: string): number {
        const reportLogs = this.getReportLogs();
        const filteredLogs = reportLogs.filter(log => log.reportId !== reportId);
        const deletedCount = reportLogs.length - filteredLogs.length;
        
        if (deletedCount > 0) {
            this.saveReportLogs(filteredLogs);
        }
        
        return deletedCount;
    }

    clearAllReportLogs(): void {
        this.saveReportLogs([]);
    }

    private generateId(): string {
        return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Helper method to create a report log from a completed report generation
    createFromReportGeneration(
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
    ): ReportLog {
        const completedAt = new Date().toISOString();
        const duration = Date.now() - startTime;

        return this.createReportLog({
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
