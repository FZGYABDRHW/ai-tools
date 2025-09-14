// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Auto-updater APIs
  checkForUpdates: () => ipcRenderer.invoke('auto-updater:check-for-updates'),
  forceCheckForUpdates: () => ipcRenderer.invoke('auto-updater:force-check-for-updates'),
  downloadToDisk: (updateInfo: any) => ipcRenderer.invoke('auto-updater:download-to-disk', updateInfo),
  downloadLatestVersion: () => ipcRenderer.invoke('auto-updater:download-latest-version'),

  installUpdate: () => ipcRenderer.invoke('auto-updater:install-update'),
  getAppVersion: () => ipcRenderer.invoke('auto-updater:get-app-version'),
  testIpc: () => ipcRenderer.invoke('auto-updater:test-ipc'),

  // Settings APIs
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings: any) => ipcRenderer.invoke('settings:save', settings),

  // Auto-updater event listeners
  onAutoUpdaterStatus: (callback: (status: any) => void) => {
    ipcRenderer.on('auto-updater:status', (_, status) => callback(status));
  },
  onAutoUpdaterShowUpdateDialog: (callback: (info: any) => void) => {
    ipcRenderer.on('auto-updater:show-update-dialog', (_, info) => callback(info));
  },
  onAutoUpdaterShowInstallDialog: (callback: (info: any) => void) => {
    ipcRenderer.on('auto-updater:show-install-dialog', (_, info) => callback(info));
  },

  // Remove event listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // File System Storage APIs
  fileSystem: {
    // Reports
    saveReport: (report: any) => ipcRenderer.invoke('filesystem:save-report', report),
    getReport: (id: string) => ipcRenderer.invoke('filesystem:get-report', id),
    getAllReports: () => ipcRenderer.invoke('filesystem:get-all-reports'),
    deleteReport: (id: string) => ipcRenderer.invoke('filesystem:delete-report', id),

    // Report Logs
    saveReportLog: (log: any) => ipcRenderer.invoke('filesystem:save-report-log', log),
    getReportLogs: (reportId?: string) => ipcRenderer.invoke('filesystem:get-report-logs', reportId),
    deleteReportLog: (id: string) => ipcRenderer.invoke('filesystem:delete-report-log', id),

    // Checkpoints
    saveCheckpoint: (reportId: string, checkpoint: any) => ipcRenderer.invoke('filesystem:save-checkpoint', reportId, checkpoint),
    getCheckpoint: (reportId: string) => ipcRenderer.invoke('filesystem:get-checkpoint', reportId),
    deleteCheckpoint: (reportId: string) => ipcRenderer.invoke('filesystem:delete-checkpoint', reportId),

    // Generation States
    saveGenerationState: (reportId: string, state: any) => ipcRenderer.invoke('filesystem:save-generation-state', reportId, state),
    getGenerationState: (reportId: string) => ipcRenderer.invoke('filesystem:get-generation-state', reportId),
    deleteGenerationState: (reportId: string) => ipcRenderer.invoke('filesystem:delete-generation-state', reportId),

    // Utility
    getStorageSize: () => ipcRenderer.invoke('filesystem:get-storage-size'),
    initialize: () => ipcRenderer.invoke('filesystem:initialize'),
    cleanupOrphanedData: () => ipcRenderer.invoke('filesystem:cleanup-orphaned-data'),
  },

  // Migration APIs
  migration: {
    checkLocalStorageData: () => ipcRenderer.invoke('migration:check-localStorage-data'),
    extractLocalStorageData: () => ipcRenderer.invoke('migration:extract-localStorage-data'),
    migrateFromLocalStorage: (data: any) => ipcRenderer.invoke('migration:migrate-from-localStorage', data),
    clearLocalStorage: () => ipcRenderer.invoke('migration:clear-localStorage'),
    hasCompletedMigration: () => ipcRenderer.invoke('migration:has-completed-migration'),
    getMigrationHistory: () => ipcRenderer.invoke('migration:get-migration-history'),
    getLastMigrationResult: () => ipcRenderer.invoke('migration:get-last-migration-result'),
    validateMigrationData: (data: any) => ipcRenderer.invoke('migration:validate-migration-data', data),
  },

  // Download APIs
  download: {
    downloadAllData: (options: any) => ipcRenderer.invoke('download:all-data', options),
    getDownloadStats: (options: any) => ipcRenderer.invoke('download:get-stats', options),
  }
});
