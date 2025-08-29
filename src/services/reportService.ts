import { Report, CreateReportRequest, UpdateReportRequest } from '../types';

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
        const reports = this.getReportsFromStorage();
        const newReport: Report = {
            id: this.generateId(),
            name: request.name,
            prompt: request.prompt,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        reports.push(newReport);
        this.saveReportsToStorage(reports);
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

        this.saveReportsToStorage(filteredReports);
        return true;
    }

    saveReportData(id: string, tableData: {
        columns: string[];
        results: Array<Record<string, unknown>>;
        csv: string;
    }): Report | null {
        const reports = this.getReportsFromStorage();
        const index = reports.findIndex(report => report.id === id);
        
        if (index === -1) return null;

        reports[index] = {
            ...reports[index],
            tableData,
            lastGeneratedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.saveReportsToStorage(reports);
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
}

export const reportService = new ReportService();
