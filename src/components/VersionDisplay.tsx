import React, { useState, useEffect } from 'react';
import { Button, Typography, Space, Tooltip, Badge, Dropdown, message } from 'antd';
import { ReloadOutlined, InfoCircleOutlined, DownloadOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

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
  const [currentVersion, setCurrentVersion] = useState<string>('1.0.4');
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('VersionDisplay: Component mounted');
    console.log('VersionDisplay: window.electronAPI available?', !!window.electronAPI);
    
    // Get current app version
    if (window.electronAPI) {
      console.log('VersionDisplay: Getting app version...');
      window.electronAPI.getAppVersion()
        .then((version: string) => {
          console.log('VersionDisplay: Got version:', version);
          setCurrentVersion(version);
        })
        .catch((err: any) => {
          console.error('VersionDisplay: Error getting version:', err);
          setError('Failed to get version');
          // Keep the default version
        });
    } else {
      console.log('VersionDisplay: electronAPI not available, using default version');
    }

    // Set up auto-updater event listeners
    if (window.electronAPI) {
      window.electronAPI.onAutoUpdaterStatus((status: any) => {
        console.log('VersionDisplay: Auto-updater status:', status);
        
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
    console.log('🔍 VersionDisplay: Check for updates button clicked!');
    console.log('🔍 VersionDisplay: window.electronAPI available?', !!window.electronAPI);
    
    if (!window.electronAPI) {
      console.error('❌ VersionDisplay: electronAPI not available!');
      message.error('Electron API not available');
      return;
    }
    
    try {
      console.log('🔍 VersionDisplay: Calling checkForUpdates...');
      setCheckingForUpdates(true);
      const result = await window.electronAPI.checkForUpdates();
      console.log('🔍 VersionDisplay: checkForUpdates result:', result);
      message.success('Update check completed');
    } catch (error) {
      console.error('❌ VersionDisplay: Error checking for updates:', error);
      message.error('Failed to check for updates: ' + (error as any)?.message || 'Unknown error');
    } finally {
      setCheckingForUpdates(false); // Always reset the loading state
    }
  };

  const handleForceCheckForUpdates = async () => {
    console.log('🔄 VersionDisplay: Force check for updates button clicked!');
    console.log('🔄 VersionDisplay: window.electronAPI available?', !!window.electronAPI);
    
    if (!window.electronAPI) {
      console.error('❌ VersionDisplay: electronAPI not available!');
      message.error('Electron API not available');
      return;
    }
    
    try {
      console.log('🔄 VersionDisplay: Calling forceCheckForUpdates...');
      setCheckingForUpdates(true);
      const result = await window.electronAPI.forceCheckForUpdates();
      console.log('🔄 VersionDisplay: forceCheckForUpdates result:', result);
      message.success('Force update check completed');
    } catch (error) {
      console.error('❌ VersionDisplay: Error in force update check:', error);
      message.error('Force update check failed: ' + (error as any)?.message || 'Unknown error');
    } finally {
      setCheckingForUpdates(false); // Always reset the loading state
    }
  };

  const handleTestIpc = async () => {
    console.log('🧪 VersionDisplay: Test IPC button clicked!');
    console.log('🧪 VersionDisplay: window.electronAPI available?', !!window.electronAPI);
    
    if (!window.electronAPI) {
      console.error('❌ VersionDisplay: electronAPI not available!');
      message.error('Electron API not available');
      return;
    }
    
    // Debug: Log all available methods
    console.log('🧪 VersionDisplay: Available electronAPI methods:', Object.keys(window.electronAPI));
    
    try {
      console.log('🧪 VersionDisplay: Calling testIpc...');
      const result = await window.electronAPI.testIpc();
      console.log('🧪 VersionDisplay: testIpc result:', result);
      message.success('IPC test successful: ' + result.message);
    } catch (error) {
      console.error('❌ VersionDisplay: Test IPC error:', error);
      message.error('IPC test failed: ' + (error as any)?.message || 'Unknown error');
    }
  };

  const handleDebugElectronAPI = () => {
    console.log('🔍 VersionDisplay: Debug button clicked!');
    console.log('🔍 VersionDisplay: window object:', window);
    console.log('🔍 VersionDisplay: window.electronAPI:', window.electronAPI);
    
    if (window.electronAPI) {
      console.log('🔍 VersionDisplay: Available methods:', Object.keys(window.electronAPI));
      console.log('🔍 VersionDisplay: getAppVersion method:', typeof window.electronAPI.getAppVersion);
      console.log('🔍 VersionDisplay: checkForUpdates method:', typeof window.electronAPI.checkForUpdates);
    } else {
      console.error('❌ VersionDisplay: electronAPI is undefined!');
      message.error('electronAPI is undefined - check preload script');
    }
  };

  const handleDownloadLatestVersion = async () => {
    console.log('📥 VersionDisplay: Download latest version button clicked!');
    console.log('📥 VersionDisplay: window.electronAPI available?', !!window.electronAPI);
    
    if (!window.electronAPI) {
      console.error('❌ VersionDisplay: electronAPI not available!');
      message.error('Electron API not available');
      return;
    }
    
    try {
      console.log('📥 VersionDisplay: Calling downloadLatestVersion...');
      setCheckingForUpdates(true);
      const result = await window.electronAPI.downloadLatestVersion();
      console.log('📥 VersionDisplay: downloadLatestVersion result:', result);
      
      if (result.updateAvailable) {
        message.success(result.message);
      } else {
        message.info(result.message);
      }
    } catch (error) {
      console.error('❌ VersionDisplay: Error downloading latest version:', error);
      message.error('Failed to download latest version: ' + (error as any)?.message || 'Unknown error');
    } finally {
      setCheckingForUpdates(false);
    }
  };

  // Context menu items for update options
  const updateMenuItems: MenuProps['items'] = [
    {
      key: 'check',
      label: 'Check for Updates',
      icon: <ReloadOutlined />,
      onClick: handleCheckForUpdates,
    },
    {
      key: 'force-check',
      label: 'Force Check (Ignore Cache)',
      icon: <ReloadOutlined />,
      onClick: handleForceCheckForUpdates,
    },
    {
      key: 'test-ipc',
      label: 'Test IPC Communication',
      icon: <InfoCircleOutlined />,
      onClick: handleTestIpc,
    },
    {
      key: 'download-latest',
      label: 'Download Latest Version',
      icon: <DownloadOutlined />,
      onClick: handleDownloadLatestVersion,
    },
    {
      key: 'debug',
      label: 'Debug Electron API',
      icon: <InfoCircleOutlined />,
      onClick: handleDebugElectronAPI,
    },
    {
      key: 'info',
      label: 'Update Info',
      icon: <InfoCircleOutlined />,
      disabled: true,
    },
  ];

  // Always show version
  if (compact) {
    return (
      <div className={className} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 140, 105, 0.1)',
        border: '1px solid rgba(255, 140, 105, 0.3)',
        width: '130px',
        flexShrink: 0,
        flexGrow: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <Text type="secondary" style={{ fontSize: '12px', color: '#ff8c69', fontWeight: 500 }}>
          v{currentVersion}
        </Text>
        {showUpdateButton && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <Tooltip title="Check for updates">
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                loading={checkingForUpdates}
                onClick={handleCheckForUpdates}
                style={{ 
                  padding: '2px 4px', 
                  height: 'auto',
                  color: '#ff8c69',
                  fontSize: '10px'
                }}
              />
            </Tooltip>
            <Dropdown menu={{ items: updateMenuItems }} trigger={['click']}>
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                style={{ 
                  padding: '2px 4px', 
                  height: 'auto',
                  color: '#ff8c69',
                  fontSize: '10px'
                }}
              />
            </Dropdown>
          </div>
        )}
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
