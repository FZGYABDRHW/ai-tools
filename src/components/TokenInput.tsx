import React, { useContext } from 'react';
import { Input, Typography } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';

const { Text } = Typography;

const TokenInput: React.FC = () => {
    const { authToken, setAuthToken } = useContext(AuthContext);
    
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text strong style={{ color: '#666', fontSize: '14px' }}>
                    Auth Token
                </Text>
            </div>
            <Input
                placeholder="Enter your authentication token"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                style={{ 
                    width: 320,
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9'
                }}
                size="large"
                allowClear
            />
            {authToken && (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '4px'
                }}>
                    <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: '#52c41a' 
                    }} />
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                        Connected
                    </Text>
                </div>
            )}
        </div>
    );
};

export default TokenInput;
