import { autoUpdater } from 'electron-updater';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

export class AutoUpdaterService {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.setupAutoUpdater();
    this.setupIpcHandlers();
  }

  setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
  }

  private setupAutoUpdater() {
    // Configure auto-updater
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    
    // Set the update server URL (GitHub releases)
    // Repository is now public, so no token needed
    console.log('Setting up auto-updater for public repository');
    console.log('Current app version:', app.getVersion());
    
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'FZGYABDRHW',
      repo: 'ai-tools',
      // Add explicit version to help with debugging
      updaterCacheDirName: 'ai-tools-updater',
    });

    // Check for updates on startup (but don't notify automatically)
    // autoUpdater.checkForUpdatesAndNotify();

    // Auto-updater events
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...');
      this.sendStatusToWindow('checking', 'Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info);
      this.sendStatusToWindow('update-available', 'Update available!', info);
      this.showUpdateDialog(info);
    });

    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available:', info);
      this.sendStatusToWindow('update-not-available', 'No updates available.', info);
    });

    autoUpdater.on('error', (err) => {
      console.error('Error in auto-updater:', err);
      this.sendStatusToWindow('error', 'Error checking for updates.', err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      console.log('Download progress:', progressObj);
      this.sendStatusToWindow('download-progress', 'Downloading update...', progressObj);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded:', info);
      this.sendStatusToWindow('update-downloaded', 'Update downloaded! Will install on restart.', info);
      this.showInstallDialog(info);
    });
  }

  private setupIpcHandlers() {
    ipcMain.handle('auto-updater:check-for-updates', async () => {
      try {
        console.log('Manual check for updates requested');
        const result = await autoUpdater.checkForUpdates();
        return result;
      } catch (error) {
        console.error('Error checking for updates:', error);
        throw error;
      }
    });

    ipcMain.handle('auto-updater:download-update', async () => {
      try {
        console.log('Download update requested');
        return await autoUpdater.downloadUpdate();
      } catch (error) {
        console.error('Error downloading update:', error);
        throw error;
      }
    });

    ipcMain.handle('auto-updater:install-update', () => {
      console.log('Install update requested');
      autoUpdater.quitAndInstall();
    });

    ipcMain.handle('auto-updater:get-app-version', () => {
      return app.getVersion();
    });
  }

  private sendStatusToWindow(status: string, message: string, data?: any) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('auto-updater:status', { 
        status, 
        message, 
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  private showUpdateDialog(info: any) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('auto-updater:show-update-dialog', info);
    }
  }

  private showInstallDialog(info: any) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('auto-updater:show-install-dialog', info);
    }
  }

  // Public methods for manual update checks
  async checkForUpdates() {
    try {
      console.log('Checking for updates...');
      return await autoUpdater.checkForUpdates();
    } catch (error) {
      console.error('Error checking for updates:', error);
      throw error;
    }
  }

  async downloadUpdate() {
    try {
      console.log('Downloading update...');
      return await autoUpdater.downloadUpdate();
    } catch (error) {
      console.error('Error downloading update:', error);
      throw error;
    }
  }

  installUpdate() {
    console.log('Installing update...');
    autoUpdater.quitAndInstall();
  }

  getAppVersion(): string {
    return app.getVersion();
  }
}

export const autoUpdaterService = new AutoUpdaterService();
