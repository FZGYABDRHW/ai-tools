import React, { useContext } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { FileTextOutlined, BarChartOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { SidebarContext } from '../contexts/SidebarContext';
import logo from '../logo.png';

const { Sider } = Layout;
const { Title } = Typography;

const Navigation: React.FC = () => {
    const location = useLocation();
    const { isSidebarVisible } = useContext(SidebarContext);
    
    const menuItems = [
        {
            key: '/task-text-builder',
            icon: <FileTextOutlined />,
            label: <Link to="/task-text-builder">Wowworks Task Builder</Link>,
        },
        {
            key: '/reports',
            icon: <UnorderedListOutlined />,
            label: <Link to="/reports">Wowworks Report Management</Link>,
        },
        {
            key: '/report-logs',
            icon: <FileTextOutlined />,
            label: <Link to="/report-logs">Report Logs</Link>,
        },
    ];

    if (!isSidebarVisible) {
        return null;
    }

    return (
        <Sider 
            width={250} 
            theme="light"
            style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
                borderRight: '1px solid #e8e8e8',
                boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
            }}
        >
            {/* Header */}
            <div style={{ 
                padding: '8px 16px', 
                textAlign: 'left',
                background: 'transparent',
                borderBottom: '1px solid #e8e8e8',
                height: '48px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <img 
                        src={logo} 
                        alt="Wowworks Logo" 
                        style={{ 
                            height: '32px', 
                            width: 'auto'
                        }} 
                    />
                    <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#ff8c69'
                    }}>
                        AI Tools
                    </span>
                </div>
            </div>
            
            {/* Navigation Menu */}
            <div style={{ padding: '16px 0' }}>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ 
                        height: '100%', 
                        borderRight: 0,
                        background: 'transparent'
                    }}
                />
            </div>
            
            {/* Footer */}
            <div style={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px',
                textAlign: 'center',
                background: 'rgba(255, 140, 105, 0.05)',
                borderTop: '1px solid rgba(255, 140, 105, 0.1)'
            }}>
                <div style={{ 
                    fontSize: '11px', 
                    color: '#666',
                    fontWeight: 500
                }}>
                    Powered by Vlad v2.0
                </div>
            </div>
        </Sider>
    );
};

export default Navigation;
