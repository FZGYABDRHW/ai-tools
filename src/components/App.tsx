import * as effectsApi from '../services/effects/api';
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
    const [syncAttempted, setSyncAttempted] = useState(false);

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

            // Force sync both reports and report logs from file system to localStorage
            try {
                // Sync both reports and report logs in parallel
                const [reportsSyncSuccess, reportLogsSyncSuccess] = await Promise.all([
                    effectsApi.forceSyncFromFileSystemReports(),
                    effectsApi.forceSyncFromFileSystemLogs()
                ]);

                console.log('Reports synced from file system after migration:', reportsSyncSuccess);
                console.log('Report logs synced from file system after migration:', reportLogsSyncSuccess);

                if (reportsSyncSuccess || reportLogsSyncSuccess) {
                    console.log('Data synced successfully after migration');
                    // No reload; UI reads from file system on demand
                } else {
                    console.log('No sync needed after migration, continuing without reload');
                }
            } catch (error) {
                console.error('Failed to sync data after migration:', error);
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

        // Sync reports and report logs from file system if migration was completed previously
        const syncDataOnStartup = async () => {
            // Prevent infinite reload by checking if we've already attempted sync
            if (syncAttempted) {
                console.log('Sync already attempted, skipping to prevent infinite reload');
                return;
            }

            try {
                setSyncAttempted(true);
                const migrationCompleted = await (window.electronAPI as any)?.migration?.hasCompletedMigration();
                console.log('Migration completed on startup:', migrationCompleted);
                if (migrationCompleted) {
                    // compatibility removed; using effectsApi only

                    const hasReports = await effectsApi.hasReports();
                    const hasReportLogs = await effectsApi.hasReportLogs();
                    console.log('Has reports in localStorage:', hasReports);
                    console.log('Has report logs in localStorage:', hasReportLogs);

                    if (!hasReports || !hasReportLogs) {
                        console.log('Migration completed but missing data in localStorage, syncing from file system...');

                        // Sync both reports and report logs in parallel
                        const [reportsSyncSuccess, reportLogsSyncSuccess] = await Promise.all([
                            hasReports ? Promise.resolve(true) : effectsApi.forceSyncFromFileSystemReports(),
                            hasReportLogs ? Promise.resolve(true) : effectsApi.forceSyncFromFileSystemLogs()
                        ]);

                        console.log('Reports sync success:', reportsSyncSuccess);
                        console.log('Report logs sync success:', reportLogsSyncSuccess);

                        // Only reload if sync was actually successful and we have new data
                        if (reportsSyncSuccess || reportLogsSyncSuccess) {
                            console.log('Data synced successfully, continuing without reload');
                        } else {
                            console.log('No sync needed or sync failed, continuing without reload');
                        }
                    } else {
                        console.log('Data already exists in localStorage, no sync needed');
                    }
                }
            } catch (error) {
                console.error('Failed to sync data on startup:', error);
            }
        };

        syncDataOnStartup();

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
