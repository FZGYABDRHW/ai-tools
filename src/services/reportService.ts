import { Report, CreateReportRequest, UpdateReportRequest } from '../types';
import { reportGenerationService } from './reportGenerationService';
import { reportCheckpointService } from './reportCheckpointService';

class ReportService {
    private readonly STORAGE_KEY = 'ai_tools_reports';

    private getReportsFromStorage(): Report[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading reports from storage:', error);
            return [];
        }
    }

    private saveReportsToStorage(reports: Report[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
        } catch (error) {
            console.error('Error saving reports to storage:', error);
        }
    }

    getAllReports(): Report[] {
        return this.getReportsFromStorage();
    }

    getReportById(id: string): Report | null {
        const reports = this.getReportsFromStorage();
        return reports.find(report => report.id === id) || null;
    }

    createReport(request: CreateReportRequest): Report {
        // Validate input
        if (!request.name || request.name.trim() === '') {
            throw new Error('Report name is required');
        }

        const reports = this.getReportsFromStorage();
        
        // Check for duplicate names
        const existingReport = reports.find(report => 
            report.name.toLowerCase() === request.name.toLowerCase()
        );
        if (existingReport) {
            throw new Error('A report with this name already exists');
        }

        const newReport: Report = {
            id: this.generateId(),
            name: request.name.trim(),
            prompt: request.prompt || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        reports.push(newReport);
        this.saveReportsToStorage(reports);
        
        console.log(`Created new report: ${newReport.name} (ID: ${newReport.id})`);
        return newReport;
    }

    updateReport(id: string, updates: UpdateReportRequest): Report | null {
        const reports = this.getReportsFromStorage();
        const index = reports.findIndex(report => report.id === id);
        
        if (index === -1) return null;

        reports[index] = {
            ...reports[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveReportsToStorage(reports);
        return reports[index];
    }

    deleteReport(id: string): boolean {
        const reports = this.getReportsFromStorage();
        const filteredReports = reports.filter(report => report.id !== id);
        
        if (filteredReports.length === reports.length) {
            return false; // Report not found
        }

        // Save the filtered reports (remove the report)
        this.saveReportsToStorage(filteredReports);

        // Clean up all related data for this report
        try {
            // Stop any ongoing generation for this report
            reportGenerationService.stopGeneration(id);
            
            // Clear generation state
            reportGenerationService.clearGeneration(id);
            
            // Clear checkpoint data
            reportCheckpointService.clearCheckpoint(id);
            
            console.log(`Cleaned up all data for report ${id}`);
        } catch (error) {
            console.error(`Error cleaning up data for report ${id}:`, error);
        }

        return true;
    }

    saveReportData(id: string, tableData: {
        columns: string[];
        results: Array<Record<string, unknown>>;
        csv: string;
    }, extractedParameters?: {
        parameters: {
            limit?: number;
            taskStatus?: 'new' | 'done' | 'canceled' | 'in-work' | 'on-moderation' | 'awaiting-approve' | 'on-payment' | 'in-queue';
            timeRangeFrom?: string;
            timeRangeTo?: string;
        };
        humanReadable: string[];
    }): Report | null {
        const reports = this.getReportsFromStorage();
        const index = reports.findIndex(report => report.id === id);
        
        if (index === -1) return null;

        reports[index] = {
            ...reports[index],
            tableData,
            extractedParameters,
            lastGeneratedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.saveReportsToStorage(reports);
        return reports[index];
    }

    clearReportData(id: string): Report | null {
        const reports = this.getReportsFromStorage();
        const index = reports.findIndex(report => report.id === id);
        
        if (index === -1) return null;

        // Remove tableData and lastGeneratedAt
        const { tableData, lastGeneratedAt, ...reportWithoutData } = reports[index];
        
        reports[index] = {
            ...reportWithoutData,
            updatedAt: new Date().toISOString()
        };

        this.saveReportsToStorage(reports);
        console.log(`Cleared table data for report ${id}`);
        return reports[index];
    }

    exportReports(): string {
        const reports = this.getReportsFromStorage();
        return JSON.stringify(reports, null, 2);
    }

    importReports(jsonData: string): boolean {
        try {
            const reports = JSON.parse(jsonData);
            if (Array.isArray(reports)) {
                this.saveReportsToStorage(reports);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing reports:', error);
            return false;
        }
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Clean up all related data for a report without deleting the report itself
     * This is useful for cleaning up generation state, checkpoints, etc.
     */
    cleanupReportData(id: string): void {
        try {
            // Stop any ongoing generation for this report
            reportGenerationService.stopGeneration(id);
            
            // Clear generation state
            reportGenerationService.clearGeneration(id);
            
            // Clear checkpoint data
            reportCheckpointService.clearCheckpoint(id);
            
            console.log(`Cleaned up data for report ${id}`);
        } catch (error) {
            console.error(`Error cleaning up data for report ${id}:`, error);
        }
    }

    /**
     * Check if a report has any related data (generation state, checkpoints, etc.)
     */
    hasRelatedData(id: string): boolean {
        const hasGenerationState = reportGenerationService.getGenerationState(id) !== null;
        const hasCheckpoint = reportCheckpointService.hasCheckpoint(id);
        return hasGenerationState || hasCheckpoint;
    }

    /**
     * Get a summary of what data will be cleaned up when deleting a report
     */
    getCleanupSummary(id: string): {
        hasGenerationState: boolean;
        hasCheckpoint: boolean;
        isGenerating: boolean;
        checkpointStatus?: string;
    } {
        const generationState = reportGenerationService.getGenerationState(id);
        const checkpoint = reportCheckpointService.getCheckpoint(id);
        
        return {
            hasGenerationState: generationState !== null,
            hasCheckpoint: checkpoint !== null,
            isGenerating: reportGenerationService.isGenerating(id),
            checkpointStatus: checkpoint?.status
        };
    }

    /**
     * Clean up orphaned data (data for reports that no longer exist)
     */
    cleanupOrphanedData(): number {
        const reports = this.getAllReports();
        const reportIds = new Set(reports.map(r => r.id));
        
        let cleanedCount = 0;
        
        // Clean up orphaned generation states
        const activeGenerations = reportGenerationService.getActiveGenerations();
        activeGenerations.forEach((state, reportId) => {
            if (!reportIds.has(reportId)) {
                reportGenerationService.clearGeneration(reportId);
                cleanedCount++;
            }
        });
        
        // Clean up orphaned checkpoints
        const allCheckpoints = reportCheckpointService.getAllCheckpoints();
        allCheckpoints.forEach(checkpoint => {
            if (!reportIds.has(checkpoint.reportId)) {
                reportCheckpointService.clearCheckpoint(checkpoint.reportId);
                cleanedCount++;
            }
        });
        
        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} orphaned data entries`);
        }
        
        return cleanedCount;
    }
}

export const reportService = new ReportService();
