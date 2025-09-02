import React from 'react';
import { Modal, Typography, Space, Button, Divider, Alert } from 'antd';
import { DownloadOutlined, InfoCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

interface ManualUpdateInstructionsProps {
  visible: boolean;
  onClose: () => void;
  version: string;
  fileName: string;
  filePath: string;
}

const ManualUpdateInstructions: React.FC<ManualUpdateInstructionsProps> = ({
  visible,
  onClose,
  version,
  fileName,
  filePath,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <DownloadOutlined style={{ color: '#52c41a' }} />
          <span>Manual Update Instructions</span>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="close" onClick={handleClose}>
          Got It
        </Button>
      ]}
      width={700}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Success Alert */}
        <Alert
          message="Download Complete!"
          description={`Update package v${version} has been downloaded to your Downloads folder.`}
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
        />

        {/* File Information */}
        <div style={{
          padding: 16,
          backgroundColor: '#f6ffed',
          borderRadius: 6,
          border: '1px solid #b7eb8f'
        }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong>Downloaded File:</Text>
            <Text code>{fileName}</Text>
            <Text type="secondary">Location: Downloads folder</Text>
          </Space>
        </div>

        {/* Step-by-Step Instructions */}
        <div>
          <Title level={4}>📱 Manual Update Steps</Title>
          
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Step 1 */}
            <div style={{
              padding: 16,
              backgroundColor: '#fff7e6',
              borderRadius: 6,
              border: '1px solid #ffd591'
            }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ color: '#d46b08' }}>
                  1️⃣ Quit Current Application
                </Text>
                <Text>• Close Wowworks AI Tools completely</Text>
                <Text>• Make sure it's not running in the background</Text>
                <Text>• Check Activity Monitor if needed</Text>
              </Space>
            </div>

            {/* Step 2 */}
            <div style={{
              padding: 16,
              backgroundColor: '#f6ffed',
              borderRadius: 6,
              border: '1px solid #b7eb8f'
            }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ color: '#389e0d' }}>
                  2️⃣ Extract Update Package
                </Text>
                <Text>• Go to Downloads folder</Text>
                <Text>• Find: <Text code>{fileName}</Text></Text>
                <Text>• Double-click to extract the ZIP file</Text>
                <Text>• You'll get a new app folder</Text>
              </Space>
            </div>

            {/* Step 3 */}
            <div style={{
              padding: 16,
              backgroundColor: '#e6f7ff',
              borderRadius: 6,
              border: '1px solid #91d5ff'
            }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ color: '#096dd9' }}>
                  3️⃣ Replace Application
                </Text>
                <Text>• Drag the new app to Applications folder</Text>
                <Text>• Replace the old version when prompted</Text>
                <Text>• Enter your password if asked</Text>
                <Text>• Wait for the copy to complete</Text>
              </Space>
            </div>

            {/* Step 4 */}
            <div style={{
              padding: 16,
              backgroundColor: '#fff0f6',
              borderRadius: 6,
              border: '1px solid #ffadd2'
            }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ color: '#c41d7f' }}>
                  4️⃣ Launch New Version
                </Text>
                <Text>• Open the new version from Applications</Text>
                <Text>• Verify the version shows v{version}</Text>
                <Text>• Your data and settings will be preserved</Text>
                <Text>• Delete the old version after confirming it works</Text>
              </Space>
            </div>
          </Space>
        </div>

        {/* Important Notes */}
        <Divider />
        <div>
          <Title level={5}>
            <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
            Important Notes
          </Title>
          <Space direction="vertical" size="small">
            <Text>• This method bypasses code signing requirements</Text>
            <Text>• Your data and preferences will be preserved</Text>
            <Text>• The old version will remain until you delete it</Text>
            <Text>• If you encounter issues, you can revert to the old version</Text>
          </Space>
        </div>

        {/* Troubleshooting */}
        <div>
          <Title level={5}>
            <InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            Troubleshooting
          </Title>
          <Space direction="vertical" size="small">
            <Text>• If the app won't open, check Gatekeeper settings</Text>
            <Text>• Right-click the app → "Open" to bypass security</Text>
            <Text>• Make sure you have sufficient disk space</Text>
            <Text>• Contact support if you encounter persistent issues</Text>
          </Space>
        </div>
      </Space>
    </Modal>
  );
};

export default ManualUpdateInstructions;
