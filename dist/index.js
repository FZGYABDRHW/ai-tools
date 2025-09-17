"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const autoUpdater_1 = require("./services/autoUpdater");
const FileSystemService_1 = require("./database/fileSystem/FileSystemService");
const MigrationService_1 = require("./database/fileSystem/MigrationService");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const archiver_1 = __importDefault(require("archiver"));
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    electron_1.app.quit();
}
// Disable CORS and security restrictions for development
electron_1.app.commandLine.appendSwitch("disable-web-security");
electron_1.app.commandLine.appendSwitch("disable-features", "VizDisplayCompositor");
electron_1.app.commandLine.appendSwitch("disable-site-isolation-trials");
// Disable sandbox/GPU for containerized environments
electron_1.app.commandLine.appendSwitch("no-sandbox");
electron_1.app.commandLine.appendSwitch("disable-gpu-sandbox");
electron_1.app.commandLine.appendSwitch("no-zygote");
electron_1.app.disableHardwareAcceleration();
electron_1.protocol.registerSchemesAsPrivileged([
    {
        scheme: "http",
        privileges: {
            standard: true,
            bypassCSP: true,
            allowServiceWorkers: true,
            supportFetchAPI: true,
            corsEnabled: false,
            stream: true,
        },
    },
    {
        scheme: "https",
        privileges: {
            standard: true,
            bypassCSP: true,
            allowServiceWorkers: true,
            supportFetchAPI: true,
            corsEnabled: false,
            stream: true,
        },
    },
    { scheme: "mailto", privileges: { standard: true } },
]);
const createWindow = () => {
    // Create the browser window.
    const mainWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: false, // Disable for security
            contextIsolation: true, // Enable for security
            additionalArguments: [
                `--csp-string=default-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.wowworks.org https://*.wowworks.ru http://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval';`,
            ],
            webSecurity: false, // Disable CORS for development
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });
    // Set the main window for auto-updater
    autoUpdater_1.autoUpdaterService.setMainWindow(mainWindow);
    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // DevTools enabled for debugging
    mainWindow.webContents.openDevTools(); // Enabled for debugging
};
// Settings IPC handlers
function setupSettingsHandlers() {
    const settingsPath = path.join(electron_1.app.getPath("userData"), "settings.json");
    // Load settings from file
    electron_1.ipcMain.handle("settings:load", async () => {
        try {
            if (fs.existsSync(settingsPath)) {
                const data = fs.readFileSync(settingsPath, "utf8");
                return JSON.parse(data);
            }
            return null;
        }
        catch (error) {
            console.error("Failed to load settings:", error);
            return null;
        }
    });
    // Save settings to file
    electron_1.ipcMain.handle("settings:save", async (_, settings) => {
        try {
            // Ensure the directory exists
            const dir = path.dirname(settingsPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            // Write settings to file
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
            return true;
        }
        catch (error) {
            console.error("Failed to save settings:", error);
            throw error;
        }
    });
}
// File System IPC handlers
function setupFileSystemHandlers() {
    let fileSystemInitialized = false;
    async function initializeFileSystem() {
        if (!fileSystemInitialized) {
            await FileSystemService_1.fileSystemService.initialize();
            fileSystemInitialized = true;
        }
    }
    // File System handlers
    electron_1.ipcMain.handle('filesystem:initialize', async () => {
        await initializeFileSystem();
        return { success: true };
    });
    electron_1.ipcMain.handle('filesystem:save-report', async (event, report) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.saveReport(report);
    });
    electron_1.ipcMain.handle('filesystem:get-report', async (event, id) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.getReport(id);
    });
    electron_1.ipcMain.handle('filesystem:get-all-reports', async () => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.getAllReports();
    });
    electron_1.ipcMain.handle('filesystem:delete-report', async (event, id) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.deleteReport(id);
    });
    electron_1.ipcMain.handle('filesystem:save-report-log', async (event, log) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.saveReportLog(log);
    });
    electron_1.ipcMain.handle('filesystem:get-report-logs', async (event, reportId) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.getReportLogs(reportId);
    });
    electron_1.ipcMain.handle('filesystem:delete-report-log', async (event, id) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.deleteReportLog(id);
    });
    electron_1.ipcMain.handle('filesystem:save-checkpoint', async (event, reportId, checkpoint) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.saveCheckpoint(reportId, checkpoint);
    });
    electron_1.ipcMain.handle('filesystem:get-checkpoint', async (event, reportId) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.getCheckpoint(reportId);
    });
    electron_1.ipcMain.handle('filesystem:delete-checkpoint', async (event, reportId) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.deleteCheckpoint(reportId);
    });
    electron_1.ipcMain.handle('filesystem:save-generation-state', async (event, reportId, state) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.saveGenerationState(reportId, state);
    });
    electron_1.ipcMain.handle('filesystem:get-generation-state', async (event, reportId) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.getGenerationState(reportId);
    });
    electron_1.ipcMain.handle('filesystem:delete-generation-state', async (event, reportId) => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.deleteGenerationState(reportId);
    });
    electron_1.ipcMain.handle('filesystem:get-storage-size', async () => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.getStorageSize();
    });
    electron_1.ipcMain.handle('filesystem:cleanup-orphaned-data', async () => {
        await initializeFileSystem();
        return await FileSystemService_1.fileSystemService.cleanupOrphanedData();
    });
}
// Migration IPC handlers
function setupMigrationHandlers() {
    let fileSystemInitialized = false;
    async function initializeFileSystem() {
        if (!fileSystemInitialized) {
            await FileSystemService_1.fileSystemService.initialize();
            fileSystemInitialized = true;
        }
    }
    electron_1.ipcMain.handle('migration:check-localStorage-data', async () => {
        // This should be called from renderer process only
        return false;
    });
    electron_1.ipcMain.handle('migration:extract-localStorage-data', async () => {
        // This should be called from renderer process only
        return null;
    });
    electron_1.ipcMain.handle('migration:migrate-from-localStorage', async (event, data) => {
        await initializeFileSystem();
        return await MigrationService_1.migrationService.migrateFromLocalStorage(data);
    });
    electron_1.ipcMain.handle('migration:clear-localStorage', async () => {
        // This should be called from renderer process only
        return false;
    });
    electron_1.ipcMain.handle('migration:has-completed-migration', async () => {
        await initializeFileSystem();
        return await MigrationService_1.migrationService.hasCompletedMigration();
    });
    electron_1.ipcMain.handle('migration:get-migration-history', async () => {
        await initializeFileSystem();
        return await MigrationService_1.migrationService.getMigrationHistory();
    });
    electron_1.ipcMain.handle('migration:get-last-migration-result', async () => {
        await initializeFileSystem();
        return await MigrationService_1.migrationService.getLastMigrationResult();
    });
    electron_1.ipcMain.handle('migration:validate-migration-data', async (event, data) => {
        await initializeFileSystem();
        return await MigrationService_1.migrationService.validateMigrationData(data);
    });
}
function setupDownloadHandlers() {
    // Download handlers
    electron_1.ipcMain.handle('download:all-data', async (event, options) => {
        try {
            const mainWindow = electron_1.BrowserWindow.fromWebContents(event.sender);
            if (!mainWindow) {
                throw new Error('Main window not found');
            }
            // Show save dialog
            const result = await electron_1.dialog.showSaveDialog(mainWindow, {
                title: 'Download All Data',
                defaultPath: `wowworks-ai-tools-backup-${new Date().toISOString().split('T')[0]}.zip`,
                filters: [
                    { name: 'ZIP Files', extensions: ['zip'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            if (result.canceled || !result.filePath) {
                return { success: false, error: 'Download cancelled' };
            }
            const output = fs.createWriteStream(result.filePath);
            const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
            return new Promise((resolve) => {
                output.on('close', () => {
                    const stats = fs.statSync(result.filePath);
                    resolve({
                        success: true,
                        filePath: result.filePath,
                        fileCount: archive.pointer(),
                        totalSize: stats.size
                    });
                });
                archive.on('error', (err) => {
                    console.error('Archive error:', err);
                    resolve({ success: false, error: err.message });
                });
                archive.pipe(output);
                // Add data directories based on options
                const userDataPath = electron_1.app.getPath('userData');
                const dataPath = path.join(userDataPath, 'wowworks-ai-tools');
                if (options.includeReports && fs.existsSync(path.join(dataPath, 'data', 'reports'))) {
                    archive.directory(path.join(dataPath, 'data', 'reports'), 'reports');
                }
                if (options.includeLogs && fs.existsSync(path.join(dataPath, 'data', 'logs'))) {
                    archive.directory(path.join(dataPath, 'data', 'logs'), 'logs');
                }
                if (options.includeCheckpoints && fs.existsSync(path.join(dataPath, 'data', 'checkpoints'))) {
                    archive.directory(path.join(dataPath, 'data', 'checkpoints'), 'checkpoints');
                }
                if (options.includeGenerationStates && fs.existsSync(path.join(dataPath, 'data', 'generationStates'))) {
                    archive.directory(path.join(dataPath, 'data', 'generationStates'), 'generationStates');
                }
                if (options.includeBackups && fs.existsSync(path.join(dataPath, 'backups'))) {
                    archive.directory(path.join(dataPath, 'backups'), 'backups');
                }
                // Add migration history
                if (fs.existsSync(path.join(dataPath, 'migrations'))) {
                    archive.directory(path.join(dataPath, 'migrations'), 'migrations');
                }
                archive.finalize();
            });
        }
        catch (error) {
            console.error('Download error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    });
    electron_1.ipcMain.handle('download:get-stats', async (event, options) => {
        try {
            const userDataPath = electron_1.app.getPath('userData');
            const dataPath = path.join(userDataPath, 'wowworks-ai-tools');
            let fileCount = 0;
            let totalSize = 0;
            const countFiles = (dirPath) => {
                if (!fs.existsSync(dirPath))
                    return;
                const items = fs.readdirSync(dirPath);
                for (const item of items) {
                    const itemPath = path.join(dirPath, item);
                    const stats = fs.statSync(itemPath);
                    if (stats.isDirectory()) {
                        countFiles(itemPath);
                    }
                    else {
                        fileCount++;
                        totalSize += stats.size;
                    }
                }
            };
            if (options.includeReports) {
                countFiles(path.join(dataPath, 'data', 'reports'));
            }
            if (options.includeLogs) {
                countFiles(path.join(dataPath, 'data', 'logs'));
            }
            if (options.includeCheckpoints) {
                countFiles(path.join(dataPath, 'data', 'checkpoints'));
            }
            if (options.includeGenerationStates) {
                countFiles(path.join(dataPath, 'data', 'generationStates'));
            }
            if (options.includeBackups) {
                countFiles(path.join(dataPath, 'backups'));
            }
            countFiles(path.join(dataPath, 'migrations'));
            return { fileCount, totalSize };
        }
        catch (error) {
            console.error('Error getting download stats:', error);
            return { fileCount: 0, totalSize: 0 };
        }
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on("ready", () => {
    createWindow();
    setupSettingsHandlers();
    setupFileSystemHandlers();
    setupMigrationHandlers();
    setupDownloadHandlers();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
//# sourceMappingURL=index.js.map