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
});
