// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Auto-updater APIs
  checkForUpdates: () => ipcRenderer.invoke('auto-updater:check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('auto-updater:download-update'),
  installUpdate: () => ipcRenderer.invoke('auto-updater:install-update'),
  getAppVersion: () => ipcRenderer.invoke('auto-updater:get-app-version'),
  
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
