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
    ipcMain.handle('auto-updater:check-for-updates', async () => {
      try {
        console.log('Manual check for updates requested');
        const result = await autoUpdater.checkForUpdates();
        console.log('Raw checkForUpdates result:', result);
        // Make sure the result is serializable before returning
        const serializableResult = this.makeSerializable(result);
        console.log('Serializable result:', serializableResult);
        return serializableResult;
      } catch (error) {
        console.error('Error checking for updates:', error);
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

    ipcMain.handle('auto-updater:test-ipc', () => {
      console.log('Test IPC handler called successfully');
      return { success: true, message: 'IPC communication working', timestamp: new Date().toISOString() };
    });

    ipcMain.handle('auto-updater:download-latest-version', async () => {
      try {
        console.log('Download latest version requested via IPC');
        const result = await this.downloadLatestVersion();
        return result;
      } catch (error) {
        console.error('Error in download latest version IPC:', error);
        const serializableError = this.makeSerializable(error);
        throw serializableError;
      }
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
      const result = await autoUpdater.checkForUpdates();
      console.log('Public checkForUpdates raw result:', result);
      const serializableResult = this.makeSerializable(result);
      console.log('Public checkForUpdates serializable result:', serializableResult);
      return serializableResult;
    } catch (error) {
      console.error('Error checking for updates:', error);
      const serializableError = this.makeSerializable(error);
      throw serializableError;
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

  async forceCheckForUpdates() {
    try {
      console.log('Force update check requested...');
      this.sendStatusToWindow('checking', 'Force checking for updates...');
      const result = await autoUpdater.checkForUpdates();
      console.log('Force check result:', result);
      const serializableResult = this.makeSerializable(result);
      return serializableResult;
    } catch (error) {
      console.error('Error in force update check:', error);
      const serializableError = this.makeSerializable(error);
      this.sendStatusToWindow('error', 'Force update check failed.', serializableError);
      throw serializableError;
    }
  }

  async downloadLatestVersion() {
    try {
      console.log('Downloading latest version...');
      this.sendStatusToWindow('checking', 'Checking for latest version...');
      
      // Get current version
      const currentVersion = app.getVersion();
      console.log('Current version:', currentVersion);
      
      // Check GitHub API for latest release
      const response = await fetch('https://api.github.com/repos/FZGYABDRHW/ai-tools/releases/latest');
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const release = await response.json();
      const latestVersion = release.tag_name.replace('v', '');
      console.log('Latest version from GitHub:', latestVersion);
      
      // Compare versions
      if (latestVersion === currentVersion) {
        console.log('Already have latest version');
        this.sendStatusToWindow('update-not-available', 'You already have the latest version!');
        return { 
          updateAvailable: false, 
          currentVersion, 
          latestVersion,
          message: 'You already have the latest version!'
        };
      }
      
      // Download the latest version
      console.log('Downloading latest version:', latestVersion);
      this.sendStatusToWindow('download-progress', 'Downloading latest version...');
      
      // Create download info
      const downloadInfo = {
        version: latestVersion,
        releaseDate: release.published_at,
        releaseNotes: release.body || 'No release notes available',
        files: [
          {
            url: `https://github.com/FZGYABDRHW/ai-tools/releases/download/v${latestVersion}/Wowworks.AI.Tools-darwin-arm64-${latestVersion}.zip`,
            size: 0, // Will be updated after download
            sha512: ''
          }
        ]
      };
      
      // Download to disk
      const result = await this.downloadUpdateToDisk(downloadInfo);
      
      this.sendStatusToWindow('update-downloaded', 'Latest version downloaded successfully!', result);
      return {
        updateAvailable: true,
        currentVersion,
        latestVersion,
        downloadResult: result,
        message: 'Latest version downloaded successfully!'
      };
      
    } catch (error) {
      console.error('Error downloading latest version:', error);
      const serializableError = this.makeSerializable(error);
      this.sendStatusToWindow('error', 'Failed to download latest version.', serializableError);
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

  // Helper method to format file sizes
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Helper method to validate Downloads folder access
  private async validateDownloadsAccess(): Promise<void> {
    try {
      const downloadsPath = app.getPath('downloads');
      
      // Check if Downloads folder exists
      if (!fs.existsSync(downloadsPath)) {
        throw new Error('Downloads folder not found');
      }
      
      // Check write permissions by creating a test file
      const testFile = path.join(downloadsPath, '.wowworks-test-write');
      await fs.promises.writeFile(testFile, 'test');
      await fs.promises.unlink(testFile);
      
      console.log('✅ Downloads folder access verified:', downloadsPath);
    } catch (error) {
      console.error('❌ Downloads folder access failed:', error);
      throw new Error('Cannot write to Downloads folder. Please check permissions.');
    }
  }

  // Helper method to check available disk space
  private async checkDiskSpace(requiredBytes: number): Promise<void> {
    try {
      const downloadsPath = app.getPath('downloads');
      const stats = fs.statSync(downloadsPath);
      
      // Note: This is a basic check. For more accurate disk space checking,
      // we'd need a native module, but this provides basic validation
      console.log('💾 Checking disk space for download...');
      console.log('   Required:', this.formatFileSize(requiredBytes));
      
      // Basic validation - if we can't write a small test file, we probably don't have space
      await this.validateDownloadsAccess();
      
    } catch (error) {
      console.error('❌ Disk space check failed:', error);
      throw new Error('Insufficient disk space or permission denied');
    }
  }

  async downloadUpdateToDisk(updateInfo: any): Promise<any> {
    let downloadStartTime = Date.now();
    
    try {
      console.log('🔽 Starting download to disk:', updateInfo);
      
      // 1. Validate Downloads folder access first
      await this.validateDownloadsAccess();
      
      // 2. Build download URL
      const downloadUrl = `https://github.com/FZGYABDRHW/ai-tools/releases/download/v${updateInfo.version}/Wowworks.AI.Tools-darwin-arm64-${updateInfo.version}.zip`;
      console.log('🔗 Download URL:', downloadUrl);
      
      // 3. Setup file paths
      const downloadsPath = app.getPath('downloads');
      const fileName = `Wowworks-AI.Tools-${updateInfo.version}.zip`;
      const filePath = path.join(downloadsPath, fileName);
      
      console.log('📁 Target file path:', filePath);
      console.log('📁 Downloads folder:', downloadsPath);
      
      // 4. Check if file already exists
      if (fs.existsSync(filePath)) {
        console.log('📄 File already exists, removing old version...');
        fs.unlinkSync(filePath);
      }
      
      // 5. Send progress update
      this.sendStatusToWindow('download-progress', `Starting download of ${fileName}...`, {
        percent: 0,
        transferred: 0,
        total: 0
      });
      
      // 6. Download file with progress tracking
      console.log('🌐 Fetching file from GitHub...');
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      console.log('📊 File size:', this.formatFileSize(contentLength));
      
      // 7. Check disk space before downloading
      if (contentLength > 0) {
        await this.checkDiskSpace(contentLength);
      }
      
      // 8. Read response as stream and write to file
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }
      
      let downloadedBytes = 0;
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        if (value) {
          chunks.push(value);
          downloadedBytes += value.length;
          
          // Send progress update
          const percent = contentLength > 0 ? (downloadedBytes / contentLength) * 100 : 0;
          this.sendStatusToWindow('download-progress', `Downloading ${fileName}...`, {
            percent: Math.round(percent),
            transferred: downloadedBytes,
            total: contentLength,
            bytesPerSecond: downloadedBytes / ((Date.now() - downloadStartTime) / 1000),
            formattedTransferred: this.formatFileSize(downloadedBytes),
            formattedTotal: this.formatFileSize(contentLength)
          });
          
          console.log(`📥 Progress: ${Math.round(percent)}% (${this.formatFileSize(downloadedBytes)}/${this.formatFileSize(contentLength)})`);
        }
      }
      
      // 9. Combine chunks and write to file
      console.log('💾 Writing file to disk...');
      const fileBuffer = Buffer.concat(chunks);
      await fs.promises.writeFile(filePath, fileBuffer);
      
      // 10. Verify file was written correctly
      const stats = fs.statSync(filePath);
      console.log('✅ File written successfully:');
      console.log('   - Size:', this.formatFileSize(stats.size));
      console.log('   - Path:', filePath);
      console.log('   - Download time:', ((Date.now() - downloadStartTime) / 1000).toFixed(2), 'seconds');
      
      // 11. Verify file size matches
      if (contentLength > 0 && stats.size !== contentLength) {
        throw new Error(`File size mismatch: expected ${this.formatFileSize(contentLength)}, got ${this.formatFileSize(stats.size)}`);
      }
      
      // 12. Send completion status
      this.sendStatusToWindow('download-complete', `Download complete: ${fileName}`, {
        filePath,
        fileName,
        fileSize: stats.size,
        formattedFileSize: this.formatFileSize(stats.size),
        version: updateInfo.version,
        downloadTime: ((Date.now() - downloadStartTime) / 1000).toFixed(2) + 's'
      });
      
      // 13. Return success result
      return {
        success: true,
        message: `Update v${updateInfo.version} downloaded successfully to Downloads folder`,
        filePath: filePath,
        fileName: fileName,
        version: updateInfo.version,
        fileSize: stats.size,
        formattedFileSize: this.formatFileSize(stats.size),
        downloadTime: ((Date.now() - downloadStartTime) / 1000).toFixed(2) + 's',
        instructions: this.getUpdateInstructions(updateInfo.version)
      };
      
    } catch (error) {
      console.error('❌ Download to disk failed:', error);
      
      // Send error status
      this.sendStatusToWindow('download-error', 'Download failed', {
        error: error.message,
        version: updateInfo?.version
      });
      
      throw error;
    }
  }

  // Method to cancel ongoing downloads
  private cancelDownload(): void {
    console.log('🛑 Download cancellation requested');
    // Note: In a more advanced implementation, we could store the AbortController
    // and use it to actually cancel the fetch request
    this.sendStatusToWindow('download-cancelled', 'Download was cancelled');
  }

  // Method to cleanup downloaded files (for testing/debugging)
  async cleanupDownloadedFile(version: string): Promise<void> {
    try {
      const downloadsPath = app.getPath('downloads');
      const fileName = `Wowworks-AI.Tools-${version}.zip`;
      const filePath = path.join(downloadsPath, fileName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🧹 Cleaned up downloaded file:', fileName);
      } else {
        console.log('📄 No file to clean up:', fileName);
      }
    } catch (error) {
      console.error('❌ Failed to cleanup file:', error);
    }
  }

  // Method to get download status and statistics
  getDownloadStats(): any {
    return {
      downloadsPath: app.getPath('downloads'),
      availableSpace: 'Unknown', // Would need native module for accurate disk space
      lastDownload: 'Not available', // Could be stored in persistent storage
      totalDownloads: 0 // Could be tracked in persistent storage
    };
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
   - Find: Wowworks-AI.Tools-${version}.zip
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
