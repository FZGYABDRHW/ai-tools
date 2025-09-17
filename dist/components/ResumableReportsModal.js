"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const compatibility_1 = require("../services/effects/compatibility");
const { Text, Title } = antd_1.Typography;
const ResumableReportsModal = ({ visible, onClose, onResume }) => {
    const resumableCheckpoints = compatibility_1.reportCheckpointService.getResumableCheckpoints();
    const formatDuration = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    };
    const formatTimeAgo = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days > 0)
            return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0)
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0)
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };
    const handleResume = (checkpoint) => {
        onResume(checkpoint.reportId);
        onClose();
    };
    const handleClear = (reportId) => {
        compatibility_1.reportCheckpointService.clearCheckpoint(reportId);
        // Force re-render
        window.location.reload();
    };
    return ((0, jsx_runtime_1.jsx)(antd_1.Modal, { title: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, {}), (0, jsx_runtime_1.jsx)("span", { children: "Resumable Reports" }), resumableCheckpoints.length > 0 && ((0, jsx_runtime_1.jsx)(antd_1.Tag, { color: "blue", children: resumableCheckpoints.length }))] }), open: visible, onCancel: onClose, footer: null, width: 600, children: resumableCheckpoints.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', padding: '40px 20px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, { style: { fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' } }), (0, jsx_runtime_1.jsx)(Title, { level: 4, style: { color: '#666' }, children: "No Resumable Reports" }), (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "All reports have been completed or there are no interrupted generations." })] })) : ((0, jsx_runtime_1.jsx)(antd_1.List, { dataSource: resumableCheckpoints, renderItem: (checkpoint) => {
                const report = compatibility_1.reportService.getReportById(checkpoint.reportId);
                const progressPercentage = compatibility_1.reportCheckpointService.getProgressPercentage(checkpoint.reportId);
                const estimatedTimeRemaining = compatibility_1.reportCheckpointService.getEstimatedTimeRemaining(checkpoint.reportId);
                return ((0, jsx_runtime_1.jsxs)(antd_1.List.Item, { actions: [
                        (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.PlayCircleOutlined, {}), onClick: () => handleResume(checkpoint), children: "Resume" }),
                        (0, jsx_runtime_1.jsx)(antd_1.Button, { danger: true, size: "small", onClick: () => handleClear(checkpoint.reportId), children: "Clear" })
                    ], children: [(0, jsx_runtime_1.jsx)(antd_1.List.Item.Meta, { title: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, children: report?.name || 'Custom Report' }), (0, jsx_runtime_1.jsx)(antd_1.Tag, { color: checkpoint.status === 'in_progress' ? 'blue' : 'orange', children: checkpoint.status === 'in_progress' ? 'In Progress' : 'Paused' })] }), description: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: [checkpoint.prompt.substring(0, 100), "..."] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(antd_1.Space, { style: { marginTop: '8px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.ClockCircleOutlined, { style: { color: '#666' } }), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: ["Started ", formatTimeAgo(checkpoint.startTime)] }), checkpoint.lastCheckpointTime !== checkpoint.startTime && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Text, { type: "secondary", style: { fontSize: '12px' }, children: "\u2022" }), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: ["Last update ", formatTimeAgo(checkpoint.lastCheckpointTime)] })] }))] })] }) }), (0, jsx_runtime_1.jsxs)("div", { style: { width: '200px' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '8px' }, children: (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: ["Progress: ", checkpoint.currentTaskIndex, "/", checkpoint.totalTasks, " tasks"] }) }), (0, jsx_runtime_1.jsx)(antd_1.Progress, { percent: progressPercentage, size: "small", status: checkpoint.status === 'in_progress' ? 'active' : 'normal' }), estimatedTimeRemaining > 0 && ((0, jsx_runtime_1.jsx)("div", { style: { marginTop: '4px' }, children: (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '11px' }, children: ["~", formatDuration(estimatedTimeRemaining), " remaining"] }) }))] })] }));
            } })) }));
};
exports.default = ResumableReportsModal;
//# sourceMappingURL=ResumableReportsModal.js.map