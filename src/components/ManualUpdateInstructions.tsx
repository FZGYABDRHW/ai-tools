import React from 'react';
import { Modal, Typography, Steps, Space, Alert, Divider } from 'antd';
import { 
  DownloadOutlined, 
  StopOutlined, 
  SwapOutlined, 
  RocketOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

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
  const steps = [
    {
      title: 'Download Complete',
      description: 'Update file saved to Downloads',
      icon: <DownloadOutlined style={{ color: '#52c41a' }} />,
      content: (
        <div>
          <Alert
            message="Download Successful!"
            description={`File: ${fileName}\nLocation: ${filePath}`}
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Text>Your update has been downloaded to the Downloads folder.</Text>
        </div>
      ),
    },
    {
      title: 'Quit Current App',
      description: 'Close Wowworks AI Tools completely',
      icon: <StopOutlined style={{ color: '#fa8c16' }} />,
      content: (
        <div>
          <Alert
            message="Important: Quit Completely"
            description="Make sure the app is not running in the background"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Text>
            • Close Wowworks AI Tools completely<br/>
            • Check Dock for any running instances<br/>
            • Use Force Quit if necessary (⌘+Option+Esc)
          </Text>
        </div>
      ),
    },
    {
      title: 'Replace Application',
      description: 'Extract and replace the old version',
      icon: <SwapOutlined style={{ color: '#1890ff' }} />,
      content: (
        <div>
          <Alert
            message="Replace Application"
            description="Drag the new version to Applications folder"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Text>
            1. Go to Downloads folder<br/>
            2. Find: <strong>{fileName}</strong><br/>
            3. Double-click to extract the ZIP file<br/>
            4. Drag the extracted app to Applications folder<br/>
            5. Replace the old version when prompted
          </Text>
        </div>
      ),
    },
    {
      title: 'Launch New Version',
      description: 'Open and verify the update',
      icon: <RocketOutlined style={{ color: '#722ed1' }} />,
      content: (
        <div>
          <Alert
            message="Launch New Version"
            description="Open from Applications and verify the update"
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Text>
            • Open the new version from Applications folder<br/>
            • Verify the version shows <strong>v{version}</strong><br/>
            • Your data will be preserved<br/>
            • You can delete the old version after confirming it works
          </Text>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span>Manual Update Instructions</span>
          <Text type="secondary">v{version}</Text>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Alert
          message="Why Manual Update?"
          description="This method bypasses auto-update issues and gives you full control over the update process."
          type="info"
          showIcon
        />

        <Steps
          direction="vertical"
          current={0}
          items={steps}
          style={{ marginTop: 24 }}
        />

        <Divider />

        <div style={{ 
          padding: 16, 
          backgroundColor: '#f6ffed', 
          borderRadius: 6,
          border: '1px solid #b7eb8f'
        }}>
          <Space>
            <InfoCircleOutlined style={{ color: '#52c41a' }} />
            <div>
              <Text strong>Benefits of Manual Update:</Text>
              <br />
              <Text type="secondary">
                • No code signature validation errors<br/>
                • Full control over the update process<br/>
                • Can verify the file before installation<br/>
                • Works even if auto-updater has issues
              </Text>
            </div>
          </Space>
        </div>

        <div style={{ 
          padding: 16, 
          backgroundColor: '#fff2e8', 
          borderRadius: 6,
          border: '1px solid #ffbb96'
        }}>
          <Space>
            <InfoCircleOutlined style={{ color: '#fa8c16' }} />
            <div>
              <Text strong>Need Help?</Text>
              <br />
              <Text type="secondary">
                If you encounter any issues during the manual update process,<br/>
                you can always download the latest version directly from:<br/>
                <a href="https://github.com/FZGYABDRHW/ai-tools/releases" target="_blank" rel="noopener noreferrer">
                  GitHub Releases
                </a>
              </Text>
            </div>
          </Space>
        </div>
      </Space>
    </Modal>
  );
};

export default ManualUpdateInstructions;
