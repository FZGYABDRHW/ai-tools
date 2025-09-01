import React, { useState, useEffect } from 'react';
import { Button, Typography, Space, Tooltip, Badge } from 'antd';
import { ReloadOutlined, InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface VersionDisplayProps {
  className?: string;
  showUpdateButton?: boolean;
  compact?: boolean;
}

const VersionDisplay: React.FC<VersionDisplayProps> = ({ 
  className = '', 
  showUpdateButton = true,
  compact = false 
}) => {
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    // Get current app version
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then((version: string) => {
        setCurrentVersion(version);
      });
    }

    // Set up auto-updater event listeners
    if (window.electronAPI) {
      window.electronAPI.onAutoUpdaterStatus((status: any) => {
        console.log('Auto-updater status:', status);
        
        if (status.status === 'checking') {
          setCheckingForUpdates(true);
        } else if (status.status === 'update-available') {
          setUpdateAvailable(true);
          setCheckingForUpdates(false);
        } else if (status.status === 'update-not-available') {
          setUpdateAvailable(false);
          setCheckingForUpdates(false);
          setLastChecked(new Date());
        } else if (status.status === 'error') {
          setCheckingForUpdates(false);
        }
      });
    }

    // Clean up listeners on unmount
    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('auto-updater:status');
      }
    };
  }, []);

  const handleCheckForUpdates = async () => {
    if (!window.electronAPI) return;
    
    try {
      setCheckingForUpdates(true);
      await window.electronAPI.checkForUpdates();
    } catch (error) {
      console.error('Error checking for updates:', error);
      setCheckingForUpdates(false);
    }
  };

  if (compact) {
    return (
      <div className={className}>
        <Space size="small">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            v{currentVersion}
          </Text>
          {showUpdateButton && (
            <Tooltip title="Check for updates">
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                loading={checkingForUpdates}
                onClick={handleCheckForUpdates}
                style={{ padding: '4px 8px', height: 'auto' }}
              />
            </Tooltip>
          )}
        </Space>
      </div>
    );
  }

  return (
    <div className={className}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space>
          <Text strong>Version:</Text>
          <Badge 
            count={updateAvailable ? 'Update Available' : undefined}
            color="green"
            style={{ 
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '10px'
            }}
          >
            <Text code style={{ fontSize: '14px' }}>
              v{currentVersion}
            </Text>
          </Badge>
        </Space>
        
        {lastChecked && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </Text>
        )}
        
        {showUpdateButton && (
          <Space>
            <Button
              type="default"
              size="small"
              icon={<ReloadOutlined />}
              loading={checkingForUpdates}
              onClick={handleCheckForUpdates}
            >
              {checkingForUpdates ? 'Checking...' : 'Check for Updates'}
            </Button>
            
            {updateAvailable && (
              <Button
                type="primary"
                size="small"
                icon={<DownloadOutlined />}
              >
                Update Available
              </Button>
            )}
          </Space>
        )}
      </Space>
    </div>
  );
};

export default VersionDisplay;
