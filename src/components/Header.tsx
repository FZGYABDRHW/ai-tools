import React, { useContext } from 'react';
import { Layout, Typography, Button } from 'antd';
import { FileTextOutlined, LogoutOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import { SidebarContext } from '../contexts/SidebarContext';
import VersionDisplay from './VersionDisplay';

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
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            padding: '0 16px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
                        color: '#ff8c69',
                        fontSize: '14px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 140, 105, 0.1)',
                        border: '1px solid rgba(255, 140, 105, 0.3)',
                        borderRadius: '6px'
                    }}
                />
                
                {/* Version Display */}
                <div style={{ width: '130px', flexShrink: 0, flexGrow: 0 }}>
                    <VersionDisplay compact />
                </div>
            </div>
            
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '24px' 
            }}>
                {user && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'rgba(255, 140, 105, 0.1)',
                        border: '1px solid rgba(255, 140, 105, 0.3)'
                    }}>
                        <UserOutlined style={{ 
                            color: '#ff8c69', 
                            fontSize: '14px' 
                        }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={{ 
                                color: '#333', 
                                fontSize: '12px',
                                fontWeight: 500,
                                lineHeight: 1
                            }}>
                                {user.name}
                            </Text>
                            <Text style={{ 
                                color: '#666', 
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
                        background: '#ff8c69',
                        border: '1px solid #ff8c69',
                        color: '#fff',
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
