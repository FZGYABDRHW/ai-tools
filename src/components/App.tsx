import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, theme, message } from 'antd';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../machines';
import { SidebarProvider } from '../contexts/SidebarContext';
import { ReportsRegistryProvider } from '../machines';
import Navigation from './Navigation';
import AppHeader from './Header';
import Breadcrumbs from './Breadcrumbs';
import TaskAuthForm from './TaskAuthForm';
import CustomOperationalReport from './CustomOperationalReport';
import ReportsPage from './ReportsPage';
import ReportLogsPage from './ReportLogsPage';
import SettingsScreen from './SettingsScreen';
import LoginScreen from './LoginScreen';
import UpdateNotification from './UpdateNotification';
import VersionDisplay from './VersionDisplay';
import { MigrationModal } from './MigrationModal';

const { Content } = Layout;

const App: React.FC = () => {
    const { authToken, user, isInitializing } = useAuth();
    const [updateVisible, setUpdateVisible] = useState(false);
    const [updateInfo, setUpdateInfo] = useState<any>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [currentVersion, setCurrentVersion] = useState<string>('');
    const [showMigration, setShowMigration] = useState(false);
    const [migrationChecked, setMigrationChecked] = useState(false);

    console.log('App: authToken:', authToken, 'user:', user, 'isInitializing:', isInitializing);

    const checkMigrationStatus = async () => {
        try {
            // Check if migration has been completed
            const hasCompleted = await (window.electronAPI as any).migration.hasCompletedMigration();

            if (!hasCompleted) {
                // Check if localStorage data exists using renderer service directly
                const { rendererMigrationService } = await import('../services/migrationService');
                const hasLocalStorageData = await rendererMigrationService.checkLocalStorageData();

                if (hasLocalStorageData) {
                    setShowMigration(true);
                }
            }
        } catch (error) {
            console.error('Error checking migration status:', error);
        } finally {
            setMigrationChecked(true);
        }
    };

    const handleMigrationComplete = async (success: boolean) => {
        setShowMigration(false);
        if (success) {
            console.log('Migration completed successfully');
            message.success('Data migration completed successfully!');

            // Force sync reports from file system to localStorage
            try {
                const { reportService } = await import('../services/reportService');
                const syncSuccess = await reportService.forceSyncFromFileSystem();
                console.log('Reports synced from file system after migration:', syncSuccess);
                if (syncSuccess) {
                    // Force a page refresh to show the synced reports
                    console.log('Reports synced successfully after migration, refreshing page...');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to sync reports after migration:', error);
            }
        }
    };

    useEffect(() => {
        // Get current app version
        if (window.electronAPI) {
            window.electronAPI.getAppVersion().then((version: string) => {
                setCurrentVersion(version);
            });
        }

        // Check for migration
        checkMigrationStatus();

        // Sync reports from file system if migration was completed previously
        const syncReportsOnStartup = async () => {
            try {
                const migrationCompleted = await (window.electronAPI as any)?.migration?.hasCompletedMigration();
                console.log('Migration completed on startup:', migrationCompleted);
                if (migrationCompleted) {
                    const { reportService } = await import('../services/reportService');
                    const hasReports = reportService.hasReports();
                    console.log('Has reports in localStorage:', hasReports);
                    if (!hasReports) {
                        console.log('Migration completed but no reports in localStorage, syncing from file system...');
                        const syncSuccess = await reportService.forceSyncFromFileSystem();
                        console.log('Sync success:', syncSuccess);
                        if (syncSuccess) {
                            // Force a page refresh to show the synced reports
                            console.log('Reports synced successfully, refreshing page...');
                            window.location.reload();
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to sync reports on startup:', error);
            }
        };

        syncReportsOnStartup();

        // Listen for auto-updater events
        if (window.electronAPI) {
            window.electronAPI.onAutoUpdaterStatus((status: any) => {
                console.log('Auto-updater status:', status);

                if (status.status === 'update-available') {
                    setUpdateInfo(status.data);
                    setUpdateVisible(true);
                    message.info('🎉 New version available!', 5);
                } else if (status.status === 'download-progress') {
                    setDownloading(true);
                    setDownloadProgress(status.data.percent || 0);
                    // Show progress notification
                    if (status.data.percent === 100) {
                        message.success('📥 Update download complete!', 3);
                    }
                } else if (status.status === 'update-downloaded') {
                    setDownloading(false);
                    setDownloadProgress(100);
                    message.success('🎯 Update ready! The app will restart to install the update.', 5);
                } else if (status.status === 'checking') {
                    message.loading('🔍 Checking for updates...', 2);
                } else if (status.status === 'update-not-available') {
                    message.success('✅ You have the latest version!', 3);
                } else if (status.status === 'error') {
                    message.error('❌ Update check failed. Please try again.', 5);
                }
            });

            window.electronAPI.onAutoUpdaterShowUpdateDialog((info: any) => {
                setUpdateInfo(info);
                setUpdateVisible(true);
            });

            window.electronAPI.onAutoUpdaterShowInstallDialog((info: any) => {
                message.success('Update downloaded! The app will restart to install the update.');
            });
        }

        // Clean up listeners on unmount
        return () => {
            if (window.electronAPI) {
                window.electronAPI.removeAllListeners('auto-updater:status');
                window.electronAPI.removeAllListeners('auto-updater:show-update-dialog');
                window.electronAPI.removeAllListeners('auto-updater:show-install-dialog');
            }
        };
    }, []);

    // Show loading screen while initializing or checking migration
    if (isInitializing || !migrationChecked) {
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
                        <VersionDisplay compact showUpdateButton={false} />
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
                    <ReportsRegistryProvider>
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
                                    <Route path="/settings" element={<SettingsScreen />} />
                                    <Route path="*" element={<TaskAuthForm />} />
                                </Routes>
                            </Content>
                        </Layout>
                    </Layout>
                    </ReportsRegistryProvider>
                </SidebarProvider>
            </HashRouter>

            {/* Update Notification Modal */}
            <UpdateNotification
                visible={updateVisible}
                onClose={() => setUpdateVisible(false)}
                updateInfo={updateInfo}
                downloading={downloading}
                downloadProgress={downloadProgress}
                currentVersion={currentVersion}
            />

            {/* Migration Modal */}
            <MigrationModal
                visible={showMigration}
                onComplete={handleMigrationComplete}
            />
        </ConfigProvider>
    );
};

export default App;
