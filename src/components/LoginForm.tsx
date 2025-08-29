import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
    const { authToken, login, logout, isLoading, user } = useContext(AuthContext);
    const [form] = Form.useForm();

    const handleLogin = async (values: { phone: string; password: string }) => {
        const success = await login(values);
        if (success) {
            form.resetFields();
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    if (authToken && user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text strong style={{ color: '#666', fontSize: '14px', lineHeight: 1 }}>
                            {user.name}
                        </Text>
                        <Text style={{ color: '#999', fontSize: '12px', lineHeight: 1 }}>
                            {user.phone}
                        </Text>
                    </div>
                </div>
                <Button
                    type="default"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    loading={isLoading}
                    size="large"
                >
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Form
                form={form}
                onFinish={handleLogin}
                layout="inline"
                style={{ margin: 0 }}
            >
                <Form.Item
                    name="phone"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                    style={{ margin: 0 }}
                >
                    <Input
                        placeholder="Phone number"
                        prefix={<UserOutlined />}
                        size="large"
                        style={{ width: 150 }}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                    style={{ margin: 0 }}
                >
                    <Input.Password
                        placeholder="Password"
                        prefix={<LockOutlined />}
                        size="large"
                        style={{ width: 150 }}
                    />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        size="large"
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginForm;
