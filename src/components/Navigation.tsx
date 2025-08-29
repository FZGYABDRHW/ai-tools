import React, { useContext } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { FileTextOutlined, BarChartOutlined, UnorderedListOutlined } from '@ant-design/icons';
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
            label: <Link to="/task-text-builder">Wowworks Task Builder</Link>,
        },
        {
            key: '/reports',
            icon: <UnorderedListOutlined />,
            label: <Link to="/reports">Wowworks Report Management</Link>,
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
                padding: '20px 16px', 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #ff8c69 0%, #ff9f7f 100%)',
                borderBottom: '1px solid rgba(255, 140, 105, 0.2)'
            }}>
                <Title level={4} style={{ 
                    margin: 0, 
                    color: '#fff',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                }}>
                    Wowworks AI Tools
                </Title>
                <div style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '4px'
                }}>
                    Professional Workspace
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
                    Powered by Wowworks
                </div>
            </div>
        </Sider>
    );
};

export default Navigation;
