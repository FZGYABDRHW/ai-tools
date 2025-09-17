"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const machines_1 = require("../machines");
const SidebarContext_1 = require("../contexts/SidebarContext");
const machines_2 = require("../machines");
const Navigation_1 = __importDefault(require("./Navigation"));
const Header_1 = __importDefault(require("./Header"));
const Breadcrumbs_1 = __importDefault(require("./Breadcrumbs"));
const TaskAuthForm_1 = __importDefault(require("./TaskAuthForm"));
const CustomOperationalReport_1 = __importDefault(require("./CustomOperationalReport"));
const ReportsPage_1 = __importDefault(require("./ReportsPage"));
const ReportLogsPage_1 = __importDefault(require("./ReportLogsPage"));
const SettingsScreen_1 = __importDefault(require("./SettingsScreen"));
const LoginScreen_1 = __importDefault(require("./LoginScreen"));
const UpdateNotification_1 = __importDefault(require("./UpdateNotification"));
const VersionDisplay_1 = __importDefault(require("./VersionDisplay"));
const MigrationModal_1 = require("./MigrationModal");
const { Content } = antd_1.Layout;
const App = () => {
    const { authToken, user, isInitializing } = (0, machines_1.useAuth)();
    const [updateVisible, setUpdateVisible] = (0, react_1.useState)(false);
    const [updateInfo, setUpdateInfo] = (0, react_1.useState)(null);
    const [downloading, setDownloading] = (0, react_1.useState)(false);
    const [downloadProgress, setDownloadProgress] = (0, react_1.useState)(0);
    const [currentVersion, setCurrentVersion] = (0, react_1.useState)('');
    const [showMigration, setShowMigration] = (0, react_1.useState)(false);
    const [migrationChecked, setMigrationChecked] = (0, react_1.useState)(false);
    const [syncAttempted, setSyncAttempted] = (0, react_1.useState)(false);
    console.log('App: authToken:', authToken, 'user:', user, 'isInitializing:', isInitializing);
    const checkMigrationStatus = async () => {
        try {
            // Check if migration has been completed
            const hasCompleted = await window.electronAPI.migration.hasCompletedMigration();
            if (!hasCompleted) {
                // Check if localStorage data exists using renderer service directly
                const { rendererMigrationService } = await Promise.resolve().then(() => __importStar(require('../services/migrationService')));
                const hasLocalStorageData = await rendererMigrationService.checkLocalStorageData();
                if (hasLocalStorageData) {
                    setShowMigration(true);
                }
            }
        }
        catch (error) {
            console.error('Error checking migration status:', error);
        }
        finally {
            setMigrationChecked(true);
        }
    };
    const handleMigrationComplete = async (success) => {
        setShowMigration(false);
        if (success) {
            console.log('Migration completed successfully');
            antd_1.message.success('Data migration completed successfully!');
            // Force sync both reports and report logs from file system to localStorage
            try {
                const { reportService, reportLogService } = await Promise.resolve().then(() => __importStar(require('../services/effects/compatibility')));
                // Sync both reports and report logs in parallel
                const [reportsSyncSuccess, reportLogsSyncSuccess] = await Promise.all([
                    reportService.forceSyncFromFileSystem(),
                    reportLogService.forceSyncFromFileSystem()
                ]);
                console.log('Reports synced from file system after migration:', reportsSyncSuccess);
                console.log('Report logs synced from file system after migration:', reportLogsSyncSuccess);
                if (reportsSyncSuccess || reportLogsSyncSuccess) {
                    // Force a page refresh to show the synced data
                    console.log('Data synced successfully after migration, refreshing page...');
                    window.location.reload();
                }
                else {
                    console.log('No sync needed after migration, continuing without reload');
                }
            }
            catch (error) {
                console.error('Failed to sync data after migration:', error);
            }
        }
    };
    (0, react_1.useEffect)(() => {
        // Get current app version
        if (window.electronAPI) {
            window.electronAPI.getAppVersion().then((version) => {
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
                const migrationCompleted = await window.electronAPI?.migration?.hasCompletedMigration();
                console.log('Migration completed on startup:', migrationCompleted);
                if (migrationCompleted) {
                    const { reportService, reportLogService } = await Promise.resolve().then(() => __importStar(require('../services/effects/compatibility')));
                    const hasReports = reportService.hasReports();
                    const hasReportLogs = reportLogService.hasReportLogs();
                    console.log('Has reports in localStorage:', hasReports);
                    console.log('Has report logs in localStorage:', hasReportLogs);
                    if (!hasReports || !hasReportLogs) {
                        console.log('Migration completed but missing data in localStorage, syncing from file system...');
                        // Sync both reports and report logs in parallel
                        const [reportsSyncSuccess, reportLogsSyncSuccess] = await Promise.all([
                            hasReports ? Promise.resolve(true) : reportService.forceSyncFromFileSystem(),
                            hasReportLogs ? Promise.resolve(true) : reportLogService.forceSyncFromFileSystem()
                        ]);
                        console.log('Reports sync success:', reportsSyncSuccess);
                        console.log('Report logs sync success:', reportLogsSyncSuccess);
                        // Only reload if sync was actually successful and we have new data
                        if (reportsSyncSuccess || reportLogsSyncSuccess) {
                            console.log('Data synced successfully, refreshing page...');
                            window.location.reload();
                        }
                        else {
                            console.log('No sync needed or sync failed, continuing without reload');
                        }
                    }
                    else {
                        console.log('Data already exists in localStorage, no sync needed');
                    }
                }
            }
            catch (error) {
                console.error('Failed to sync data on startup:', error);
            }
        };
        syncDataOnStartup();
        // Listen for auto-updater events
        if (window.electronAPI) {
            window.electronAPI.onAutoUpdaterStatus((status) => {
                console.log('Auto-updater status:', status);
                if (status.status === 'update-available') {
                    setUpdateInfo(status.data);
                    setUpdateVisible(true);
                    antd_1.message.info('🎉 New version available!', 5);
                }
                else if (status.status === 'download-progress') {
                    setDownloading(true);
                    setDownloadProgress(status.data.percent || 0);
                    // Show progress notification
                    if (status.data.percent === 100) {
                        antd_1.message.success('📥 Update download complete!', 3);
                    }
                }
                else if (status.status === 'update-downloaded') {
                    setDownloading(false);
                    setDownloadProgress(100);
                    antd_1.message.success('🎯 Update ready! The app will restart to install the update.', 5);
                }
                else if (status.status === 'checking') {
                    antd_1.message.loading('🔍 Checking for updates...', 2);
                }
                else if (status.status === 'update-not-available') {
                    antd_1.message.success('✅ You have the latest version!', 3);
                }
                else if (status.status === 'error') {
                    antd_1.message.error('❌ Update check failed. Please try again.', 5);
                }
            });
            window.electronAPI.onAutoUpdaterShowUpdateDialog((info) => {
                setUpdateInfo(info);
                setUpdateVisible(true);
            });
            window.electronAPI.onAutoUpdaterShowInstallDialog((info) => {
                antd_1.message.success('Update downloaded! The app will restart to install the update.');
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
        return ((0, jsx_runtime_1.jsx)(antd_1.ConfigProvider, { theme: {
                algorithm: antd_1.theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#ff8c69',
                },
            }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)'
                }, children: (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', color: '#333' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Loading Wowworks AI Tools..." }), (0, jsx_runtime_1.jsx)("p", { children: "Please wait while we restore your session" }), (0, jsx_runtime_1.jsx)(VersionDisplay_1.default, { compact: true, showUpdateButton: false })] }) }) }));
    }
    // If not authenticated, show login screen
    if (!authToken || !user) {
        return ((0, jsx_runtime_1.jsx)(antd_1.ConfigProvider, { theme: {
                algorithm: antd_1.theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#ff6b35',
                },
            }, children: (0, jsx_runtime_1.jsx)(LoginScreen_1.default, {}) }));
    }
    // If authenticated, show main application
    return ((0, jsx_runtime_1.jsxs)(antd_1.ConfigProvider, { theme: {
            algorithm: antd_1.theme.defaultAlgorithm,
            token: {
                colorPrimary: '#ff6b35',
            },
        }, children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.HashRouter, { children: (0, jsx_runtime_1.jsx)(SidebarContext_1.SidebarProvider, { children: (0, jsx_runtime_1.jsx)(machines_2.ReportsRegistryProvider, { children: (0, jsx_runtime_1.jsxs)(antd_1.Layout, { style: { minHeight: '100vh' }, children: [(0, jsx_runtime_1.jsx)(Navigation_1.default, {}), (0, jsx_runtime_1.jsxs)(antd_1.Layout, { style: { minHeight: '100vh' }, children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsx)(Breadcrumbs_1.default, {}), (0, jsx_runtime_1.jsx)(Content, { style: {
                                                margin: 0,
                                                background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                                                flex: 1,
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                padding: '20px'
                                            }, children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/task-text-builder", element: (0, jsx_runtime_1.jsx)(TaskAuthForm_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/reports", element: (0, jsx_runtime_1.jsx)(ReportsPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/report-logs", element: (0, jsx_runtime_1.jsx)(ReportLogsPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/custom-report", element: (0, jsx_runtime_1.jsx)(CustomOperationalReport_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/settings", element: (0, jsx_runtime_1.jsx)(SettingsScreen_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)(TaskAuthForm_1.default, {}) })] }) })] })] }) }) }) }), (0, jsx_runtime_1.jsx)(UpdateNotification_1.default, { visible: updateVisible, onClose: () => setUpdateVisible(false), updateInfo: updateInfo, downloading: downloading, downloadProgress: downloadProgress, currentVersion: currentVersion }), (0, jsx_runtime_1.jsx)(MigrationModal_1.MigrationModal, { visible: showMigration, onComplete: handleMigrationComplete })] }));
};
exports.default = App;
//# sourceMappingURL=App.js.map