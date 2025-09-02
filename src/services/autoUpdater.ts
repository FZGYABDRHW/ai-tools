import { autoUpdater } from 'electron-updater';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

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
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    
    // Set the update server URL (GitHub releases)
    // Repository is now public, so no token needed
    console.log('Setting up Smart Automatic auto-updater for public repository');
    console.log('Current app version:', app.getVersion());
    console.log('App path:', app.getAppPath());
    console.log('App name:', app.getName());
    
    // Check if we're in development or production
    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
    console.log('Is development:', isDev);
    console.log('Is packaged:', app.isPackaged);
    
    // Log the expected app-update.yml path
    const expectedUpdatePath = path.join(app.getAppPath(), '..', 'app-update.yml');
    console.log('Expected app-update.yml path:', expectedUpdatePath);
    
    // Check if app-update.yml exists
    try {
      if (fs.existsSync(expectedUpdatePath)) {
        console.log('✅ app-update.yml found at:', expectedUpdatePath);
        const stats = fs.statSync(expectedUpdatePath);
        console.log('File size:', stats.size, 'bytes');
      } else {
        console.log('❌ app-update.yml NOT found at:', expectedUpdatePath);
        // List directory contents to debug
        const parentDir = path.dirname(expectedUpdatePath);
        if (fs.existsSync(parentDir)) {
          const files = fs.readdirSync(parentDir);
          console.log('Files in parent directory:', files);
        }
        
        // Try to create the app-update.yml file manually
        this.createAppUpdateYml(expectedUpdatePath);
      }
    } catch (error) {
      console.log('Error checking app-update.yml:', error);
    }
    
    // Set the feed URL with explicit configuration
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'FZGYABDRHW',
      repo: 'ai-tools',
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
      // Ensure the info object is serializable
      const serializableInfo = this.makeSerializable(info);
      this.sendStatusToWindow('update-available', 'Update available! Starting background download...', serializableInfo);
      this.showUpdateDialog(serializableInfo);
    });

    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available:', info);
      const serializableInfo = this.makeSerializable(info);
      this.sendStatusToWindow('update-not-available', 'No updates available.', serializableInfo);
    });

    autoUpdater.on('error', (err) => {
      console.error('Error in auto-updater:', err);
      const serializableError = this.makeSerializable(err);
      this.sendStatusToWindow('error', 'Error checking for updates.', serializableError);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      console.log('Download progress:', progressObj);
      const serializableProgress = this.makeSerializable(progressObj);
      this.sendStatusToWindow('download-progress', 'Downloading update in background...', serializableProgress);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded:', info);
      const serializableInfo = this.makeSerializable(info);
      this.sendStatusToWindow('update-downloaded', 'Update ready! Click to install or it will install on quit.', serializableInfo);
      this.showInstallDialog(serializableInfo);
    });
  }

  private createAppUpdateYml(filePath: string) {
    try {
      const appUpdateContent = {
        provider: 'github',
        owner: 'FZGYABDRHW',
        repo: 'ai-tools',
        updaterCacheDirName: 'ai-tools-updater',
        publishAutoUpdate: true,
        publish: [{
          provider: 'github',
          owner: 'FZGYABDRHW',
          repo: 'ai-tools'
        }]
      };
      
      const yamlContent = `# Auto-generated app-update.yml
provider: github
owner: FZGYABDRHW
repo: ai-tools
updaterCacheDirName: ai-tools-updater
publishAutoUpdate: true
publish:
  - provider: github
    owner: FZGYABDRHW
    repo: ai-tools
`;
      
      fs.writeFileSync(filePath, yamlContent, 'utf8');
      console.log('✅ Created app-update.yml at:', filePath);
    } catch (error) {
      console.error('❌ Failed to create app-update.yml:', error);
    }
  }

  private makeSerializable(obj: any): any {
    try {
      // Try to make the object serializable by converting to JSON and back
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.log('Object not serializable, creating safe copy:', error);
      // If JSON serialization fails, create a safe copy with basic properties
      if (obj && typeof obj === 'object') {
        const safe: any = {};
        for (const key in obj) {
          try {
            const value = obj[key];
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
              safe[key] = value;
            } else if (value === null || value === undefined) {
              safe[key] = value;
            } else if (typeof value === 'object') {
              safe[key] = this.makeSerializable(value);
            }
          } catch (e) {
            safe[key] = '[Non-serializable value]';
          }
        }
        return safe;
      }
      return { message: String(obj) };
    }
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
      console.log('Downloading update in background...');
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
