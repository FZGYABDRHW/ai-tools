import React from 'react';
import { Select, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useAuth } from '../machines';
import { getAvailableServers } from '../config/servers';
import { ServerRegion } from '../types';

const { Text } = Typography;
const { Option } = Select;

const ServerSelector: React.FC = () => {
    const { selectedServer, setSelectedServer } = useAuth();
    const availableServers = getAvailableServers();

    const handleServerChange = (value: ServerRegion) => {
        setSelectedServer(value);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GlobalOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text strong style={{ color: '#666', fontSize: '14px' }}>
                    Server
                </Text>
            </div>
            <Select
                value={selectedServer}
                onChange={handleServerChange}
                style={{
                    width: 140,
                    borderRadius: '6px'
                }}
                size="large"
            >
                {availableServers.map((server) => (
                    <Option key={server.region} value={server.region}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px' }}>{server.flag}</span>
                            <span>{server.name}</span>
                        </span>
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default ServerSelector;
