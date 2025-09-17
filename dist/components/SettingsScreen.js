"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const settingsService_1 = require("../services/settingsService");
const downloadService_1 = require("../services/downloadService");
const { Title, Text } = antd_1.Typography;
const SettingsScreen = () => {
    const [form] = antd_1.Form.useForm();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [downloadModalVisible, setDownloadModalVisible] = (0, react_1.useState)(false);
    const [downloadLoading, setDownloadLoading] = (0, react_1.useState)(false);
    const [downloadOptions, setDownloadOptions] = (0, react_1.useState)({
        includeReports: true,
        includeLogs: true,
        includeCheckpoints: true,
        includeGenerationStates: true,
        includeBackups: true,
    });
    const [downloadStats, setDownloadStats] = (0, react_1.useState)({ fileCount: 0, totalSize: 0 });
    (0, react_1.useEffect)(() => {
        loadCurrentSettings();
        loadDownloadStats();
    }, []);
    (0, react_1.useEffect)(() => {
        if (downloadModalVisible) {
            loadDownloadStats();
        }
    }, [downloadModalVisible, downloadOptions]);
    const loadCurrentSettings = async () => {
        try {
            const settings = settingsService_1.settingsService.getSettings();
            form.setFieldsValue({
                openaiApiKey: settings.openaiApiKey,
                concurrencyLimit: settings.concurrencyLimit || 2
            });
        }
        catch (error) {
            console.error('Failed to load settings:', error);
            antd_1.message.error('Failed to load current settings');
        }
    };
    const handleSave = async (values) => {
        setLoading(true);
        try {
            await settingsService_1.settingsService.updateSettings(values);
            antd_1.message.success('Settings saved successfully!');
        }
        catch (error) {
            console.error('Failed to save settings:', error);
            antd_1.message.error('Failed to save settings. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleTestConnection = async () => {
        const apiKey = form.getFieldValue('openaiApiKey');
        if (!apiKey || !apiKey.trim()) {
            antd_1.message.warning('Please enter your OpenAI API key first');
            return;
        }
        setLoading(true);
        try {
            // Test the API key by making a simple request
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                antd_1.message.success('✅ API key is valid! Connection test successful.');
            }
            else {
                antd_1.message.error('❌ API key validation failed. Please check your key.');
            }
        }
        catch (error) {
            console.error('Connection test failed:', error);
            antd_1.message.error('❌ Connection test failed. Please check your internet connection.');
        }
        finally {
            setLoading(false);
        }
    };
    const loadDownloadStats = async () => {
        try {
            const stats = await downloadService_1.downloadService.getDownloadStats(downloadOptions);
            setDownloadStats(stats);
        }
        catch (error) {
            console.error('Failed to load download stats:', error);
        }
    };
    const handleDownloadAllData = async () => {
        setDownloadLoading(true);
        try {
            const result = await downloadService_1.downloadService.downloadAllData(downloadOptions);
            if (result.success) {
                antd_1.message.success(`✅ Download completed! File saved to: ${result.filePath}`);
                setDownloadModalVisible(false);
            }
            else {
                antd_1.message.error(`❌ Download failed: ${result.error}`);
            }
        }
        catch (error) {
            console.error('Download failed:', error);
            antd_1.message.error('❌ Download failed. Please try again.');
        }
        finally {
            setDownloadLoading(false);
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { maxWidth: 800, margin: '0 auto', padding: '20px' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Card, { children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(Title, { level: 2, style: { margin: 0, color: '#ff6b35' }, children: [(0, jsx_runtime_1.jsx)(icons_1.KeyOutlined, { style: { marginRight: 8 } }), "Application Settings"] }), (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "Configure your application settings and API keys" })] }), (0, jsx_runtime_1.jsx)(antd_1.Alert, { message: "OpenAI API Key Required", description: "You need to provide your OpenAI API key to use the AI features. Get your key from the OpenAI platform.", type: "info", showIcon: true, action: (0, jsx_runtime_1.jsx)(antd_1.Button, { size: "small", type: "link", href: "https://platform.openai.com/api-keys", target: "_blank", children: "Get API Key" }) }), (0, jsx_runtime_1.jsxs)(antd_1.Form, { form: form, layout: "vertical", onFinish: handleSave, initialValues: { openaiApiKey: '', concurrencyLimit: 2 }, children: [(0, jsx_runtime_1.jsx)(antd_1.Form.Item, { label: "OpenAI API Key", name: "openaiApiKey", rules: [
                                        { required: true, message: 'Please enter your OpenAI API key' },
                                        { min: 20, message: 'API key seems too short' }
                                    ], extra: "Your API key is stored locally on your device and is never shared", children: (0, jsx_runtime_1.jsx)(antd_1.Input.Password, { placeholder: "sk-...", prefix: (0, jsx_runtime_1.jsx)(icons_1.KeyOutlined, {}), iconRender: (visible) => (visible ? (0, jsx_runtime_1.jsx)(icons_1.EyeTwoTone, {}) : (0, jsx_runtime_1.jsx)(icons_1.EyeInvisibleOutlined, {})), size: "large" }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { label: "Concurrent Generations", name: "concurrencyLimit", extra: "How many reports can generate at the same time", rules: [{ type: 'number', min: 1, message: 'Minimum 1' }], children: (0, jsx_runtime_1.jsx)(antd_1.InputNumber, { min: 1, max: 10, style: { width: 200 } }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", htmlType: "submit", loading: loading, icon: (0, jsx_runtime_1.jsx)(icons_1.SaveOutlined, {}), size: "large", children: "Save Settings" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: handleTestConnection, loading: loading, size: "large", children: "Test Connection" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: loadCurrentSettings, size: "large", children: "Reset to Saved" })] }) })] }), (0, jsx_runtime_1.jsx)(antd_1.Card, { size: "small", style: { background: '#f0f8ff', border: '1px solid #1890ff' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "middle", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(Title, { level: 5, style: { margin: 0, color: '#1890ff' }, children: [(0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, { style: { marginRight: 8 } }), "Data Export"] }), (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "Download all your application data as a ZIP file for backup or migration purposes" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, children: "Available for download:" }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", children: [downloadStats.fileCount, " files (", formatFileSize(downloadStats.totalSize), ")"] })] }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, {}), onClick: () => setDownloadModalVisible(true), size: "large", children: "Download All Data" })] })] }) }), (0, jsx_runtime_1.jsxs)(antd_1.Card, { size: "small", style: { background: '#f8f9fa' }, children: [(0, jsx_runtime_1.jsx)(Title, { level: 5, style: { margin: 0, color: '#666' }, children: "Security Note" }), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: ["\u2022 Your API key is encrypted and stored locally on your device", (0, jsx_runtime_1.jsx)("br", {}), "\u2022 The key is never transmitted to our servers", (0, jsx_runtime_1.jsx)("br", {}), "\u2022 You can revoke this key at any time from your OpenAI account", (0, jsx_runtime_1.jsx)("br", {}), "\u2022 Keep your API key secure and don't share it with others"] })] })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Modal, { title: "Download All Data", open: downloadModalVisible, onCancel: () => setDownloadModalVisible(false), footer: [
                    (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => setDownloadModalVisible(false), children: "Cancel" }, "cancel"),
                    (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", loading: downloadLoading, onClick: handleDownloadAllData, icon: (0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, {}), children: "Download" }, "download"),
                ], width: 600, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Alert, { message: "Data Export Information", description: "This will create a ZIP file containing all your application data. You can use this file for backup or to migrate your data to another installation.", type: "info", showIcon: true }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Title, { level: 5, children: "Select data to include:" }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsxs)(antd_1.Checkbox, { checked: downloadOptions.includeReports, onChange: (e) => setDownloadOptions({ ...downloadOptions, includeReports: e.target.checked }), children: ["Reports (", downloadOptions.includeReports ? 'Included' : 'Excluded', ")"] }), (0, jsx_runtime_1.jsxs)(antd_1.Checkbox, { checked: downloadOptions.includeLogs, onChange: (e) => setDownloadOptions({ ...downloadOptions, includeLogs: e.target.checked }), children: ["Report Logs (", downloadOptions.includeLogs ? 'Included' : 'Excluded', ")"] }), (0, jsx_runtime_1.jsxs)(antd_1.Checkbox, { checked: downloadOptions.includeCheckpoints, onChange: (e) => setDownloadOptions({ ...downloadOptions, includeCheckpoints: e.target.checked }), children: ["Checkpoints (", downloadOptions.includeCheckpoints ? 'Included' : 'Excluded', ")"] }), (0, jsx_runtime_1.jsxs)(antd_1.Checkbox, { checked: downloadOptions.includeGenerationStates, onChange: (e) => setDownloadOptions({ ...downloadOptions, includeGenerationStates: e.target.checked }), children: ["Generation States (", downloadOptions.includeGenerationStates ? 'Included' : 'Excluded', ")"] }), (0, jsx_runtime_1.jsxs)(antd_1.Checkbox, { checked: downloadOptions.includeBackups, onChange: (e) => setDownloadOptions({ ...downloadOptions, includeBackups: e.target.checked }), children: ["Backups (", downloadOptions.includeBackups ? 'Included' : 'Excluded', ")"] })] })] }), (0, jsx_runtime_1.jsxs)(antd_1.Card, { size: "small", style: { background: '#f8f9fa' }, children: [(0, jsx_runtime_1.jsx)(Title, { level: 5, style: { margin: 0 }, children: "Download Summary" }), (0, jsx_runtime_1.jsxs)(Text, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Files to download:" }), " ", downloadStats.fileCount, (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("strong", { children: "Total size:" }), " ", formatFileSize(downloadStats.totalSize)] })] })] }) })] }));
};
exports.default = SettingsScreen;
//# sourceMappingURL=SettingsScreen.js.map