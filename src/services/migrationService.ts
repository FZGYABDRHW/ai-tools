class RendererMigrationService {
  private readonly STORAGE_KEYS = [
    'ai_tools_reports',
    'wowworks_report_checkpoints',
    'wowworks_report_logs',
    'wowworks_report_generations'
  ];

  async checkLocalStorageData(): Promise<boolean> {
    return this.STORAGE_KEYS.some(key => {
      const data = localStorage.getItem(key);
      return data !== null && data !== '[]' && data !== '{}';
    });
  }

  async extractLocalStorageData(): Promise<{
    reports: any[];
    checkpoints: any;
    reportLogs: any[];
    generationStates: any;
    metadata: {
      extractedAt: string;
      totalSize: number;
      keys: string[];
    };
  }> {
    const data = {
      reports: this.getLocalStorageData('ai_tools_reports', []),
      checkpoints: this.getLocalStorageData('wowworks_report_checkpoints', {}),
      reportLogs: this.getLocalStorageData('wowworks_report_logs', []),
      generationStates: this.getLocalStorageData('wowworks_report_generations', {}),
      metadata: {
        extractedAt: new Date().toISOString(),
        totalSize: 0,
        keys: []
      }
    };

    // Calculate total size
    data.metadata.totalSize = JSON.stringify(data).length;
    data.metadata.keys = this.STORAGE_KEYS.filter(key => localStorage.getItem(key) !== null);

    return data;
  }

  private getLocalStorageData(key: string, defaultValue: any): any {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;

      const parsed = JSON.parse(data);
      return parsed || defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage data for ${key}:`, error);
      return defaultValue;
    }
  }

  async clearLocalStorage(): Promise<boolean> {
    try {
      this.STORAGE_KEYS.forEach(key => {
        localStorage.removeItem(key);
      });

      // Also clear other localStorage keys used by the app
      const otherKeys = ['authToken', 'userId', 'selectedServer', 'taskId', 'customOperationalReport'];
      otherKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      console.log('localStorage cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  async getLocalStorageSize(): Promise<number> {
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    }

    return totalSize;
  }

  async getLocalStorageUsage(): Promise<{
    totalSize: number;
    keyCount: number;
    keys: { key: string; size: number }[];
  }> {
    const keys: { key: string; size: number }[] = [];
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          const size = key.length + value.length;
          keys.push({ key, size });
          totalSize += size;
        }
      }
    }

    return {
      totalSize,
      keyCount: keys.length,
      keys: keys.sort((a, b) => b.size - a.size)
    };
  }

  async validateLocalStorageData(): Promise<{
    isValid: boolean;
    issues: string[];
    dataSummary: {
      reports: number;
      logs: number;
      checkpoints: number;
      generationStates: number;
      totalSize: number;
    };
  }> {
    const issues: string[] = [];
    let isValid = true;

    const dataSummary = {
      reports: 0,
      logs: 0,
      checkpoints: 0,
      generationStates: 0,
      totalSize: 0
    };

    try {
      // Validate reports
      const reportsData = this.getLocalStorageData('ai_tools_reports', []);
      if (Array.isArray(reportsData)) {
        dataSummary.reports = reportsData.length;
        for (const report of reportsData) {
          if (!report.id || !report.name) {
            issues.push(`Report missing required fields: ${JSON.stringify(report)}`);
            isValid = false;
          }
        }
      } else {
        issues.push('Reports data is not an array');
        isValid = false;
      }

      // Validate logs
      const logsData = this.getLocalStorageData('wowworks_report_logs', []);
      if (Array.isArray(logsData)) {
        dataSummary.logs = logsData.length;
        for (const log of logsData) {
          if (!log.id || !log.reportId) {
            issues.push(`Log missing required fields: ${JSON.stringify(log)}`);
            isValid = false;
          }
        }
      } else {
        issues.push('Report logs data is not an array');
        isValid = false;
      }

      // Validate checkpoints
      const checkpointsData = this.getLocalStorageData('wowworks_report_checkpoints', {});
      if (typeof checkpointsData === 'object') {
        dataSummary.checkpoints = Object.keys(checkpointsData).length;
      } else {
        issues.push('Checkpoints data is not an object');
        isValid = false;
      }

      // Validate generation states
      const statesData = this.getLocalStorageData('wowworks_report_generations', {});
      if (typeof statesData === 'object') {
        dataSummary.generationStates = Object.keys(statesData).length;
      } else {
        issues.push('Generation states data is not an object');
        isValid = false;
      }

      // Calculate total size
      const allData = {
        reports: reportsData,
        checkpoints: checkpointsData,
        reportLogs: logsData,
        generationStates: statesData
      };
      dataSummary.totalSize = JSON.stringify(allData).length;

    } catch (error: any) {
      issues.push(`Validation error: ${error.message}`);
      isValid = false;
    }

    return {
      isValid,
      issues,
      dataSummary
    };
  }

  async getStorageKeysInfo(): Promise<{
    appKeys: { key: string; size: number; hasData: boolean }[];
    otherKeys: { key: string; size: number }[];
    totalAppSize: number;
    totalOtherSize: number;
  }> {
    const appKeys: { key: string; size: number; hasData: boolean }[] = [];
    const otherKeys: { key: string; size: number }[] = [];
    let totalAppSize = 0;
    let totalOtherSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          const size = key.length + value.length;
          const hasData = value !== '[]' && value !== '{}' && value !== 'null';

          if (this.STORAGE_KEYS.includes(key)) {
            appKeys.push({ key, size, hasData });
            totalAppSize += size;
          } else {
            otherKeys.push({ key, size });
            totalOtherSize += size;
          }
        }
      }
    }

    return {
      appKeys: appKeys.sort((a, b) => b.size - a.size),
      otherKeys: otherKeys.sort((a, b) => b.size - a.size),
      totalAppSize,
      totalOtherSize
    };
  }
}

export const rendererMigrationService = new RendererMigrationService();
