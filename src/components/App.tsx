import React, { useContext } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SidebarProvider } from '../contexts/SidebarContext';
import Navigation from './Navigation';
import AppHeader from './Header';
import Breadcrumbs from './Breadcrumbs';
import TaskAuthForm from './TaskAuthForm';
import CustomOperationalReport from './CustomOperationalReport';
import ReportsPage from './ReportsPage';
import ReportLogsPage from './ReportLogsPage';
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
                        colorPrimary: '#ff8c69',
                    },
                }}
            >
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)'
                }}>
                    <div style={{ textAlign: 'center', color: '#333' }}>
                        <h2>Loading Wowworks AI Tools...</h2>
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
                    colorPrimary: '#ff6b35',
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
                    colorPrimary: '#ff6b35',
                },
            }}
        >
            <HashRouter>
                <SidebarProvider>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Navigation />
                        <Layout style={{ minHeight: '100vh' }}>
                            <AppHeader />
                            <Breadcrumbs />
                            <Content style={{ 
                                margin: 0, 
                                background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                                flex: 1,
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '20px'
                            }}>
                                <Routes>
                                    <Route path="/task-text-builder" element={<TaskAuthForm />} />
                                    <Route path="/reports" element={<ReportsPage />} />
                                    <Route path="/report-logs" element={<ReportLogsPage />} />
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
