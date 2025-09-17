import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Typography, Space, Alert, Modal, Checkbox, InputNumber } from 'antd';
import { KeyOutlined, SaveOutlined, EyeInvisibleOutlined, EyeTwoTone, DownloadOutlined } from '@ant-design/icons';
import { settingsService, AppSettings } from '../services/settingsService';
import { downloadService, DownloadOptions } from '../services/downloadService';

const { Title, Text } = Typography;

const SettingsScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>({
    includeReports: true,
    includeLogs: true,
    includeCheckpoints: true,
    includeGenerationStates: true,
    includeBackups: true,
  });
  const [downloadStats, setDownloadStats] = useState({ fileCount: 0, totalSize: 0 });


  useEffect(() => {
    loadCurrentSettings();
    loadDownloadStats();
  }, []);

  useEffect(() => {
    if (downloadModalVisible) {
      loadDownloadStats();
    }
  }, [downloadModalVisible, downloadOptions]);

  const loadCurrentSettings = async () => {
    try {
      const settings = settingsService.getSettings();
      form.setFieldsValue({
        openaiApiKey: settings.openaiApiKey,
        concurrencyLimit: settings.concurrencyLimit || 2
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
      message.error('Failed to load current settings');
    }
  };

  const handleSave = async (values: AppSettings) => {
    setLoading(true);
    try {
      await settingsService.updateSettings(values);
      message.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      message.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    const apiKey = form.getFieldValue('openaiApiKey');
    if (!apiKey || !apiKey.trim()) {
      message.warning('Please enter your OpenAI API key first');
      return;
    }

    setLoading(true);
    try {
      // Test the API key by making a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        message.success('✅ API key is valid! Connection test successful.');
      } else {
        message.error('❌ API key validation failed. Please check your key.');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      message.error('❌ Connection test failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadDownloadStats = async () => {
    try {
      const stats = await downloadService.getDownloadStats(downloadOptions);
      setDownloadStats(stats || { fileCount: 0, totalSize: 0 });
    } catch (error) {
      console.error('Failed to load download stats:', error);
      setDownloadStats({ fileCount: 0, totalSize: 0 });
    }
  };

  const handleDownloadAllData = async () => {
    setDownloadLoading(true);
    try {
      const result = await downloadService.downloadAllData(downloadOptions);

      if (result.success) {
        message.success(`✅ Download completed! File saved to: ${result.filePath}`);
        setDownloadModalVisible(false);
      } else {
        message.error(`❌ Download failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      message.error('❌ Download failed. Please try again.');
    } finally {
      setDownloadLoading(false);
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
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#ff6b35' }}>
              <KeyOutlined style={{ marginRight: 8 }} />
              Application Settings
            </Title>
            <Text type="secondary">
              Configure your application settings and API keys
            </Text>
          </div>

          <Alert
            message="OpenAI API Key Required"
            description="You need to provide your OpenAI API key to use the AI features. Get your key from the OpenAI platform."
            type="info"
            showIcon
            action={
              <Button
                size="small"
                type="link"
                href="https://platform.openai.com/api-keys"
                target="_blank"
              >
                Get API Key
              </Button>
            }
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{ openaiApiKey: '', concurrencyLimit: 2 }}
          >
            <Form.Item
              label="OpenAI API Key"
              name="openaiApiKey"
              rules={[
                { required: true, message: 'Please enter your OpenAI API key' },
                { min: 20, message: 'API key seems too short' }
              ]}
              extra="Your API key is stored locally on your device and is never shared"
            >
              <Input.Password
                placeholder="sk-..."
                prefix={<KeyOutlined />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Concurrent Generations"
              name="concurrencyLimit"
              extra="How many reports can generate at the same time"
              rules={[{ type: 'number', min: 1, message: 'Minimum 1' }]}
            >
              <InputNumber min={1} max={10} style={{ width: 200 }} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  Save Settings
                </Button>
                <Button
                  onClick={handleTestConnection}
                  loading={loading}
                  size="large"
                >
                  Test Connection
                </Button>
                <Button
                  onClick={loadCurrentSettings}
                  size="large"
                >
                  Reset to Saved
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Card size="small" style={{ background: '#f0f8ff', border: '1px solid #1890ff' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                  <DownloadOutlined style={{ marginRight: 8 }} />
                  Data Export
                </Title>
                <Text type="secondary">
                  Download all your application data as a ZIP file for backup or migration purposes
                </Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Available for download:</Text><br/>
                  <Text type="secondary">
                    {downloadStats?.fileCount || 0} files ({formatFileSize(downloadStats?.totalSize || 0)})
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => setDownloadModalVisible(true)}
                  size="large"
                >
                  Download All Data
                </Button>
              </div>
            </Space>
          </Card>

          <Card size="small" style={{ background: '#f8f9fa' }}>
            <Title level={5} style={{ margin: 0, color: '#666' }}>
              Security Note
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              • Your API key is encrypted and stored locally on your device<br/>
              • The key is never transmitted to our servers<br/>
              • You can revoke this key at any time from your OpenAI account<br/>
              • Keep your API key secure and don't share it with others
            </Text>
          </Card>
        </Space>
      </Card>

      <Modal
        title="Download All Data"
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDownloadModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="download"
            type="primary"
            loading={downloadLoading}
            onClick={handleDownloadAllData}
            icon={<DownloadOutlined />}
          >
            Download
          </Button>,
        ]}
        width={600}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="Data Export Information"
            description="This will create a ZIP file containing all your application data. You can use this file for backup or to migrate your data to another installation."
            type="info"
            showIcon
          />

          <div>
            <Title level={5}>Select data to include:</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox
                checked={downloadOptions.includeReports}
                onChange={(e) => setDownloadOptions({ ...downloadOptions, includeReports: e.target.checked })}
              >
                Reports ({downloadOptions.includeReports ? 'Included' : 'Excluded'})
              </Checkbox>
              <Checkbox
                checked={downloadOptions.includeLogs}
                onChange={(e) => setDownloadOptions({ ...downloadOptions, includeLogs: e.target.checked })}
              >
                Report Logs ({downloadOptions.includeLogs ? 'Included' : 'Excluded'})
              </Checkbox>
              <Checkbox
                checked={downloadOptions.includeCheckpoints}
                onChange={(e) => setDownloadOptions({ ...downloadOptions, includeCheckpoints: e.target.checked })}
              >
                Checkpoints ({downloadOptions.includeCheckpoints ? 'Included' : 'Excluded'})
              </Checkbox>
              <Checkbox
                checked={downloadOptions.includeGenerationStates}
                onChange={(e) => setDownloadOptions({ ...downloadOptions, includeGenerationStates: e.target.checked })}
              >
                Generation States ({downloadOptions.includeGenerationStates ? 'Included' : 'Excluded'})
              </Checkbox>
              <Checkbox
                checked={downloadOptions.includeBackups}
                onChange={(e) => setDownloadOptions({ ...downloadOptions, includeBackups: e.target.checked })}
              >
                Backups ({downloadOptions.includeBackups ? 'Included' : 'Excluded'})
              </Checkbox>
            </Space>
          </div>

          <Card size="small" style={{ background: '#f8f9fa' }}>
            <Title level={5} style={{ margin: 0 }}>Download Summary</Title>
            <Text>
              <strong>Files to download:</strong> {downloadStats?.fileCount || 0}<br/>
              <strong>Total size:</strong> {formatFileSize(downloadStats?.totalSize || 0)}
            </Text>
          </Card>
        </Space>
      </Modal>
    </div>
  );
};

export default SettingsScreen;
