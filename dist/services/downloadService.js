"use strict";
// This service will be used in the renderer process
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadService = void 0;
class DownloadService {
    /**
     * Download all application data as a ZIP file
     */
    async downloadAllData(options = {}) {
        try {
            const defaultOptions = {
                includeReports: true,
                includeLogs: true,
                includeCheckpoints: true,
                includeGenerationStates: true,
                includeBackups: true,
                ...options
            };
            const result = await window.electronAPI?.download?.downloadAllData(defaultOptions);
            return result;
        }
        catch (error) {
            console.error('Download failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    /**
     * Get download statistics (file count, total size)
     */
    async getDownloadStats(options = {}) {
        try {
            const defaultOptions = {
                includeReports: true,
                includeLogs: true,
                includeCheckpoints: true,
                includeGenerationStates: true,
                includeBackups: true,
                ...options
            };
            const stats = await window.electronAPI?.download?.getDownloadStats(defaultOptions);
            return stats;
        }
        catch (error) {
            console.error('Failed to get download stats:', error);
            return { fileCount: 0, totalSize: 0 };
        }
    }
}
exports.downloadService = new DownloadService();
//# sourceMappingURL=downloadService.js.map