declare global {
  interface Window {
    electronAPI: {
      // Auto-updater APIs
      checkForUpdates: () => Promise<any>;
      forceCheckForUpdates: () => Promise<any>;
      downloadUpdate: () => Promise<any>;
      downloadToDisk: (updateInfo: any) => Promise<any>;

      installUpdate: () => Promise<void>;
      getAppVersion: () => Promise<string>;
      testIpc: () => Promise<any>;
      
      // Auto-updater event listeners
      onAutoUpdaterStatus: (callback: (status: any) => void) => void;
      onAutoUpdaterShowUpdateDialog: (callback: (info: any) => void) => void;
      onAutoUpdaterShowInstallDialog: (callback: (info: any) => void) => void;
      
      // Remove event listeners
      removeAllListeners: (channel: string) => void;
    };
  }
}

export {};
