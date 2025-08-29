import React, { useContext } from 'react';
import { Layout, Card, Typography, Form, Input, Button, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, FileTextOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const LoginScreen: React.FC = () => {
    const { login, isLoading } = useContext(AuthContext);
    const [form] = Form.useForm();

    const handleLogin = async (values: { phone: string; password: string }) => {
        const success = await login(values);
        if (success) {
            form.resetFields();
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
            <Content style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '24px'
            }}>
                <Card 
                    style={{ 
                        maxWidth: 450, 
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <FileTextOutlined style={{ 
                                fontSize: '48px', 
                                color: '#ff8c69',
                                marginRight: '12px'
                            }} />
                            <Title level={2} style={{ margin: 0, color: '#ff8c69' }}>
                                Wowworks AI Tools
                            </Title>
                        </div>
                        <Title level={3} style={{ margin: '16px 0 8px 0' }}>
                            Welcome Back
                        </Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                            Sign in to access your Wowworks AI-powered workspace
                        </Text>
                    </div>

                    <Form
                        form={form}
                        onFinish={handleLogin}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="phone"
                            rules={[
                                { required: true, message: 'Please enter your phone number' },
                                { pattern: /^\+?[\d\s\-\(\)]+$/, message: 'Please enter a valid phone number' }
                            ]}
                        >
                            <Input
                                placeholder="Phone number"
                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                style={{ height: '48px', borderRadius: '8px' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter your password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                style={{ height: '48px', borderRadius: '8px' }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '16px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                style={{ 
                                    width: '100%', 
                                    height: '48px', 
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    background: '#ff8c69',
                                    borderColor: '#ff8c69'
                                }}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider style={{ margin: '24px 0' }}>
                        <Text type="secondary">Wowworks AI-Powered Task Management</Text>
                    </Divider>

                    <div style={{ textAlign: 'center' }}>
                        <Space direction="vertical" size="small">
                            <Text type="secondary" style={{ fontSize: '14px' }}>
                                ✨ Wowworks Task Builder
                            </Text>
                            <Text type="secondary" style={{ fontSize: '14px' }}>
                                📊 Wowworks Operational Reports
                            </Text>
                            <Text type="secondary" style={{ fontSize: '14px' }}>
                                🔐 Secure Authentication
                            </Text>
                        </Space>
                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default LoginScreen;
