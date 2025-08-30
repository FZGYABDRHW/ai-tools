import { reportService } from './reportService';
import { reportLogService } from './reportLogService';

export interface ReportCheckpoint {
    reportId: string;
    prompt: string;
    currentTaskIndex: number;
    completedTasks: Array<{
        taskId: string;
        result: any;
        timestamp: number;
    }>;
    totalTasks: number;
    startTime: number;
    lastCheckpointTime: number;
    status: 'in_progress' | 'completed' | 'failed' | 'paused';
    errorMessage?: string;
    startOffset: number; // Track the actual offset in the task list
    tableData?: {
        columns: string[];
        results: Array<Record<string, unknown>>;
        csv: string;
    }; // Store accumulated table data
}

class ReportCheckpointService {
    private readonly STORAGE_KEY = 'wowworks_report_checkpoints';

    private getStorageKey(): string {
        return this.STORAGE_KEY;
    }

    private getCheckpoints(): Record<string, ReportCheckpoint> {
        try {
            const stored = localStorage.getItem(this.getStorageKey());
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading checkpoints:', error);
            return {};
        }
    }

    private saveCheckpoints(checkpoints: Record<string, ReportCheckpoint>): void {
        try {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(checkpoints));
        } catch (error) {
            console.error('Error saving checkpoints:', error);
        }
    }

    createCheckpoint(
        reportId: string,
        prompt: string,
        totalTasks: number,
        startTime: number,
        startOffset: number = 0
    ): void {
        const checkpoints = this.getCheckpoints();
        checkpoints[reportId] = {
            reportId,
            prompt,
            currentTaskIndex: 0,
            completedTasks: [],
            totalTasks,
            startTime,
            lastCheckpointTime: Date.now(),
            status: 'in_progress',
            startOffset
        };
        this.saveCheckpoints(checkpoints);
        console.log(`Created checkpoint for report ${reportId} at offset ${startOffset}`);
    }

    updateCheckpoint(
        reportId: string,
        taskId: string,
        result: any,
        currentTaskIndex: number,
        tableData?: {
            columns: string[];
            results: Array<Record<string, unknown>>;
            csv: string;
        }
    ): void {
        const checkpoints = this.getCheckpoints();
        const checkpoint = checkpoints[reportId];
        
        if (checkpoint) {
            checkpoint.completedTasks.push({
                taskId,
                result,
                timestamp: Date.now()
            });
            checkpoint.currentTaskIndex = currentTaskIndex;
            checkpoint.lastCheckpointTime = Date.now();
            
            // Update the startOffset to reflect the API offset for the next page
            // Each page has 30 tasks, so we calculate which page we're on
            const tasksPerPage = 30;
            const completedPages = Math.floor(currentTaskIndex / tasksPerPage);
            checkpoint.startOffset = completedPages * tasksPerPage;
            
            // Store the accumulated table data
            if (tableData) {
                checkpoint.tableData = tableData;
            }
            
            this.saveCheckpoints(checkpoints);
            console.log(`Updated checkpoint for report ${reportId}, task ${currentTaskIndex}/${checkpoint.totalTasks}, offset: ${checkpoint.startOffset}`);
        }
    }

    getCheckpoint(reportId: string): ReportCheckpoint | null {
        const checkpoints = this.getCheckpoints();
        return checkpoints[reportId] || null;
    }

    hasCheckpoint(reportId: string): boolean {
        return this.getCheckpoint(reportId) !== null;
    }

    canResume(reportId: string): boolean {
        const checkpoint = this.getCheckpoint(reportId);
        const canResume = checkpoint !== null && (checkpoint.status === 'in_progress' || checkpoint.status === 'paused');
        console.log(`Can resume ${reportId}:`, canResume, checkpoint?.status);
        return canResume;
    }

    markCompleted(reportId: string): void {
        const checkpoints = this.getCheckpoints();
        const checkpoint = checkpoints[reportId];
        if (checkpoint) {
            checkpoint.status = 'completed';
            checkpoint.lastCheckpointTime = Date.now();
            this.saveCheckpoints(checkpoints);
        }
    }

    markFailed(reportId: string, errorMessage: string): void {
        const checkpoints = this.getCheckpoints();
        const checkpoint = checkpoints[reportId];
        if (checkpoint) {
            checkpoint.status = 'failed';
            checkpoint.errorMessage = errorMessage;
            checkpoint.lastCheckpointTime = Date.now();
            this.saveCheckpoints(checkpoints);
        }
    }

    markPaused(reportId: string): void {
        console.log(`Marking checkpoint ${reportId} as paused`);
        const checkpoints = this.getCheckpoints();
        const checkpoint = checkpoints[reportId];
        if (checkpoint) {
            checkpoint.status = 'paused';
            checkpoint.lastCheckpointTime = Date.now();
            this.saveCheckpoints(checkpoints);
            console.log(`Checkpoint ${reportId} marked as paused successfully`);
        } else {
            console.log(`No checkpoint found for ${reportId} when trying to mark as paused`);
        }
    }

    resumeCheckpoint(reportId: string): ReportCheckpoint | null {
        const checkpoint = this.getCheckpoint(reportId);
        if (checkpoint && checkpoint.status === 'paused') {
            checkpoint.status = 'in_progress';
            checkpoint.lastCheckpointTime = Date.now();
            const checkpoints = this.getCheckpoints();
            checkpoints[reportId] = checkpoint;
            this.saveCheckpoints(checkpoints);
            return checkpoint;
        }
        return null;
    }

    clearCheckpoint(reportId: string): void {
        const checkpoints = this.getCheckpoints();
        delete checkpoints[reportId];
        this.saveCheckpoints(checkpoints);
    }

    getAllCheckpoints(): ReportCheckpoint[] {
        const checkpoints = this.getCheckpoints();
        return Object.values(checkpoints);
    }

    getResumableCheckpoints(): ReportCheckpoint[] {
        return this.getAllCheckpoints().filter(cp => 
            cp.status === 'in_progress' || cp.status === 'paused'
        );
    }

    // Calculate progress percentage
    getProgressPercentage(reportId: string): number {
        const checkpoint = this.getCheckpoint(reportId);
        if (!checkpoint) return 0;
        return Math.round((checkpoint.currentTaskIndex / checkpoint.totalTasks) * 100);
    }

    // Get estimated time remaining
    getEstimatedTimeRemaining(reportId: string): number {
        const checkpoint = this.getCheckpoint(reportId);
        if (!checkpoint || checkpoint.currentTaskIndex === 0) return 0;

        const elapsed = Date.now() - checkpoint.startTime;
        const avgTimePerTask = elapsed / checkpoint.currentTaskIndex;
        const remainingTasks = checkpoint.totalTasks - checkpoint.currentTaskIndex;
        
        return Math.round(avgTimePerTask * remainingTasks);
    }

    getResumeOffset(reportId: string): number {
        const checkpoint = this.getCheckpoint(reportId);
        if (!checkpoint) return 0;
        
        // Calculate the API offset based on completed tasks
        // Each page has 30 tasks, so we need to find which page we're on
        const tasksPerPage = 30;
        const completedPages = Math.floor(checkpoint.currentTaskIndex / tasksPerPage);
        const resumeOffset = completedPages * tasksPerPage;
        
        console.log(`Resume offset calculation: ${checkpoint.currentTaskIndex} completed tasks, ${completedPages} pages, offset: ${resumeOffset}`);
        return resumeOffset;
    }
}

export const reportCheckpointService = new ReportCheckpointService();
