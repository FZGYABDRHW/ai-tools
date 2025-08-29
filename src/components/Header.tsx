import React, { useContext } from 'react';
import { Layout, Typography, Button } from 'antd';
import { FileTextOutlined, LogoutOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import { SidebarContext } from '../contexts/SidebarContext';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
    const { user, logout, isLoading } = useContext(AuthContext);
    const { isSidebarVisible, toggleSidebar } = useContext(SidebarContext);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Header style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '0 16px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1000
        }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px' 
            }}>
                <Button
                    type="text"
                    icon={isSidebarVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    onClick={toggleSidebar}
                    style={{
                        color: '#fff',
                        fontSize: '14px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        backdropFilter: 'blur(10px)'
                    }}
                />
            </div>
            
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '24px' 
            }}>
                {user && (
                    <div className="glass-effect" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px'
                    }}>
                        <UserOutlined style={{ 
                            color: '#fff', 
                            fontSize: '14px' 
                        }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={{ 
                                color: '#fff', 
                                fontSize: '12px',
                                fontWeight: 500,
                                lineHeight: 1
                            }}>
                                {user.name}
                            </Text>
                            <Text style={{ 
                                color: 'rgba(255, 255, 255, 0.7)', 
                                fontSize: '10px',
                                lineHeight: 1
                            }}>
                                ID: {user.id}
                            </Text>
                        </div>
                    </div>
                )}
                
                <Button
                    type="default"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    loading={isLoading}
                    size="middle"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        backdropFilter: 'blur(10px)',
                        height: '32px',
                        fontSize: '12px'
                    }}
                >
                    Logout
                </Button>
            </div>
        </Header>
    );
};

export default AppHeader;
