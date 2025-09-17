// This service will be used in the renderer process

export interface DownloadOptions {
  includeReports?: boolean;
  includeLogs?: boolean;
  includeCheckpoints?: boolean;
  includeGenerationStates?: boolean;
  includeBackups?: boolean;
}

export interface DownloadResult {
  success: boolean;
  filePath?: string;
  error?: string;
  fileCount?: number;
  totalSize?: number;
}

class DownloadService {
  /**
   * Download all application data as a ZIP file
   */
  async downloadAllData(options: DownloadOptions = {}): Promise<DownloadResult> {
    try {
      const defaultOptions: DownloadOptions = {
        includeReports: true,
        includeLogs: true,
        includeCheckpoints: true,
        includeGenerationStates: true,
        includeBackups: true,
        ...options
      };

      const result = await (window.electronAPI as any)?.download?.downloadAllData(defaultOptions);
      return result;
    } catch (error) {
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
  async getDownloadStats(options: DownloadOptions = {}): Promise<{ fileCount: number; totalSize: number }> {
    try {
      const defaultOptions: DownloadOptions = {
        includeReports: true,
        includeLogs: true,
        includeCheckpoints: true,
        includeGenerationStates: true,
        includeBackups: true,
        ...options
      };

      const stats = await (window.electronAPI as any)?.download?.getDownloadStats(defaultOptions);
      return stats || { fileCount: 0, totalSize: 0 };
    } catch (error) {
      console.error('Failed to get download stats:', error);
      return { fileCount: 0, totalSize: 0 };
    }
  }
}

export const downloadService = new DownloadService();
