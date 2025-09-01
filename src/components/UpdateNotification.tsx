import React, { useState, useEffect } from 'react';
import { Modal, Button, Progress, Typography, Space, message, Tag } from 'antd';
import { DownloadOutlined, ReloadOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface UpdateInfo {
  version: string;
  releaseDate?: string;
  releaseNotes?: string;
  files?: Array<{
    url: string;
    size: number;
    name: string;
  }>;
}

interface UpdateNotificationProps {
  visible: boolean;
  onClose: () => void;
  updateInfo?: UpdateInfo;
  onUpdate: () => void;
  downloading?: boolean;
  downloadProgress?: number;
  currentVersion?: string;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  visible,
  onClose,
  updateInfo,
  onUpdate,
  downloading = false,
  downloadProgress = 0,
  currentVersion,
}) => {
  const [installing, setInstalling] = useState(false);

  const handleUpdate = async () => {
    try {
      setInstalling(true);
      await onUpdate();
      message.success('Update downloaded! The app will restart to install the update.');
    } catch (error) {
      message.error('Failed to download update. Please try again.');
      setInstalling(false);
    }
  };

  const handleInstall = () => {
    // This will be handled by the main process
    if (window.electronAPI) {
      window.electronAPI.installUpdate();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      title={
        <Space>
          <DownloadOutlined style={{ color: '#1890ff' }} />
          <span>Update Available</span>
          {currentVersion && (
            <Tag color="blue">v{currentVersion}</Tag>
          )}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={4}>
            Version {updateInfo?.version} is available
            {currentVersion && (
              <Text type="secondary" style={{ fontSize: '14px', marginLeft: 8 }}>
                (Current: v{currentVersion})
              </Text>
            )}
          </Title>
          {updateInfo?.releaseDate && (
            <Text type="secondary">
              Released on {new Date(updateInfo.releaseDate).toLocaleDateString()}
            </Text>
          )}
        </div>

        {updateInfo?.releaseNotes && (
          <div>
            <Text strong>What's new:</Text>
            <div style={{ 
              maxHeight: 150, 
              overflowY: 'auto', 
              marginTop: 8,
              padding: 12,
              backgroundColor: '#f8f9fa',
              borderRadius: 6,
              border: '1px solid #e8e8e8'
            }}>
              <Text>{updateInfo.releaseNotes}</Text>
            </div>
          </div>
        )}

        {updateInfo?.files && updateInfo.files.length > 0 && (
          <div>
            <Text strong>Update size:</Text>
            <div style={{ marginTop: 4 }}>
              <Tag color="green">
                {formatFileSize(updateInfo.files[0].size)}
              </Tag>
            </div>
          </div>
        )}

        {downloading && (
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>Downloading update...</Text>
              <Progress 
                percent={Math.round(downloadProgress)} 
                status="active"
                strokeColor="#1890ff"
              />
              <Text type="secondary">
                {Math.round(downloadProgress)}% complete
              </Text>
            </Space>
          </div>
        )}

        <div style={{ 
          padding: 12, 
          backgroundColor: '#f6ffed', 
          borderRadius: 6,
          border: '1px solid #b7eb8f'
        }}>
          <Space>
            <InfoCircleOutlined style={{ color: '#52c41a' }} />
            <Text type="secondary">
              Updates are downloaded and installed automatically. Your data will be preserved.
            </Text>
          </Space>
        </div>

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          {!downloading && !installing && (
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleUpdate}
              size="large"
            >
              Download Update
            </Button>
          )}
          
          {downloading && downloadProgress === 100 && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              onClick={handleInstall}
              size="large"
            >
              Install & Restart
            </Button>
          )}
          
          <Button onClick={onClose} size="large">
            {downloading ? 'Cancel' : 'Remind Me Later'}
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default UpdateNotification;
