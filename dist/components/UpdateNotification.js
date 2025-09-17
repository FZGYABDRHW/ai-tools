"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const ManualUpdateInstructions_1 = __importDefault(require("./ManualUpdateInstructions"));
const { Text, Title } = antd_1.Typography;
const UpdateNotification = ({ visible, onClose, updateInfo, downloading = false, downloadProgress = 0, currentVersion, }) => {
    const [installing, setInstalling] = (0, react_1.useState)(false);
    const [showManualInstructions, setShowManualInstructions] = (0, react_1.useState)(false);
    const [manualUpdateInfo, setManualUpdateInfo] = (0, react_1.useState)(null);
    const [downloadingToDisk, setDownloadingToDisk] = (0, react_1.useState)(false);
    const [diskDownloadProgress, setDiskDownloadProgress] = (0, react_1.useState)(0);
    const handleDownloadToDisk = async () => {
        try {
            if (!updateInfo || !window.electronAPI) {
                antd_1.message.error('Update information not available');
                return;
            }
            setDownloadingToDisk(true);
            setDiskDownloadProgress(0);
            // Set up progress listener for disk download
            const progressHandler = (status) => {
                if (status.status === 'download-progress' && status.data) {
                    setDiskDownloadProgress(status.data.percent || 0);
                }
                else if (status.status === 'download-complete') {
                    setDiskDownloadProgress(100);
                }
            };
            // Listen for progress updates
            if (window.electronAPI.onAutoUpdaterStatus) {
                window.electronAPI.onAutoUpdaterStatus(progressHandler);
            }
            const result = await window.electronAPI.downloadToDisk({
                version: updateInfo.version,
                releaseDate: updateInfo.releaseDate,
                releaseNotes: updateInfo.releaseNotes
            });
            if (result.success) {
                antd_1.message.success(result.message);
                setManualUpdateInfo(result);
                setShowManualInstructions(true);
            }
            else {
                antd_1.message.error('Failed to download update to disk');
            }
        }
        catch (error) {
            console.error('Download to disk error:', error);
            antd_1.message.error('Failed to download update to disk. Please try again.');
        }
        finally {
            setDownloadingToDisk(false);
            setDiskDownloadProgress(0);
            // Remove progress listener
            if (window.electronAPI.removeAllListeners) {
                window.electronAPI.removeAllListeners('auto-updater:status');
            }
        }
    };
    const handleInstall = () => {
        // This will be handled by the main process
        if (window.electronAPI) {
            window.electronAPI.installUpdate();
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(antd_1.Modal, { title: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, { style: { color: '#1890ff' } }), (0, jsx_runtime_1.jsx)("span", { children: "Update Available" }), currentVersion && ((0, jsx_runtime_1.jsxs)(antd_1.Tag, { color: "blue", children: ["v", currentVersion] }))] }), open: visible, onCancel: onClose, footer: null, width: 600, centered: true, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", style: { width: '100%' }, size: "large", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(Title, { level: 4, children: ["Version ", updateInfo?.version, " is available", currentVersion && ((0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '14px', marginLeft: 8 }, children: ["(Current: v", currentVersion, ")"] }))] }), updateInfo?.releaseDate && ((0, jsx_runtime_1.jsxs)(Text, { type: "secondary", children: ["Released on ", new Date(updateInfo.releaseDate).toLocaleDateString()] }))] }), updateInfo?.releaseNotes && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, children: "What's new:" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                        maxHeight: 150,
                                        overflowY: 'auto',
                                        marginTop: 8,
                                        padding: 12,
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 6,
                                        border: '1px solid #e8e8e8'
                                    }, children: (0, jsx_runtime_1.jsx)(Text, { children: updateInfo.releaseNotes }) })] })), updateInfo?.files && updateInfo.files.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, children: "Update size:" }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 4 }, children: (0, jsx_runtime_1.jsx)(antd_1.Tag, { color: "green", children: formatFileSize(updateInfo.files[0].size) }) })] })), downloading && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)(Text, { children: "Downloading update..." }), (0, jsx_runtime_1.jsx)(antd_1.Progress, { percent: Math.round(downloadProgress), status: "active", strokeColor: "#1890ff" }), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", children: [Math.round(downloadProgress), "% complete"] })] }) })), downloadingToDisk && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)(Text, { children: "Downloading to disk..." }), (0, jsx_runtime_1.jsx)(antd_1.Progress, { percent: Math.round(diskDownloadProgress), status: "active", strokeColor: "#52c41a" }), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", children: [Math.round(diskDownloadProgress), "% complete"] })] }) })), (0, jsx_runtime_1.jsx)("div", { style: {
                                padding: 12,
                                backgroundColor: '#f6ffed',
                                borderRadius: 6,
                                border: '1px solid #b7eb8f'
                            }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(icons_1.InfoCircleOutlined, { style: { color: '#52c41a' } }), (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "Updates are downloaded and installed automatically. Your data will be preserved." })] }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                padding: 12,
                                backgroundColor: '#fff7e6',
                                borderRadius: 6,
                                border: '1px solid #ffd591'
                            }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(icons_1.InfoCircleOutlined, { style: { color: '#fa8c16' } }), (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "Having issues with auto-update? Try the \"Download to Disk\" option below." })] }) }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { style: { width: '100%', justifyContent: 'flex-end' }, children: [!downloading && !installing && !downloadingToDisk && ((0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", icon: (0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, {}), onClick: handleDownloadToDisk, size: "large", style: { marginRight: 8 }, children: "Download to Disk" })), downloading && downloadProgress === 100 && ((0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.CheckCircleOutlined, {}), onClick: handleInstall, size: "large", children: "Install & Restart" })), (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: onClose, size: "large", children: downloading || downloadingToDisk ? 'Cancel' : 'Remind Me Later' })] })] }) }), (0, jsx_runtime_1.jsx)(ManualUpdateInstructions_1.default, { visible: showManualInstructions, onClose: () => setShowManualInstructions(false), version: manualUpdateInfo?.version || "", fileName: manualUpdateInfo?.fileName || "", filePath: manualUpdateInfo?.filePath || "" })] }));
};
exports.default = UpdateNotification;
//# sourceMappingURL=UpdateNotification.js.map