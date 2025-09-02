import { autoUpdater } from 'electron-updater';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export class AutoUpdaterService {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    console.log('🚀 AutoUpdaterService: Constructor called');
    console.log('🚀 AutoUpdaterService: Setting up auto-updater...');
    
    try {
      this.setupAutoUpdater();
      console.log('🚀 AutoUpdaterService: Auto-updater setup completed');
      
      this.setupIpcHandlers();
      console.log('🚀 AutoUpdaterService: IPC handlers setup completed');
    } catch (error) {
      console.error('❌ AutoUpdaterService: Error in constructor:', error);
    }
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
    console.log('🔧 Setting feed URL...');
    console.log('🔧 Provider: github');
    console.log('🔧 Owner: FZGYABDRHW');
    console.log('🔧 Repo: ai-tools');
    
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'FZGYABDRHW',
      repo: 'ai-tools',
      updaterCacheDirName: 'ai-tools-updater',
    });
    
    console.log('🔧 Feed URL set successfully');
    console.log('🔧 Current feed URL:', autoUpdater.getFeedURL());
    console.log('🔧 Auto download enabled:', autoUpdater.autoDownload);
    console.log('🔧 Auto install on quit:', autoUpdater.autoInstallOnAppQuit);

    // Check for updates on startup (but don't notify automatically)
    // autoUpdater.checkForUpdatesAndNotify();
    
    // Enable automatic update checking on startup
    console.log('🔄 Enabling automatic update checking...');
    this.scheduleUpdateChecks();
    
    // Check for updates immediately on startup
    setTimeout(() => {
      console.log('🚀 Performing initial update check...');
      this.sendStatusToWindow('checking', 'Checking for updates on startup...');
      this.checkForUpdates();
    }, 5000); // Wait 5 seconds after startup

    // Auto-updater events
    autoUpdater.on('checking-for-update', () => {
      console.log('🔍 Checking for updates...');
      this.sendStatusToWindow('checking', 'Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('🎉 Update available:', info);
      // Ensure the info object is serializable
      const serializableInfo = this.makeSerializable(info);
      this.sendStatusToWindow('update-available', '🎉 New version available! Starting background download...', serializableInfo);
      this.showUpdateDialog(serializableInfo);
    });

    autoUpdater.on('update-not-available', (info) => {
      console.log('✅ No updates available:', info);
      const serializableInfo = this.makeSerializable(info);
      this.sendStatusToWindow('update-not-available', '✅ You have the latest version!', serializableInfo);
    });

    autoUpdater.on('error', (err) => {
      console.error('❌ Error in auto-updater:', err);
      const serializableError = this.makeSerializable(err);
      this.sendStatusToWindow('error', '❌ Error checking for updates.', serializableError);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      console.log('📥 Download progress:', progressObj);
      const serializableProgress = this.makeSerializable(progressObj);
      this.sendStatusToWindow('download-progress', '📥 Downloading update in background...', serializableProgress);
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('🎯 Update downloaded:', info);
      const serializableInfo = this.makeSerializable(info);
      this.sendStatusToWindow('update-downloaded', '🎯 Update ready! Click to install or it will install on quit.', serializableInfo);
      this.showInstallDialog(serializableInfo);
    });
  }

  // Schedule periodic update checks
  private scheduleUpdateChecks() {
    // Check for updates every 4 hours (4 * 60 * 60 * 1000 = 14,400,000 ms)
    const UPDATE_CHECK_INTERVAL = 4 * 60 * 60 * 1000;
    
    setInterval(() => {
      console.log('⏰ Scheduled update check...');
      this.checkForUpdates();
    }, UPDATE_CHECK_INTERVAL);
    
    console.log(`⏰ Scheduled update checks every ${UPDATE_CHECK_INTERVAL / (60 * 60 * 1000)} hours`);
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
      // Handle null and undefined
      if (obj === null || obj === undefined) {
        return obj;
      }
      
      // Handle primitive types
      if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return obj;
      }
      
      // Handle Date objects
      if (obj instanceof Date) {
        return obj.toISOString();
      }
      
      // Handle Error objects specially
      if (obj instanceof Error) {
        return {
          name: obj.name,
          message: obj.message,
          stack: obj.stack,
          type: 'Error'
        };
      }
      
      // Try to make the object serializable by converting to JSON and back
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.log('Object not serializable, creating safe copy:', error);
      console.log('Object type:', typeof obj);
      console.log('Object constructor:', obj?.constructor?.name);
      
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
            } else if (value instanceof Date) {
              safe[key] = value.toISOString();
            } else if (value instanceof Error) {
              safe[key] = {
                name: value.name,
                message: value.message,
                stack: value.stack,
                type: 'Error'
              };
            } else if (typeof value === 'object') {
              safe[key] = this.makeSerializable(value);
            } else {
              safe[key] = String(value);
            }
          } catch (e) {
            console.log(`Failed to serialize property ${key}:`, e);
            safe[key] = '[Non-serializable value]';
          }
        }
        return safe;
      }
      
      // Fallback for any other type
      return { 
        message: String(obj),
        type: typeof obj,
        constructor: obj?.constructor?.name || 'Unknown'
      };
    }
  }

  private setupIpcHandlers() {
    console.log('🔧 AutoUpdaterService: Setting up IPC handlers...');
    
    try {
      ipcMain.handle('auto-updater:check-for-updates', async () => {
      try {
        console.log('🔍 IPC: Manual check for updates requested');
        console.log('🔍 IPC: autoUpdater object:', !!autoUpdater);
        console.log('🔍 IPC: autoUpdater methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(autoUpdater)));
        
        // Check if autoUpdater is properly configured
        console.log('🔍 IPC: Current feed URL:', autoUpdater.getFeedURL());
        console.log('🔍 IPC: Current app version:', app.getVersion());
        
        const result = await autoUpdater.checkForUpdates();
        console.log('🔍 IPC: Raw checkForUpdates result:', result);
        // Make sure the result is serializable before returning
        const serializableResult = this.makeSerializable(result);
        console.log('🔍 IPC: Serializable result:', serializableResult);
        return serializableResult;
      } catch (error) {
        console.error('❌ IPC: Error checking for updates:', error);
        // Make sure the error is also serializable
        const serializableError = this.makeSerializable(error);
        throw serializableError;
      }
    });

    ipcMain.handle('auto-updater:download-update', async () => {
      try {
        console.log('Download update requested');
        const result = await autoUpdater.downloadUpdate();
        console.log('Raw downloadUpdate result:', result);
        // Make sure the result is serializable before returning
        const serializableResult = this.makeSerializable(result);
        console.log('Serializable result:', serializableResult);
        return serializableResult;
      } catch (error) {
        console.error('Error downloading update:', error);
        // Make sure the error is also serializable
        const serializableError = this.makeSerializable(error);
        throw serializableError;
      }
    });

    ipcMain.handle('auto-updater:install-update', () => {
      console.log('Install update requested');
      autoUpdater.quitAndInstall();
    });

    ipcMain.handle('auto-updater:get-app-version', () => {
      return app.getVersion();
    });

    ipcMain.handle('auto-updater:test-ipc', () => {
      console.log('🧪 Test IPC handler called successfully');
      return { success: true, message: 'IPC communication working', timestamp: new Date().toISOString() };
    });

    ipcMain.handle('auto-updater:force-check-for-updates', async () => {
      try {
        console.log('Force check for updates requested via IPC');
        const result = await this.forceCheckForUpdates();
        return result;
      } catch (error) {
        console.error('Error in force check for updates IPC:', error);
        const serializableError = this.makeSerializable(error);
        throw serializableError;
      }
    });

    ipcMain.handle('auto-updater:download-to-disk', async (event, updateInfo) => {
      try {
        console.log('Download to disk requested for:', updateInfo);
        const result = await this.downloadUpdateToDisk(updateInfo);
        return result;
      } catch (error) {
        console.error('Error downloading to disk:', error);
        const serializableError = this.makeSerializable(error);
        throw serializableError;
      }
    });
    
    console.log('🔧 AutoUpdaterService: IPC handlers registered successfully');
  } catch (error) {
    console.error('❌ AutoUpdaterService: Error setting up IPC handlers:', error);
  }
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
      console.log('🔍 Public: Manual update check requested...');
      console.log('🔍 Public: autoUpdater object:', !!autoUpdater);
      console.log('🔍 Public: autoUpdater methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(autoUpdater)));
      
      // Check if autoUpdater is properly configured
      console.log('🔍 Public: Current feed URL:', autoUpdater.getFeedURL());
      console.log('🔍 Public: Current app version:', app.getVersion());
      
      this.sendStatusToWindow('checking', '🔍 Checking for updates...');
      
      console.log('🔍 Public: About to call autoUpdater.checkForUpdates()...');
      const result = await autoUpdater.checkForUpdates();
      console.log('🔍 Public: Raw checkForUpdates result:', result);
      
      // Make sure the result is serializable before returning
      const serializableResult = this.makeSerializable(result);
      console.log('🔍 Public: Serializable result:', serializableResult);
      return serializableResult;
    } catch (error) {
      console.error('❌ Public: Error checking for updates:', error);
      const serializableError = this.makeSerializable(error);
      this.sendStatusToWindow('error', '❌ Failed to check for updates.', serializableError);
      
      // Try fallback method if auto-updater fails
      console.log('🔄 Public: Trying fallback GitHub API check...');
      try {
        const fallbackResult = await this.checkGitHubForUpdates();
        return fallbackResult;
      } catch (fallbackError) {
        console.error('❌ Public: Fallback also failed:', fallbackError);
        throw serializableError; // Throw original error
      }
    }
  }

  // Fallback method to check GitHub API directly
  private async checkGitHubForUpdates() {
    try {
      console.log('🔄 Fallback: Checking GitHub API for updates...');
      
      // Get current version
      const currentVersion = app.getVersion();
      console.log('🔄 Fallback: Current version:', currentVersion);
      
      // Check GitHub API for latest release
      const response = await fetch('https://api.github.com/repos/FZGYABDRHW/ai-tools/releases/latest');
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const release = await response.json();
      const latestVersion = release.tag_name.replace('v', '');
      console.log('🔄 Fallback: Latest version from GitHub:', latestVersion);
      
      // Compare versions
      if (latestVersion === currentVersion) {
        console.log('🔄 Fallback: No updates available');
        this.sendStatusToWindow('update-not-available', '✅ You have the latest version! (GitHub API)');
        return { updateAvailable: false, currentVersion, latestVersion };
      } else {
        console.log('🔄 Fallback: Update available!');
        this.sendStatusToWindow('update-available', `🎉 New version available: v${latestVersion}!`, {
          version: latestVersion,
          currentVersion,
          releaseNotes: release.body || 'No release notes available'
        });
        return { updateAvailable: true, currentVersion, latestVersion, releaseNotes: release.body };
      }
    } catch (error) {
      console.error('❌ Fallback: GitHub API check failed:', error);
      throw error;
    }
  }

  // Force check for updates (ignores cache)
  async forceCheckForUpdates() {
    try {
      console.log('🔄 Force: Force update check requested...');
      this.sendStatusToWindow('checking', '🔄 Force checking for updates...');
      
      const result = await autoUpdater.checkForUpdates();
      console.log('🔄 Force: Raw checkForUpdates result:', result);
      const serializableResult = this.makeSerializable(result);
      console.log('🔄 Force: Serializable result:', serializableResult);
      return serializableResult;
    } catch (error) {
      console.error('❌ Force: Error in force update check:', error);
      const serializableError = this.makeSerializable(error);
      this.sendStatusToWindow('error', '❌ Force update check failed.', serializableError);
      
      // Try fallback method if auto-updater fails
      console.log('🔄 Force: Trying fallback GitHub API check...');
      try {
        const fallbackResult = await this.checkGitHubForUpdates();
        return fallbackResult;
      } catch (fallbackError) {
        console.error('❌ Force: Fallback also failed:', fallbackError);
        throw serializableError; // Throw original error
      }
    }
  }

  async downloadUpdate() {
    try {
      console.log('Downloading update in background...');
      const result = await autoUpdater.downloadUpdate();
      console.log('Public downloadUpdate raw result:', result);
      const serializableResult = this.makeSerializable(result);
      console.log('Public downloadUpdate serializable result:', serializableResult);
      return serializableResult;
    } catch (error) {
      console.error('Error downloading update:', error);
      const serializableError = this.makeSerializable(error);
      throw serializableError;
    }
  }

  installUpdate() {
    console.log('Installing update...');
    autoUpdater.quitAndInstall();
  }

  getAppVersion(): string {
    return app.getVersion();
  }

  async downloadUpdateToDisk(updateInfo: any): Promise<any> {
    try {
      console.log('Downloading update to disk:', updateInfo);
      
      // Get the download URL from the update info
      const downloadUrl = `https://github.com/FZGYABDRHW/ai-tools/releases/download/v${updateInfo.version}/Wowworks.AI.Tools-darwin-arm64-${updateInfo.version}.zip`;
      console.log('Download URL:', downloadUrl);
      
      // Get the user's Downloads folder
      const downloadsPath = app.getPath('downloads');
      const fileName = `Wowworks-AI-Tools-${updateInfo.version}.zip`;
      const filePath = path.join(downloadsPath, fileName);
      
      console.log('Downloading to:', filePath);
      
      // Use electron-updater to download the file
      const result = await autoUpdater.downloadUpdate();
      
      // Return the download information
      return {
        success: true,
        message: `Update downloaded to Downloads folder: ${fileName}`,
        filePath: filePath,
        fileName: fileName,
        version: updateInfo.version,
        instructions: this.getUpdateInstructions(updateInfo.version)
      };
    } catch (error) {
      console.error('Failed to download to disk:', error);
      throw error;
    }
  }

  private getUpdateInstructions(version: string): string {
    return `📱 Manual Update Instructions for v${version}:

1️⃣ Download Complete ✅
   The update has been downloaded to your Downloads folder.

2️⃣ Quit Current App 🚪
   - Close Wowworks AI Tools completely
   - Make sure it's not running in the background

3️⃣ Replace Application 🔄
   - Go to Downloads folder
   - Find: Wowworks-AI-Tools-${version}.zip
   - Extract the ZIP file
   - Drag the new app to Applications folder
   - Replace the old version when prompted

4️⃣ Launch New Version 🚀
   - Open the new version from Applications
   - Verify the version shows v${version}
   - Your data will be preserved

💡 Tip: You can delete the old version from Applications after confirming the new one works.`;
  }
}

export const autoUpdaterService = new AutoUpdaterService();
