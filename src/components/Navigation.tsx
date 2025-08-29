import React, { useContext } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
import { SidebarContext } from '../contexts/SidebarContext';

const { Sider } = Layout;
const { Title } = Typography;

const Navigation: React.FC = () => {
    const location = useLocation();
    const { isSidebarVisible } = useContext(SidebarContext);
    
    const menuItems = [
        {
            key: '/task-text-builder',
            icon: <FileTextOutlined />,
            label: <Link to="/task-text-builder">AI Task Builder</Link>,
        },
        {
            key: '/custom-report',
            icon: <BarChartOutlined />,
            label: <Link to="/custom-report">Custom Operational Report</Link>,
        },
    ];

    if (!isSidebarVisible) {
        return null;
    }

    return (
        <Sider width={250} theme="light">
            <div style={{ padding: '16px', textAlign: 'center' }}>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                    AI Tools
                </Title>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{ height: '100%', borderRight: 0 }}
            />
        </Sider>
    );
};

export default Navigation;
