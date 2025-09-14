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

    private async saveCheckpointToFileSystem(reportId: string, checkpoint: ReportCheckpoint): Promise<boolean> {
        try {
            if ((window.electronAPI as any)?.fileSystem?.saveCheckpoint) {
                return await (window.electronAPI as any).fileSystem.saveCheckpoint(reportId, checkpoint);
            }
            return false;
        } catch (error) {
            console.error('Error saving checkpoint to file system:', error);
            return false;
        }
    }

    async createCheckpoint(
        reportId: string,
        prompt: string,
        totalTasks: number,
        startTime: number,
        startOffset: number = 0
    ): Promise<void> {
        const checkpoint: ReportCheckpoint = {
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

        // Save to file system first
        const fileSystemSaved = await this.saveCheckpointToFileSystem(reportId, checkpoint);
        if (fileSystemSaved) {
            console.log(`✅ Created checkpoint in file system for report ${reportId} at offset ${startOffset}`);
        } else {
            console.warn(`⚠️ Failed to save checkpoint to file system, falling back to localStorage: ${reportId}`);
        }

        // Also save to localStorage for immediate UI updates
        const checkpoints = this.getCheckpoints();
        checkpoints[reportId] = checkpoint;
        this.saveCheckpoints(checkpoints);
        console.log(`Created checkpoint for report ${reportId} at offset ${startOffset}`);
    }

    async updateCheckpoint(
        reportId: string,
        taskId: string,
        result: any,
        currentTaskIndex: number,
        tableData?: {
            columns: string[];
            results: Array<Record<string, unknown>>;
            csv: string;
        }
    ): Promise<void> {
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
            
            // Save to file system first
            const fileSystemSaved = await this.saveCheckpointToFileSystem(reportId, checkpoint);
            if (fileSystemSaved) {
                console.log(`✅ Updated checkpoint in file system for report ${reportId}, task ${currentTaskIndex}/${checkpoint.totalTasks}, offset: ${checkpoint.startOffset}`);
            } else {
                console.warn(`⚠️ Failed to save updated checkpoint to file system, falling back to localStorage: ${reportId}`);
            }
            
            // Also save to localStorage for immediate UI updates
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

    async markCompleted(reportId: string): Promise<void> {
        const checkpoints = this.getCheckpoints();
        const checkpoint = checkpoints[reportId];
        if (checkpoint) {
            checkpoint.status = 'completed';
            checkpoint.lastCheckpointTime = Date.now();
            
            // Save to file system first
            const fileSystemSaved = await this.saveCheckpointToFileSystem(reportId, checkpoint);
            if (fileSystemSaved) {
                console.log(`✅ Marked checkpoint as completed in file system: ${reportId}`);
            } else {
                console.warn(`⚠️ Failed to save completed checkpoint to file system, falling back to localStorage: ${reportId}`);
            }
            
            // Also save to localStorage for immediate UI updates
            this.saveCheckpoints(checkpoints);
        }
    }

    async markFailed(reportId: string, errorMessage: string): Promise<void> {
        const checkpoints = this.getCheckpoints();
        const checkpoint = checkpoints[reportId];
        if (checkpoint) {
            checkpoint.status = 'failed';
            checkpoint.errorMessage = errorMessage;
            checkpoint.lastCheckpointTime = Date.now();
            
            // Save to file system first
            const fileSystemSaved = await this.saveCheckpointToFileSystem(reportId, checkpoint);
            if (fileSystemSaved) {
                console.log(`✅ Marked checkpoint as failed in file system: ${reportId}`);
            } else {
                console.warn(`⚠️ Failed to save failed checkpoint to file system, falling back to localStorage: ${reportId}`);
            }
            
            // Also save to localStorage for immediate UI updates
            this.saveCheckpoints(checkpoints);
        }
    }

    async markPaused(reportId: string): Promise<void> {
        console.log(`Marking checkpoint ${reportId} as paused`);
        const checkpoints = this.getCheckpoints();
        const checkpoint = checkpoints[reportId];
        if (checkpoint) {
            checkpoint.status = 'paused';
            checkpoint.lastCheckpointTime = Date.now();
            
            // Save to file system first
            const fileSystemSaved = await this.saveCheckpointToFileSystem(reportId, checkpoint);
            if (fileSystemSaved) {
                console.log(`✅ Marked checkpoint as paused in file system: ${reportId}`);
            } else {
                console.warn(`⚠️ Failed to save paused checkpoint to file system, falling back to localStorage: ${reportId}`);
            }
            
            // Also save to localStorage for immediate UI updates
            this.saveCheckpoints(checkpoints);
            console.log(`Checkpoint ${reportId} marked as paused successfully`);
        } else {
            console.log(`No checkpoint found for ${reportId} when trying to mark as paused`);
        }
    }

    async resumeCheckpoint(reportId: string): Promise<ReportCheckpoint | null> {
        const checkpoint = this.getCheckpoint(reportId);
        console.log(`Resume checkpoint called for ${reportId}:`, checkpoint);
        
        if (checkpoint && (checkpoint.status === 'paused' || checkpoint.status === 'in_progress')) {
            console.log(`Resuming checkpoint ${reportId} from status: ${checkpoint.status}`);
            checkpoint.status = 'in_progress';
            checkpoint.lastCheckpointTime = Date.now();
            
            // Save to file system first
            const fileSystemSaved = await this.saveCheckpointToFileSystem(reportId, checkpoint);
            if (fileSystemSaved) {
                console.log(`✅ Resumed checkpoint in file system: ${reportId}`);
            } else {
                console.warn(`⚠️ Failed to save resumed checkpoint to file system, falling back to localStorage: ${reportId}`);
            }
            
            // Also save to localStorage for immediate UI updates
            const checkpoints = this.getCheckpoints();
            checkpoints[reportId] = checkpoint;
            this.saveCheckpoints(checkpoints);
            console.log(`Checkpoint ${reportId} resumed successfully`);
            return checkpoint;
        }
        
        console.log(`Cannot resume checkpoint ${reportId}:`, checkpoint ? `status is ${checkpoint.status}` : 'checkpoint not found');
        return null;
    }

    async clearCheckpoint(reportId: string): Promise<void> {
        // Delete from file system first
        try {
            if ((window.electronAPI as any)?.fileSystem?.deleteCheckpoint) {
                const fileSystemDeleted = await (window.electronAPI as any).fileSystem.deleteCheckpoint(reportId);
                if (fileSystemDeleted) {
                    console.log(`✅ Deleted checkpoint from file system: ${reportId}`);
                } else {
                    console.warn(`⚠️ Failed to delete checkpoint from file system: ${reportId}`);
                }
            }
        } catch (error) {
            console.error(`Error deleting checkpoint from file system: ${reportId}:`, error);
        }

        // Also remove from localStorage
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
