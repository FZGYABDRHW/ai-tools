import { buildServiceInitializer } from '../serviceInit';
import { buildReport } from '../reportBuilder';
import builder from '../builder';
import { reportService } from './reportService';
import { reportLogService } from './reportLogService';
import { reportCheckpointService } from './reportCheckpointService';
import { TaskListParameters } from './parameterExtractionService';

export type GenerationStatus = 'in_progress' | 'paused' | 'completed' | 'failed' | 'ready';

export interface ReportGenerationState {
    reportId: string;
    status: GenerationStatus;
    progress: {
        processed: number;
        total: number;
    } | null;
    tableData: {
        columns: string[];
        results: Array<Record<string, unknown>>;
        csv: string;
    } | null;
    startTime: number;
    abortController: AbortController | null;
    errorMessage?: string;
    parameters?: TaskListParameters;
    extractedParameters?: {
        parameters: TaskListParameters;
        humanReadable: string[];
    };
}

interface GenerationCallbacks {
    onProgress?: (progress: any) => void;
    onComplete?: (result: any) => void;
    onError?: (error: any) => void;
}

class ReportGenerationService {
    private readonly STORAGE_KEY = 'wowworks_report_generations';
    private activeGenerations: Map<string, ReportGenerationState> = new Map();
    private generationCallbacks: Map<string, GenerationCallbacks> = new Map();

    constructor() {
        this.loadActiveGenerations();
    }

    private getStorageKey(): string {
        return this.STORAGE_KEY;
    }

    private loadActiveGenerations(): void {
        try {
            const stored = localStorage.getItem(this.getStorageKey());
            if (stored) {
                const generations = JSON.parse(stored);
                // Note: We can't restore AbortController from storage, so we'll create new ones
                Object.entries(generations).forEach(([reportId, state]: [string, any]) => {
                    // Handle legacy data that might have isGenerating instead of status
                    const status = state.status || (state.isGenerating ? 'in_progress' : 'completed');
                    
                    this.activeGenerations.set(reportId, {
                        ...state,
                        status,
                        abortController: null // Will be recreated when needed
                    });
                });
            }
        } catch (error) {
            console.error('Error loading active generations:', error);
        }
    }

    private saveActiveGenerations(): void {
        try {
            const generations: Record<string, Omit<ReportGenerationState, 'abortController'>> = {};
            this.activeGenerations.forEach((state, reportId) => {
                generations[reportId] = {
                    reportId: state.reportId,
                    status: state.status,
                    progress: state.progress,
                    tableData: state.tableData,
                    startTime: state.startTime,
                    errorMessage: state.errorMessage
                };
            });
            localStorage.setItem(this.getStorageKey(), JSON.stringify(generations));
        } catch (error) {
            console.error('Error saving active generations:', error);
        }
    }

    getActiveGenerations(): Map<string, ReportGenerationState> {
        return this.activeGenerations;
    }

    getGenerationState(reportId: string): ReportGenerationState | null {
        return this.activeGenerations.get(reportId) || null;
    }

    setCallbacks(reportId: string, callbacks: GenerationCallbacks): void {
        this.generationCallbacks.set(reportId, callbacks);
    }

    getCallbacks(reportId: string): GenerationCallbacks | null {
        return this.generationCallbacks.get(reportId) || null;
    }

    clearCallbacks(reportId: string): void {
        this.generationCallbacks.delete(reportId);
    }

    isGenerating(reportId: string): boolean {
        const state = this.activeGenerations.get(reportId);
        return state?.status === 'in_progress';
    }

    getGenerationStatus(reportId: string): GenerationStatus | null {
        const state = this.activeGenerations.get(reportId);
        return state?.status || null;
    }

    updateGenerationStatus(reportId: string, status: GenerationStatus, errorMessage?: string): void {
        const state = this.activeGenerations.get(reportId);
        if (state) {
            state.status = status;
            if (errorMessage) {
                state.errorMessage = errorMessage;
            }
            this.activeGenerations.set(reportId, state);
            this.saveActiveGenerations();
            console.log(`Updated generation status for ${reportId}: ${status}`);
        }
    }

    resetToReady(reportId: string): boolean {
        const state = this.activeGenerations.get(reportId);
        if (state && (state.status === 'paused' || state.status === 'in_progress')) {
            // Clear generation state but keep the report
            this.clearGeneration(reportId);
            
            // Clear checkpoint data
            reportCheckpointService.clearCheckpoint(reportId);
            
            // Clear saved report data (table results)
            reportService.clearReportData(reportId);
            
            console.log(`Reset report ${reportId} to ready state - cleared all data (from ${state.status})`);
            return true;
        }
        console.log(`Cannot reset report ${reportId} to ready state. Current status: ${state?.status}`);
        return false;
    }

    setToPaused(reportId: string): boolean {
        const state = this.activeGenerations.get(reportId);
        if (state && state.status === 'in_progress') {
            this.updateGenerationStatus(reportId, 'paused');
            return true;
        }
        return false;
    }

    setToCompleted(reportId: string): boolean {
        const state = this.activeGenerations.get(reportId);
        if (state && state.status === 'in_progress') {
            this.updateGenerationStatus(reportId, 'completed');
            return true;
        }
        return false;
    }

    rerunFromCompleted(reportId: string): boolean {
        const state = this.activeGenerations.get(reportId);
        if (state && state.status === 'completed') {
            // Clear the completed state to allow new generation
            this.clearGeneration(reportId);
            console.log(`Report ${reportId} ready for rerun`);
            return true;
        }
        return false;
    }

    restartFromFailed(reportId: string): boolean {
        const state = this.activeGenerations.get(reportId);
        if (state && state.status === 'failed') {
            // Clear the failed state to allow new generation
            this.clearGeneration(reportId);
            console.log(`Report ${reportId} ready for restart from failed state`);
            return true;
        }
        return false;
    }

    async startGeneration(
        reportId: string, 
        reportText: string, 
        authToken: string,
        onProgress?: (progress: any) => void,
        onComplete?: (result: any) => void,
        onError?: (error: any) => void,
        startOffset: number = 0,
        parameters?: TaskListParameters
    ): Promise<void> {
        // Store callbacks for this generation
        this.setCallbacks(reportId, { onProgress, onComplete, onError });
        // Create or get report
        let report = reportService.getReportById(reportId);
        if (!report) {
            report = reportService.createReport({
                name: 'Custom Operational Report',
                prompt: reportText
            });
        }

        const abortController = new AbortController();
        const startTime = Date.now();

        // Check if we're resuming and preserve existing data
        const existingState = this.activeGenerations.get(reportId);
        let existingTableData = existingState?.tableData;
        const existingProgress = existingState?.progress;
        
        // If resuming, get table data from checkpoint
        if (startOffset > 0) {
            const checkpoint = reportCheckpointService.getCheckpoint(reportId);
            if (checkpoint?.tableData) {
                existingTableData = checkpoint.tableData;
                console.log(`Restoring table data from checkpoint: ${existingTableData.results.length} results`);
            }
        }

        const generationState: ReportGenerationState = {
            reportId,
            status: 'in_progress',
            progress: existingProgress || null,
            tableData: existingTableData || null,
            startTime,
            abortController,
            parameters
        };

        this.activeGenerations.set(reportId, generationState);
        this.saveActiveGenerations();

        // Create checkpoint for this generation only if not resuming
        if (startOffset === 0) {
            reportCheckpointService.createCheckpoint(reportId, reportText, 0, startTime, startOffset);
        } else {
            console.log(`Resuming generation - using existing checkpoint with offset ${startOffset}`);
        }

        try {
            const si = buildServiceInitializer(authToken);
            
            // Start the build process and get parameters immediately
            const result = await buildReport(
                reportText,
                si,
                (taskId) => builder(taskId, authToken),
                (progress) => {
                    // Merge new progress with existing data if resuming
                    let mergedProgress = progress;
                    if (existingTableData && startOffset > 0) {
                        // Merge existing results with new results
                        mergedProgress = {
                            ...progress,
                            results: [...existingTableData.results, ...progress.results]
                        };
                        console.log(`Merged progress: ${existingTableData.results.length} existing + ${progress.results.length} new = ${mergedProgress.results.length} total`);
                    } else {
                        // For new generation, use progress as is
                        mergedProgress = progress;
                    }

                    // Update state
                    generationState.tableData = mergedProgress;
                    generationState.progress = {
                        processed: mergedProgress.results.length,
                        total: mergedProgress.results.length
                    };
                    this.saveActiveGenerations();

                    // Save to report service
                    reportService.saveReportData(reportId, mergedProgress);

                    // Update checkpoint with the total number of tasks processed
                    const totalTasksProcessed = mergedProgress.results.length;
                    reportCheckpointService.updateCheckpoint(
                        reportId, 
                        `task_${totalTasksProcessed}`, 
                        mergedProgress, 
                        totalTasksProcessed,
                        mergedProgress
                    );

                    // Call progress callback
                    const callbacks = this.getCallbacks(reportId);
                    callbacks?.onProgress?.(mergedProgress);
                },
                (extractedParams) => {
                    // Store extracted parameters immediately for UI display
                    generationState.extractedParameters = extractedParams;
                    this.saveActiveGenerations();
                    console.log('Parameters extracted and stored immediately:', extractedParams);
                },
                abortController.signal,
                startOffset,
                parameters
            );

            // Final save - merge with existing data if resuming
            let finalResult = result;
            if (existingTableData && startOffset > 0) {
                finalResult = {
                    ...result,
                    results: [...existingTableData.results, ...result.results]
                };
                console.log(`Final result merged: ${existingTableData.results.length} existing + ${result.results.length} new = ${finalResult.results.length} total`);
            }

            generationState.tableData = finalResult;
            
            // Store extracted parameters if available
            if (result.extractedParameters) {
                generationState.extractedParameters = result.extractedParameters;
                console.log('Stored extracted parameters:', result.extractedParameters);
            }
            
            this.updateGenerationStatus(reportId, 'completed');

            // Save to report service with extracted parameters
            reportService.saveReportData(reportId, finalResult, result.extractedParameters);

            // Create report log with extracted parameters
            reportLogService.createFromReportGeneration(
                reportId,
                report.name,
                reportText,
                finalResult,
                finalResult.results.length,
                finalResult.results.length,
                startTime,
                'completed',
                undefined,
                result.extractedParameters
            );

            // Mark checkpoint as completed
            reportCheckpointService.markCompleted(reportId);

            const callbacks = this.getCallbacks(reportId);
            callbacks?.onComplete?.(finalResult);
            this.clearCallbacks(reportId);
        } catch (error: any) {
            if (error.message !== 'Aborted') {
                // Create report log for failed generation
                const failedData = generationState.tableData || { columns: [], results: [], csv: '' };
                reportLogService.createFromReportGeneration(
                    reportId,
                    report.name,
                    reportText,
                    failedData,
                    generationState.progress?.processed || 0,
                    generationState.progress?.total || 0,
                    startTime,
                    'failed',
                    error.message
                );

                // Mark checkpoint as failed
                reportCheckpointService.markFailed(reportId, error.message);
                
                // Update generation status to failed
                this.updateGenerationStatus(reportId, 'failed', error.message);
            } else {
                // Mark checkpoint as paused for aborted generations
                reportCheckpointService.markPaused(reportId);
                
                // Update generation status to paused
                this.updateGenerationStatus(reportId, 'paused');
            }

            const callbacks = this.getCallbacks(reportId);
            callbacks?.onError?.(error);
            this.clearCallbacks(reportId);
        }
    }

    stopGeneration(reportId: string): boolean {
        const state = this.activeGenerations.get(reportId);
        if (state?.abortController) {
            state.abortController.abort();
            
            // Mark checkpoint as paused when manually stopped
            reportCheckpointService.markPaused(reportId);
            
            // Update generation status to paused
            this.updateGenerationStatus(reportId, 'paused');
            
            return true;
        }
        return false;
    }

    clearGeneration(reportId: string): void {
        this.activeGenerations.delete(reportId);
        this.saveActiveGenerations();
    }

    clearAllGenerations(): void {
        this.activeGenerations.clear();
        this.saveActiveGenerations();
    }

    reconnectToGeneration(reportId: string, callbacks: GenerationCallbacks): boolean {
        const state = this.getGenerationState(reportId);
        if (state && state.status === 'in_progress') {
            this.setCallbacks(reportId, callbacks);
            // Trigger immediate callback with current state
            if (state.tableData) {
                callbacks.onProgress?.(state.tableData);
            }
            return true;
        }
        return false;
    }

    async resumeGeneration(
        reportId: string,
        authToken: string,
        onProgress?: (progress: any) => void,
        onComplete?: (result: any) => void,
        onError?: (error: any) => void
    ): Promise<void> {
        console.log(`Attempting to resume generation for report ${reportId}`);
        const checkpoint = reportCheckpointService.getCheckpoint(reportId);
        console.log('Checkpoint found:', checkpoint);
        
        if (!checkpoint) {
            console.error('No checkpoint found for this report');
            throw new Error('No checkpoint found for this report');
        }
        
        console.log(`Checkpoint status: ${checkpoint.status}`);
        if (checkpoint.status !== 'paused' && checkpoint.status !== 'in_progress') {
            console.error(`Checkpoint status is ${checkpoint.status}, cannot resume`);
            throw new Error(`Checkpoint status is ${checkpoint.status}, cannot resume`);
        }

        // Resume the checkpoint
        console.log('Attempting to resume checkpoint...');
        const resumedCheckpoint = reportCheckpointService.resumeCheckpoint(reportId);
        if (!resumedCheckpoint) {
            console.error('Failed to resume checkpoint');
            throw new Error('Failed to resume checkpoint');
        }
        console.log('Checkpoint resumed successfully:', resumedCheckpoint);

        // Calculate the correct offset for resuming
        const startOffset = reportCheckpointService.getResumeOffset(reportId);
        console.log(`Resuming report ${reportId} from offset ${startOffset} with ${checkpoint.currentTaskIndex} completed tasks`);

        // Start generation from where it left off
        console.log('Starting generation with startOffset:', startOffset);
        await this.startGeneration(
            reportId,
            checkpoint.prompt,
            authToken,
            onProgress,
            onComplete,
            onError,
            startOffset
        );
    }
}

export const reportGenerationService = new ReportGenerationService();
