declare global {
  interface Window {
    electronAPI: {
      // Auto-updater APIs
      checkForUpdates: () => Promise<any>;
      forceCheckForUpdates: () => Promise<any>;
      downloadToDisk: (updateInfo: any) => Promise<any>;
      downloadLatestVersion: () => Promise<any>;

      installUpdate: () => Promise<void>;
      getAppVersion: () => Promise<string>;
      testIpc: () => Promise<any>;

      // Settings APIs
      loadSettings: () => Promise<any>;
      saveSettings: (settings: any) => Promise<void>;

      // Auto-updater event listeners
      onAutoUpdaterStatus: (callback: (status: any) => void) => void;
      onAutoUpdaterShowUpdateDialog: (callback: (info: any) => void) => void;
      onAutoUpdaterShowInstallDialog: (callback: (info: any) => void) => void;

      // Remove event listeners
      removeAllListeners: (channel: string) => void;

      // File System Storage APIs
      fileSystem: {
        // Reports
        saveReport: (report: any) => Promise<boolean>;
        getReport: (id: string) => Promise<any>;
        getAllReports: () => Promise<any[]>;
        deleteReport: (id: string) => Promise<boolean>;

        // Report Logs
        saveReportLog: (log: any) => Promise<boolean>;
        getReportLogs: (reportId?: string) => Promise<any[]>;
        deleteReportLog: (id: string) => Promise<boolean>;

        // Checkpoints
        saveCheckpoint: (reportId: string, checkpoint: any) => Promise<boolean>;
        getCheckpoint: (reportId: string) => Promise<any>;
        deleteCheckpoint: (reportId: string) => Promise<boolean>;

        // Generation States
        saveGenerationState: (reportId: string, state: any) => Promise<boolean>;
        getGenerationState: (reportId: string) => Promise<any>;
        deleteGenerationState: (reportId: string) => Promise<boolean>;

        // Utility
        getStorageSize: () => Promise<number>;
        initialize: () => Promise<{ success: boolean }>;
        cleanupOrphanedData: () => Promise<number>;
      };

      // Migration APIs
      migration: {
        checkLocalStorageData: () => Promise<boolean>;
        extractLocalStorageData: () => Promise<any>;
        migrateFromLocalStorage: (data: any) => Promise<any>;
        clearLocalStorage: () => Promise<boolean>;
        hasCompletedMigration: () => Promise<boolean>;
        getMigrationHistory: () => Promise<any[]>;
        getLastMigrationResult: () => Promise<any>;
        validateMigrationData: (data: any) => Promise<any>;
      };

      // Download APIs
      download: {
        downloadAllData: (options: any) => Promise<any>;
        getDownloadStats: (options: any) => Promise<{ fileCount: number; totalSize: number }>;
      };
    };
  }
}

export {};
