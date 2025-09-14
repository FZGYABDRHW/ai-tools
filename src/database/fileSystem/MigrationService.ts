import { fileSystemService } from './FileSystemService';
import * as fs from 'fs';
import * as path from 'path';

interface MigrationResult {
  success: boolean;
  migratedData: {
    reports: number;
    logs: number;
    checkpoints: number;
    generationStates: number;
  };
  errors: string[];
  backupCreated: boolean;
}

class MigrationService {
  private config = fileSystemService.getConfig();

  async migrateFromLocalStorage(localStorageData: any): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      migratedData: { reports: 0, logs: 0, checkpoints: 0, generationStates: 0 },
      errors: [],
      backupCreated: false
    };

    try {
      // Create backup of localStorage data
      await this.createBackup(localStorageData);
      result.backupCreated = true;

      // Migrate reports
      if (localStorageData.reports && Array.isArray(localStorageData.reports)) {
        console.log(`Migrating ${localStorageData.reports.length} reports...`);
        for (const report of localStorageData.reports) {
          try {
            if (await fileSystemService.saveReport(report)) {
              result.migratedData.reports++;
            } else {
              result.errors.push(`Failed to migrate report: ${report.id}`);
            }
          } catch (error: any) {
            result.errors.push(`Error migrating report ${report.id}: ${error.message}`);
          }
        }
      }

      // Migrate report logs
      if (localStorageData.reportLogs && Array.isArray(localStorageData.reportLogs)) {
        console.log(`Migrating ${localStorageData.reportLogs.length} report logs...`);
        for (const log of localStorageData.reportLogs) {
          try {
            if (await fileSystemService.saveReportLog(log)) {
              result.migratedData.logs++;
            } else {
              result.errors.push(`Failed to migrate log: ${log.id}`);
            }
          } catch (error: any) {
            result.errors.push(`Error migrating log ${log.id}: ${error.message}`);
          }
        }
      }

      // Migrate checkpoints
      if (localStorageData.checkpoints && typeof localStorageData.checkpoints === 'object') {
        const checkpointEntries = Object.entries(localStorageData.checkpoints);
        console.log(`Migrating ${checkpointEntries.length} checkpoints...`);
        for (const [reportId, checkpoint] of checkpointEntries) {
          try {
            if (await fileSystemService.saveCheckpoint(reportId, checkpoint)) {
              result.migratedData.checkpoints++;
            } else {
              result.errors.push(`Failed to migrate checkpoint: ${reportId}`);
            }
          } catch (error: any) {
            result.errors.push(`Error migrating checkpoint ${reportId}: ${error.message}`);
          }
        }
      }

      // Migrate generation states
      if (localStorageData.generationStates && typeof localStorageData.generationStates === 'object') {
        const stateEntries = Object.entries(localStorageData.generationStates);
        console.log(`Migrating ${stateEntries.length} generation states...`);
        for (const [reportId, state] of stateEntries) {
          try {
            if (await fileSystemService.saveGenerationState(reportId, state)) {
              result.migratedData.generationStates++;
            } else {
              result.errors.push(`Failed to migrate generation state: ${reportId}`);
            }
          } catch (error: any) {
            result.errors.push(`Error migrating generation state ${reportId}: ${error.message}`);
          }
        }
      }

      // Mark migration as completed
      await this.markMigrationCompleted(result);

      console.log('Migration completed:', result);
    } catch (error: any) {
      result.success = false;
      result.errors.push(`Migration failed: ${error.message}`);
      console.error('Migration error:', error);
    }

    return result;
  }

  private async createBackup(localStorageData: any): Promise<void> {
    const backupPath = path.join(this.config.migrationsDir, `localStorage-backup-${Date.now()}.json`);
    await fileSystemService.saveFile(backupPath, {
      timestamp: new Date().toISOString(),
      data: localStorageData
    });
    console.log('Backup created at:', backupPath);
  }

  private async markMigrationCompleted(result: MigrationResult): Promise<void> {
    const migrationRecord = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      result: result
    };

    const recordPath = path.join(this.config.migrationsDir, 'completed.json');
    await fileSystemService.saveFile(recordPath, migrationRecord);
  }

  async hasCompletedMigration(): Promise<boolean> {
    console.log('MigrationService.hasCompletedMigration() called');
    const recordPath = path.join(this.config.migrationsDir, 'completed.json');
    console.log('Migration record path:', recordPath);
    const record = await fileSystemService.loadFile(recordPath);
    console.log('Migration record:', record);
    const completed = record !== null;
    console.log('Migration completed:', completed);
    return completed;
  }

  async getMigrationHistory(): Promise<any[]> {
    try {
      const migrationsDir = this.config.migrationsDir;
      const files = await fs.promises.readdir(migrationsDir);
      const migrationFiles = files.filter(file => file.startsWith('localStorage-backup-'));

      const history = [];
      for (const file of migrationFiles) {
        const filePath = path.join(migrationsDir, file);
        const data = await fileSystemService.loadFile(filePath);
        if (data) {
          history.push({
            file,
            timestamp: data.timestamp,
            dataSize: JSON.stringify(data.data).length
          });
        }
      }

      return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error getting migration history:', error);
      return [];
    }
  }

  async getLastMigrationResult(): Promise<any> {
    const recordPath = path.join(this.config.migrationsDir, 'completed.json');
    return await fileSystemService.loadFile(recordPath);
  }

  async validateMigrationData(localStorageData: any): Promise<{
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
      if (localStorageData.reports) {
        if (Array.isArray(localStorageData.reports)) {
          dataSummary.reports = localStorageData.reports.length;
          for (const report of localStorageData.reports) {
            if (!report.id || !report.name) {
              issues.push(`Report missing required fields: ${JSON.stringify(report)}`);
              isValid = false;
            }
          }
        } else {
          issues.push('Reports data is not an array');
          isValid = false;
        }
      }

      // Validate logs
      if (localStorageData.reportLogs) {
        if (Array.isArray(localStorageData.reportLogs)) {
          dataSummary.logs = localStorageData.reportLogs.length;
          for (const log of localStorageData.reportLogs) {
            if (!log.id || !log.reportId) {
              issues.push(`Log missing required fields: ${JSON.stringify(log)}`);
              isValid = false;
            }
          }
        } else {
          issues.push('Report logs data is not an array');
          isValid = false;
        }
      }

      // Validate checkpoints
      if (localStorageData.checkpoints) {
        if (typeof localStorageData.checkpoints === 'object') {
          dataSummary.checkpoints = Object.keys(localStorageData.checkpoints).length;
        } else {
          issues.push('Checkpoints data is not an object');
          isValid = false;
        }
      }

      // Validate generation states
      if (localStorageData.generationStates) {
        if (typeof localStorageData.generationStates === 'object') {
          dataSummary.generationStates = Object.keys(localStorageData.generationStates).length;
        } else {
          issues.push('Generation states data is not an object');
          isValid = false;
        }
      }

      // Calculate total size
      dataSummary.totalSize = JSON.stringify(localStorageData).length;

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
}

export const migrationService = new MigrationService();
