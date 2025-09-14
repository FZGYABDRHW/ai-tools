import React, { useState, useEffect } from 'react';
import { Modal, Progress, Button, Alert, Typography, Space, Descriptions, Card } from 'antd';
import { rendererMigrationService } from '../services/migrationService';

const { Text, Title } = Typography;

interface MigrationModalProps {
  visible: boolean;
  onComplete: (success: boolean) => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({ visible, onComplete }) => {
  const [step, setStep] = useState<'checking' | 'extracting' | 'validating' | 'migrating' | 'completed' | 'error'>('checking');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      startMigration();
    }
  }, [visible]);

  const startMigration = async () => {
    try {
      setStep('checking');
      setMessage('Checking for existing data...');
      setProgress(10);

      // Check if localStorage data exists
      const hasData = await rendererMigrationService.checkLocalStorageData();
      if (!hasData) {
        setMessage('No existing data found. Migration not needed.');
        setStep('completed');
        setProgress(100);
        return;
      }

      setStep('extracting');
      setMessage('Extracting data from localStorage...');
      setProgress(30);

      // Extract localStorage data
      const data = await rendererMigrationService.extractLocalStorageData();
      setLocalStorageData(data);

      setStep('validating');
      setMessage('Validating data integrity...');
      setProgress(50);

      // Validate data
      const validation = await rendererMigrationService.validateLocalStorageData();
      setValidationResult(validation);

      if (!validation.isValid) {
        setStep('error');
        setError(`Data validation failed: ${validation.issues.join(', ')}`);
        return;
      }

      setStep('migrating');
      setMessage('Migrating data to file system...');
      setProgress(70);

      // Migrate to file system
      const result = await (window.electronAPI as any).migration.migrateFromLocalStorage(data);
      setMigrationResult(result);

      if (result.success) {
        setMessage('Migration completed successfully!');
        setProgress(90);

        // Clear localStorage
        await rendererMigrationService.clearLocalStorage();

        setStep('completed');
        setProgress(100);
        setMessage('Data has been successfully migrated to file system.');
      } else {
        setStep('error');
        setError(`Migration failed: ${result.errors.join(', ')}`);
      }
    } catch (error: any) {
      setStep('error');
      setError(`Migration error: ${error.message}`);
    }
  };

  const handleClose = () => {
    onComplete(step === 'completed');
  };

  const getStepDescription = () => {
    switch (step) {
      case 'checking':
        return 'Checking for existing localStorage data...';
      case 'extracting':
        return 'Extracting data from localStorage...';
      case 'validating':
        return 'Validating data integrity...';
      case 'migrating':
        return 'Migrating data to file system...';
      case 'completed':
        return 'Migration completed successfully!';
      case 'error':
        return 'Migration failed';
      default:
        return '';
    }
  };

  return (
    <Modal
      title="Data Migration"
      open={visible}
      onCancel={handleClose}
      footer={
        <Button type="primary" onClick={handleClose}>
          {step === 'completed' ? 'Continue' : 'Close'}
        </Button>
      }
      closable={step === 'completed' || step === 'error'}
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text>{message}</Text>
          <Progress
            percent={progress}
            status={step === 'error' ? 'exception' : 'active'}
            style={{ marginTop: 8 }}
          />
        </div>

        {step === 'validating' && validationResult && (
          <Card title="Data Validation" size="small">
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Reports">{validationResult.dataSummary.reports}</Descriptions.Item>
              <Descriptions.Item label="Logs">{validationResult.dataSummary.logs}</Descriptions.Item>
              <Descriptions.Item label="Checkpoints">{validationResult.dataSummary.checkpoints}</Descriptions.Item>
              <Descriptions.Item label="Generation States">{validationResult.dataSummary.generationStates}</Descriptions.Item>
              <Descriptions.Item label="Total Size">
                {(validationResult.dataSummary.totalSize / 1024).toFixed(2)} KB
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {step === 'error' && error && (
          <Alert
            message="Migration Failed"
            description={error}
            type="error"
            showIcon
          />
        )}

        {step === 'completed' && migrationResult && (
          <Alert
            message="Migration Successful"
            description={
              <div>
                <p>Successfully migrated the following data:</p>
                <ul>
                  <li>Reports: {migrationResult.migratedData.reports}</li>
                  <li>Logs: {migrationResult.migratedData.logs}</li>
                  <li>Checkpoints: {migrationResult.migratedData.checkpoints}</li>
                  <li>Generation States: {migrationResult.migratedData.generationStates}</li>
                </ul>
                {migrationResult.backupCreated && (
                  <p><Text type="secondary">A backup was created before migration.</Text></p>
                )}
                {migrationResult.errors && migrationResult.errors.length > 0 && (
                  <div>
                    <p><Text type="warning">Some items failed to migrate:</Text></p>
                    <ul>
                      {migrationResult.errors.map((error: string, index: number) => (
                        <li key={index}><Text type="secondary">{error}</Text></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            }
            type="success"
            showIcon
          />
        )}

        {step === 'migrating' && localStorageData && (
          <Card title="Migration Progress" size="small">
            <Text type="secondary">
              Migrating {localStorageData.metadata.keys.length} data sources...
            </Text>
          </Card>
        )}
      </Space>
    </Modal>
  );
};
