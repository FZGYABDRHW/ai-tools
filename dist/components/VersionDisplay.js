"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const { Text } = antd_1.Typography;
const VersionDisplay = ({ className = '', showUpdateButton = true, compact = false }) => {
    const [currentVersion, setCurrentVersion] = (0, react_1.useState)('1.0.4');
    const [checkingForUpdates, setCheckingForUpdates] = (0, react_1.useState)(false);
    const [updateAvailable, setUpdateAvailable] = (0, react_1.useState)(false);
    const [lastChecked, setLastChecked] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        console.log('VersionDisplay: Component mounted');
        console.log('VersionDisplay: window.electronAPI available?', !!window.electronAPI);
        // Get current app version
        if (window.electronAPI) {
            console.log('VersionDisplay: Getting app version...');
            window.electronAPI.getAppVersion()
                .then((version) => {
                console.log('VersionDisplay: Got version:', version);
                setCurrentVersion(version);
            })
                .catch((err) => {
                console.error('VersionDisplay: Error getting version:', err);
                setError('Failed to get version');
                // Keep the default version
            });
        }
        else {
            console.log('VersionDisplay: electronAPI not available, using default version');
        }
        // Set up auto-updater event listeners
        if (window.electronAPI) {
            window.electronAPI.onAutoUpdaterStatus((status) => {
                console.log('VersionDisplay: Auto-updater status:', status);
                if (status.status === 'checking') {
                    setCheckingForUpdates(true);
                }
                else if (status.status === 'update-available') {
                    setUpdateAvailable(true);
                    setCheckingForUpdates(false);
                }
                else if (status.status === 'update-not-available') {
                    setUpdateAvailable(false);
                    setCheckingForUpdates(false);
                    setLastChecked(new Date());
                }
                else if (status.status === 'error') {
                    setCheckingForUpdates(false);
                }
            });
        }
        // Clean up listeners on unmount
        return () => {
            if (window.electronAPI) {
                window.electronAPI.removeAllListeners('auto-updater:status');
            }
        };
    }, []);
    const handleCheckForUpdates = async () => {
        console.log('🔍 VersionDisplay: Check for updates button clicked!');
        console.log('🔍 VersionDisplay: window.electronAPI available?', !!window.electronAPI);
        if (!window.electronAPI) {
            console.error('❌ VersionDisplay: electronAPI not available!');
            antd_1.message.error('Electron API not available');
            return;
        }
        try {
            console.log('🔍 VersionDisplay: Calling checkForUpdates...');
            setCheckingForUpdates(true);
            const result = await window.electronAPI.checkForUpdates();
            console.log('🔍 VersionDisplay: checkForUpdates result:', result);
            antd_1.message.success('Update check completed');
        }
        catch (error) {
            console.error('❌ VersionDisplay: Error checking for updates:', error);
            antd_1.message.error('Failed to check for updates: ' + error?.message || 'Unknown error');
        }
        finally {
            setCheckingForUpdates(false); // Always reset the loading state
        }
    };
    const handleForceCheckForUpdates = async () => {
        console.log('🔄 VersionDisplay: Force check for updates button clicked!');
        console.log('🔄 VersionDisplay: window.electronAPI available?', !!window.electronAPI);
        if (!window.electronAPI) {
            console.error('❌ VersionDisplay: electronAPI not available!');
            antd_1.message.error('Electron API not available');
            return;
        }
        try {
            console.log('🔄 VersionDisplay: Calling forceCheckForUpdates...');
            setCheckingForUpdates(true);
            const result = await window.electronAPI.forceCheckForUpdates();
            console.log('🔄 VersionDisplay: forceCheckForUpdates result:', result);
            antd_1.message.success('Force update check completed');
        }
        catch (error) {
            console.error('❌ VersionDisplay: Error in force update check:', error);
            antd_1.message.error('Force update check failed: ' + error?.message || 'Unknown error');
        }
        finally {
            setCheckingForUpdates(false); // Always reset the loading state
        }
    };
    const handleTestIpc = async () => {
        console.log('🧪 VersionDisplay: Test IPC button clicked!');
        console.log('🧪 VersionDisplay: window.electronAPI available?', !!window.electronAPI);
        if (!window.electronAPI) {
            console.error('❌ VersionDisplay: electronAPI not available!');
            antd_1.message.error('Electron API not available');
            return;
        }
        // Debug: Log all available methods
        console.log('🧪 VersionDisplay: Available electronAPI methods:', Object.keys(window.electronAPI));
        try {
            console.log('🧪 VersionDisplay: Calling testIpc...');
            const result = await window.electronAPI.testIpc();
            console.log('🧪 VersionDisplay: testIpc result:', result);
            antd_1.message.success('IPC test successful: ' + result.message);
        }
        catch (error) {
            console.error('❌ VersionDisplay: Test IPC error:', error);
            antd_1.message.error('IPC test failed: ' + error?.message || 'Unknown error');
        }
    };
    const handleDebugElectronAPI = () => {
        console.log('🔍 VersionDisplay: Debug button clicked!');
        console.log('🔍 VersionDisplay: window object:', window);
        console.log('🔍 VersionDisplay: window.electronAPI:', window.electronAPI);
        if (window.electronAPI) {
            console.log('🔍 VersionDisplay: Available methods:', Object.keys(window.electronAPI));
            console.log('🔍 VersionDisplay: getAppVersion method:', typeof window.electronAPI.getAppVersion);
            console.log('🔍 VersionDisplay: checkForUpdates method:', typeof window.electronAPI.checkForUpdates);
        }
        else {
            console.error('❌ VersionDisplay: electronAPI is undefined!');
            antd_1.message.error('electronAPI is undefined - check preload script');
        }
    };
    const handleDownloadLatestVersion = async () => {
        console.log('📥 VersionDisplay: Download latest version button clicked!');
        console.log('📥 VersionDisplay: window.electronAPI available?', !!window.electronAPI);
        if (!window.electronAPI) {
            console.error('❌ VersionDisplay: electronAPI not available!');
            antd_1.message.error('Electron API not available');
            return;
        }
        try {
            console.log('📥 VersionDisplay: Calling downloadLatestVersion...');
            setCheckingForUpdates(true);
            const result = await window.electronAPI.downloadLatestVersion();
            console.log('📥 VersionDisplay: downloadLatestVersion result:', result);
            if (result.updateAvailable) {
                antd_1.message.success(result.message);
            }
            else {
                antd_1.message.info(result.message);
            }
        }
        catch (error) {
            console.error('❌ VersionDisplay: Error downloading latest version:', error);
            antd_1.message.error('Failed to download latest version: ' + error?.message || 'Unknown error');
        }
        finally {
            setCheckingForUpdates(false);
        }
    };
    // Context menu items for update options
    const updateMenuItems = [
        {
            key: 'check',
            label: 'Check for Updates',
            icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}),
            onClick: handleCheckForUpdates,
        },
        {
            key: 'force-check',
            label: 'Force Check (Ignore Cache)',
            icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}),
            onClick: handleForceCheckForUpdates,
        },
        {
            key: 'test-ipc',
            label: 'Test IPC Communication',
            icon: (0, jsx_runtime_1.jsx)(icons_1.InfoCircleOutlined, {}),
            onClick: handleTestIpc,
        },
        {
            key: 'download-latest',
            label: 'Download Latest Version',
            icon: (0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, {}),
            onClick: handleDownloadLatestVersion,
        },
        {
            key: 'debug',
            label: 'Debug Electron API',
            icon: (0, jsx_runtime_1.jsx)(icons_1.InfoCircleOutlined, {}),
            onClick: handleDebugElectronAPI,
        },
        {
            key: 'info',
            label: 'Update Info',
            icon: (0, jsx_runtime_1.jsx)(icons_1.InfoCircleOutlined, {}),
            disabled: true,
        },
    ];
    // Always show version
    if (compact) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: className, style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 140, 105, 0.1)',
                border: '1px solid rgba(255, 140, 105, 0.3)',
                width: '130px',
                flexShrink: 0,
                flexGrow: 0,
                boxSizing: 'border-box',
                overflow: 'hidden'
            }, children: [(0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px', color: '#ff8c69', fontWeight: 500 }, children: ["v", currentVersion] }), showUpdateButton && ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '4px' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: "Check for updates", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}), loading: checkingForUpdates, onClick: handleCheckForUpdates, style: {
                                    padding: '2px 4px',
                                    height: 'auto',
                                    color: '#ff8c69',
                                    fontSize: '10px'
                                } }) }), (0, jsx_runtime_1.jsx)(antd_1.Dropdown, { menu: { items: updateMenuItems }, trigger: ['click'], children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.MoreOutlined, {}), style: {
                                    padding: '2px 4px',
                                    height: 'auto',
                                    color: '#ff8c69',
                                    fontSize: '10px'
                                } }) })] }))] }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: className, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, children: "Version:" }), (0, jsx_runtime_1.jsx)(antd_1.Badge, { count: updateAvailable ? 'Update Available' : undefined, color: "green", style: {
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '10px'
                            }, children: (0, jsx_runtime_1.jsxs)(Text, { code: true, style: { fontSize: '14px' }, children: ["v", currentVersion] }) })] }), lastChecked && ((0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: ["Last checked: ", lastChecked.toLocaleTimeString()] })), showUpdateButton && ((0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}), loading: checkingForUpdates, onClick: handleCheckForUpdates, children: checkingForUpdates ? 'Checking...' : 'Check for Updates' }), updateAvailable && ((0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, {}), children: "Update Available" }))] }))] }) }));
};
exports.default = VersionDisplay;
//# sourceMappingURL=VersionDisplay.js.map