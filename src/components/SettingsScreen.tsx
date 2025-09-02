import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Typography, Space, Alert } from 'antd';
import { KeyOutlined, SaveOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { settingsService, AppSettings } from '../services/settingsService';

const { Title, Text } = Typography;

const SettingsScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = async () => {
    try {
      const settings = settingsService.getSettings();
      form.setFieldsValue({
        openaiApiKey: settings.openaiApiKey
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
            initialValues={{ openaiApiKey: '' }}
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
    </div>
  );
};

export default SettingsScreen;
