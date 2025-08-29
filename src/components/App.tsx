import React, { useContext } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SidebarProvider } from '../contexts/SidebarContext';
import Navigation from './Navigation';
import AppHeader from './Header';
import TaskAuthForm from './TaskAuthForm';
import CustomOperationalReport from './CustomOperationalReport';
import LoginScreen from './LoginScreen';

const { Content } = Layout;

const App: React.FC = () => {
    const { authToken, user, isInitializing } = useContext(AuthContext);

    console.log('App: authToken:', authToken, 'user:', user, 'isInitializing:', isInitializing);

    // Show loading screen while initializing
    if (isInitializing) {
        return (
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#1890ff',
                    },
                }}
            >
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                    <div style={{ textAlign: 'center', color: '#fff' }}>
                        <h2>Loading AI Tools...</h2>
                        <p>Please wait while we restore your session</p>
                    </div>
                </div>
            </ConfigProvider>
        );
    }

    // If not authenticated, show login screen
    if (!authToken || !user) {
        return (
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#1890ff',
                    },
                }}
            >
                <LoginScreen />
            </ConfigProvider>
        );
    }

    // If authenticated, show main application
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1890ff',
                },
            }}
        >
            <HashRouter>
                <SidebarProvider>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Navigation />
                        <Layout>
                            <AppHeader />
                            <Content style={{ 
                                margin: 0, 
                                background: '#f5f5f5',
                                minHeight: 'calc(100vh - 48px)'
                            }}>
                                <Routes>
                                    <Route path="/task-text-builder" element={<TaskAuthForm />} />
                                    <Route path="/custom-report" element={<CustomOperationalReport />} />
                                    <Route path="*" element={<TaskAuthForm />} />
                                </Routes>
                            </Content>
                        </Layout>
                    </Layout>
                </SidebarProvider>
            </HashRouter>
        </ConfigProvider>
    );
};

export default App;
