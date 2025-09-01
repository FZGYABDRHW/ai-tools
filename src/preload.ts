// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Auto-updater APIs - temporarily disabled
  checkForUpdates: () => Promise.resolve({ updateInfo: null }),
  downloadUpdate: () => Promise.resolve({ updateInfo: null }),
  installUpdate: () => Promise.resolve(),
  getAppVersion: () => Promise.resolve('1.0.1'),
  
  // Auto-updater event listeners - temporarily disabled
  onAutoUpdaterStatus: (callback: (status: any) => void) => {
    // No-op for now
  },
  onAutoUpdaterShowUpdateDialog: (callback: (info: any) => void) => {
    // No-op for now
  },
  onAutoUpdaterShowInstallDialog: (callback: (info: any) => void) => {
    // No-op for now
  },
  
  // Remove event listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});
