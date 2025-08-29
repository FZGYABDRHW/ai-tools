import React, { useContext } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import LoginForm from './LoginForm';

const { Title, Text } = Typography;

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { authToken, user } = useContext(AuthContext);

    if (!authToken || !user) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '50vh',
                padding: '24px'
            }}>
                <Card style={{ maxWidth: 400, width: '100%' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                        <Title level={3}>Authentication Required</Title>
                        <Text type="secondary">
                            Please login to access AI Tools features
                        </Text>
                    </div>
                    <LoginForm />
                </Card>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
