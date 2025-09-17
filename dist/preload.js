"use strict";
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Auto-updater APIs
    checkForUpdates: () => electron_1.ipcRenderer.invoke('auto-updater:check-for-updates'),
    forceCheckForUpdates: () => electron_1.ipcRenderer.invoke('auto-updater:force-check-for-updates'),
    downloadToDisk: (updateInfo) => electron_1.ipcRenderer.invoke('auto-updater:download-to-disk', updateInfo),
    downloadLatestVersion: () => electron_1.ipcRenderer.invoke('auto-updater:download-latest-version'),
    installUpdate: () => electron_1.ipcRenderer.invoke('auto-updater:install-update'),
    getAppVersion: () => electron_1.ipcRenderer.invoke('auto-updater:get-app-version'),
    testIpc: () => electron_1.ipcRenderer.invoke('auto-updater:test-ipc'),
    // Settings APIs
    loadSettings: () => electron_1.ipcRenderer.invoke('settings:load'),
    saveSettings: (settings) => electron_1.ipcRenderer.invoke('settings:save', settings),
    // Auto-updater event listeners
    onAutoUpdaterStatus: (callback) => {
        electron_1.ipcRenderer.on('auto-updater:status', (_, status) => callback(status));
    },
    onAutoUpdaterShowUpdateDialog: (callback) => {
        electron_1.ipcRenderer.on('auto-updater:show-update-dialog', (_, info) => callback(info));
    },
    onAutoUpdaterShowInstallDialog: (callback) => {
        electron_1.ipcRenderer.on('auto-updater:show-install-dialog', (_, info) => callback(info));
    },
    // Remove event listeners
    removeAllListeners: (channel) => {
        electron_1.ipcRenderer.removeAllListeners(channel);
    },
    // File System Storage APIs
    fileSystem: {
        // Reports
        saveReport: (report) => electron_1.ipcRenderer.invoke('filesystem:save-report', report),
        getReport: (id) => electron_1.ipcRenderer.invoke('filesystem:get-report', id),
        getAllReports: () => electron_1.ipcRenderer.invoke('filesystem:get-all-reports'),
        deleteReport: (id) => electron_1.ipcRenderer.invoke('filesystem:delete-report', id),
        // Report Logs
        saveReportLog: (log) => electron_1.ipcRenderer.invoke('filesystem:save-report-log', log),
        getReportLogs: (reportId) => electron_1.ipcRenderer.invoke('filesystem:get-report-logs', reportId),
        deleteReportLog: (id) => electron_1.ipcRenderer.invoke('filesystem:delete-report-log', id),
        // Checkpoints
        saveCheckpoint: (reportId, checkpoint) => electron_1.ipcRenderer.invoke('filesystem:save-checkpoint', reportId, checkpoint),
        getCheckpoint: (reportId) => electron_1.ipcRenderer.invoke('filesystem:get-checkpoint', reportId),
        deleteCheckpoint: (reportId) => electron_1.ipcRenderer.invoke('filesystem:delete-checkpoint', reportId),
        // Generation States
        saveGenerationState: (reportId, state) => electron_1.ipcRenderer.invoke('filesystem:save-generation-state', reportId, state),
        getGenerationState: (reportId) => electron_1.ipcRenderer.invoke('filesystem:get-generation-state', reportId),
        deleteGenerationState: (reportId) => electron_1.ipcRenderer.invoke('filesystem:delete-generation-state', reportId),
        // Utility
        getStorageSize: () => electron_1.ipcRenderer.invoke('filesystem:get-storage-size'),
        initialize: () => electron_1.ipcRenderer.invoke('filesystem:initialize'),
        cleanupOrphanedData: () => electron_1.ipcRenderer.invoke('filesystem:cleanup-orphaned-data'),
    },
    // Migration APIs
    migration: {
        checkLocalStorageData: () => electron_1.ipcRenderer.invoke('migration:check-localStorage-data'),
        extractLocalStorageData: () => electron_1.ipcRenderer.invoke('migration:extract-localStorage-data'),
        migrateFromLocalStorage: (data) => electron_1.ipcRenderer.invoke('migration:migrate-from-localStorage', data),
        clearLocalStorage: () => electron_1.ipcRenderer.invoke('migration:clear-localStorage'),
        hasCompletedMigration: () => electron_1.ipcRenderer.invoke('migration:has-completed-migration'),
        getMigrationHistory: () => electron_1.ipcRenderer.invoke('migration:get-migration-history'),
        getLastMigrationResult: () => electron_1.ipcRenderer.invoke('migration:get-last-migration-result'),
        validateMigrationData: (data) => electron_1.ipcRenderer.invoke('migration:validate-migration-data', data),
    },
    // Download APIs
    download: {
        downloadAllData: (options) => electron_1.ipcRenderer.invoke('download:all-data', options),
        getDownloadStats: (options) => electron_1.ipcRenderer.invoke('download:get-stats', options),
    }
});
//# sourceMappingURL=preload.js.map