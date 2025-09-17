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
const icons_1 = require("@ant-design/icons");
const compatibility_1 = require("../services/effects/compatibility");
const react_router_dom_1 = require("react-router-dom");
const ResumableReportsModal_1 = __importDefault(require("./ResumableReportsModal"));
const settingsService_1 = require("../services/settingsService");
const { Text, Title } = antd_1.Typography;
const { Search } = antd_1.Input;
const ReportsPage = () => {
    const [reports, setReports] = (0, react_1.useState)([]);
    const [filteredReports, setFilteredReports] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [isCreateModalVisible, setIsCreateModalVisible] = (0, react_1.useState)(false);
    const [isEditModalVisible, setIsEditModalVisible] = (0, react_1.useState)(false);
    const [editingReport, setEditingReport] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [activeGenerations, setActiveGenerations] = (0, react_1.useState)(new Map());
    const [isResumableModalVisible, setIsResumableModalVisible] = (0, react_1.useState)(false);
    const [form] = antd_1.Form.useForm();
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        loadReports();
        // Clean up any orphaned data on page load
        compatibility_1.reportService.cleanupOrphanedData().then(cleanedCount => {
            if (cleanedCount > 0) {
                console.log(`Cleaned up ${cleanedCount} orphaned data entries`);
            }
        });
    }, []);
    (0, react_1.useEffect)(() => {
        filterReports();
    }, [reports, searchText]);
    // Monitor active generations
    (0, react_1.useEffect)(() => {
        const updateActiveGenerations = () => {
            setActiveGenerations(compatibility_1.reportGenerationService.getActiveGenerations());
        };
        // Update immediately
        updateActiveGenerations();
        // Set up interval to check for updates
        const interval = setInterval(updateActiveGenerations, 1000);
        return () => clearInterval(interval);
    }, []);
    const loadReports = async () => {
        setLoading(true);
        try {
            // Use the async method that waits for sync to complete
            const allReports = await compatibility_1.reportService.getAllReportsWithSync();
            setReports(allReports);
        }
        catch (error) {
            antd_1.message.error('Failed to load reports');
        }
        finally {
            setLoading(false);
        }
    };
    const filterReports = () => {
        if (!searchText.trim()) {
            setFilteredReports(reports);
        }
        else {
            const filtered = reports.filter(report => report.name.toLowerCase().includes(searchText.toLowerCase()) ||
                report.prompt.toLowerCase().includes(searchText.toLowerCase()));
            setFilteredReports(filtered);
        }
    };
    const handleCreateReport = async (values) => {
        try {
            const newReport = await compatibility_1.reportService.createReport({
                name: values.name,
                prompt: '' // Empty prompt, user will fill it in the editor
            });
            antd_1.message.success('Report created successfully!');
            setIsCreateModalVisible(false);
            form.resetFields();
            loadReports();
            // Navigate to the report editor
            navigate(`/custom-report?reportId=${newReport.id}`, { state: { reportId: newReport.id } });
        }
        catch (error) {
            const errorMessage = error.message || 'Failed to create report';
            antd_1.message.error(errorMessage);
            console.error('Report creation error:', error);
        }
    };
    const handleEditReport = async (values) => {
        if (!editingReport)
            return;
        try {
            const updatedReport = await compatibility_1.reportService.updateReport(editingReport.id, values);
            if (updatedReport) {
                antd_1.message.success('Report updated successfully!');
                setIsEditModalVisible(false);
                setEditingReport(null);
                form.resetFields();
                loadReports();
            }
            else {
                antd_1.message.error('Report not found');
            }
        }
        catch (error) {
            antd_1.message.error('Failed to update report');
        }
    };
    const handleDeleteReport = async (reportId) => {
        // Get cleanup summary to show what will be removed
        const cleanupSummary = await compatibility_1.reportService.getCleanupSummary();
        const report = reports.find(r => r.id === reportId);
        let description = `Are you sure you want to delete "${report?.name || 'this report'}"?`;
        if (cleanupSummary.hasGenerationState || cleanupSummary.hasCheckpoint) {
            description += '\n\nThis will also clean up:';
            if (cleanupSummary.isGenerating) {
                description += '\n• Stop any ongoing generation';
            }
            if (cleanupSummary.hasGenerationState) {
                description += '\n• Remove generation state data';
            }
            if (cleanupSummary.hasCheckpoint) {
                description += `\n• Remove checkpoint data (status: ${cleanupSummary.checkpointStatus})`;
            }
            description += '\n\nNote: Report logs will be preserved.';
        }
        antd_1.Modal.confirm({
            title: 'Delete Report',
            content: description,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const success = await compatibility_1.reportService.deleteReport(reportId);
                    if (success) {
                        antd_1.message.success('Report deleted successfully!');
                        loadReports();
                    }
                    else {
                        antd_1.message.error('Report not found');
                    }
                }
                catch (error) {
                    antd_1.message.error('Failed to delete report');
                }
            }
        });
    };
    const handleOpenReport = (report) => {
        navigate(`/custom-report?reportId=${report.id}`, { state: { reportId: report.id } });
    };
    const handleViewReportLogs = (report) => {
        navigate(`/report-logs?reportId=${report.id}`, { state: { selectedReportId: report.id } });
    };
    const handleStopGeneration = (reportId) => {
        if (compatibility_1.reportGenerationService.stopGeneration(reportId)) {
            antd_1.message.success('Report generation stopped');
            loadReports(); // Refresh to update status
        }
    };
    const handleSetToPaused = (reportId) => {
        if (compatibility_1.reportGenerationService.setToPaused(reportId)) {
            antd_1.message.success('Report set to paused');
            loadReports(); // Refresh to update status
        }
    };
    const handleSetToCompleted = (reportId) => {
        if (compatibility_1.reportGenerationService.setToCompleted(reportId)) {
            antd_1.message.success('Report marked as completed');
            loadReports(); // Refresh to update status
        }
    };
    const handleResetToReady = (reportId) => {
        antd_1.Modal.confirm({
            title: 'Reset Report to Ready State',
            content: 'This will clear all generation progress and checkpoint data. The report will be ready for a fresh start. Are you sure?',
            okText: 'Reset',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: async () => {
                const ok = await compatibility_1.reportGenerationService.resetToReady(reportId);
                if (ok) {
                    antd_1.message.success('Report reset to ready state');
                    loadReports(); // Refresh to update status
                }
                else {
                    antd_1.message.error('Failed to reset report');
                }
            }
        });
    };
    const handleRerunFromCompleted = (reportId) => {
        antd_1.Modal.confirm({
            title: 'Rerun Report Generation',
            content: 'This will clear the completed state and allow new generation. Are you sure?',
            okText: 'Rerun',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: () => {
                if (compatibility_1.reportGenerationService.rerunFromCompleted(reportId)) {
                    antd_1.message.success('Report ready for rerun');
                    loadReports(); // Refresh to update status
                }
                else {
                    antd_1.message.error('Failed to prepare report for rerun');
                }
            }
        });
    };
    const handleRestartFromFailed = (reportId) => {
        antd_1.Modal.confirm({
            title: 'Restart Report Generation',
            content: 'This will clear the failed state and allow new generation. Are you sure?',
            okText: 'Restart',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: () => {
                if (compatibility_1.reportGenerationService.restartFromFailed(reportId)) {
                    antd_1.message.success('Report ready for restart');
                    loadReports(); // Refresh to update status
                }
                else {
                    antd_1.message.error('Failed to prepare report for restart');
                }
            }
        });
    };
    const handleCompleteGeneration = (reportId) => {
        antd_1.Modal.confirm({
            title: 'Complete Report Generation',
            content: 'This will stop the current generation, create a report log with current results, and reset the report to ready state. Are you sure?',
            okText: 'Complete',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Get current report data
                    const report = compatibility_1.reportService.getReportById(reportId);
                    if (!report) {
                        antd_1.message.error('Report not found');
                        return;
                    }
                    // Get current generation state and table data
                    const generationState = compatibility_1.reportGenerationService.getGenerationState(reportId);
                    const currentTableData = generationState?.tableData || report.tableData;
                    if (!currentTableData || currentTableData.results.length === 0) {
                        antd_1.message.error('No data to save to report log');
                        return;
                    }
                    // Import reportLogService
                    const { reportLogService } = await Promise.resolve().then(() => __importStar(require('../services/effects/compatibility')));
                    // Create report log with current results
                    await reportLogService.createFromReportGeneration(reportId, report.name, report.prompt, currentTableData, currentTableData.results.length, currentTableData.results.length, Date.now(), 'completed');
                    // Stop generation first if it's in progress
                    if (compatibility_1.reportGenerationService.isGenerating(reportId)) {
                        await compatibility_1.reportGenerationService.stopGeneration(reportId);
                    }
                    // Reset to ready
                    const ok = await compatibility_1.reportGenerationService.resetToReady(reportId);
                    if (ok) {
                        antd_1.message.success('Report generation completed and log created successfully!');
                        loadReports(); // Refresh to update status
                    }
                    else {
                        antd_1.message.error('Failed to reset report to ready state');
                    }
                }
                catch (error) {
                    console.error('Error completing generation:', error);
                    antd_1.message.error('Failed to complete report generation');
                }
            }
        });
    };
    const isGenerating = (reportId) => {
        return compatibility_1.reportGenerationService.isGenerating(reportId);
    };
    const getGenerationStatus = (reportId) => {
        return compatibility_1.reportGenerationService.getGenerationStatus(reportId);
    };
    const getGenerationProgress = (reportId) => {
        const state = compatibility_1.reportGenerationService.getGenerationState(reportId);
        return state?.progress;
    };
    const getStatusTag = (record) => {
        const status = getGenerationStatus(record.id);
        const progress = getGenerationProgress(record.id);
        switch (status) {
            case 'preparing':
                return ((0, jsx_runtime_1.jsx)(antd_1.Tag, { color: "cyan", style: { marginLeft: 8 }, children: "\uD83D\uDD27 Preparing..." }));
            case 'in_progress':
                return ((0, jsx_runtime_1.jsxs)(antd_1.Tag, { color: "blue", style: { marginLeft: 8 }, children: ["\uD83D\uDD04 Generating...", progress ? ` (${progress.processed}/${progress.total})` : ''] }));
            case 'paused':
                return ((0, jsx_runtime_1.jsxs)(antd_1.Tag, { color: "orange", style: { marginLeft: 8 }, children: ["\u23F8\uFE0F Paused", progress ? ` (${progress.processed} completed)` : ''] }));
            case 'failed':
                return ((0, jsx_runtime_1.jsx)(antd_1.Tag, { color: "red", style: { marginLeft: 8 }, children: "\u274C Failed" }));
            case 'completed':
                return ((0, jsx_runtime_1.jsx)(antd_1.Tag, { color: "green", style: { marginLeft: 8 }, children: "\u2705 Completed" }));
            case 'ready':
                return ((0, jsx_runtime_1.jsx)(antd_1.Tag, { color: "purple", style: { marginLeft: 8 }, children: "\uD83D\uDE80 Ready" }));
            default:
                return record.lastGeneratedAt ? ((0, jsx_runtime_1.jsx)(antd_1.Tag, { color: "green", style: { marginLeft: 8 }, children: "Generated" })) : null;
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + ' ' +
            new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const truncateText = (text, maxLength = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, style: {
                            cursor: 'pointer',
                            color: '#ff8c69'
                        }, onClick: () => handleOpenReport(record), children: text }), getStatusTag(record)] })),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: formatDate(text) }),
            sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                const status = getGenerationStatus(record.id);
                return ((0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [status === 'ready' && ((0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: !settingsService_1.settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to start generation" : "", placement: "bottom", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.PlayCircleOutlined, {}), onClick: () => handleOpenReport(record), disabled: !settingsService_1.settingsService.hasValidOpenAIKey(), children: "Start Generation" }) })), status === 'preparing' && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(antd_1.Button, { danger: true, size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.DeleteOutlined, {}), onClick: () => handleStopGeneration(record.id), children: "Stop" }) })), status === 'in_progress' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { danger: true, size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.DeleteOutlined, {}), onClick: () => handleStopGeneration(record.id), children: "Stop" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.PauseCircleOutlined, {}), onClick: () => handleSetToPaused(record.id), children: "Pause" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.CheckCircleOutlined, {}), onClick: () => handleCompleteGeneration(record.id), children: "Complete Generation" })] })), status === 'paused' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: !settingsService_1.settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to resume generation" : "", placement: "bottom", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.PlayCircleOutlined, {}), onClick: () => handleOpenReport(record), disabled: !settingsService_1.settingsService.hasValidOpenAIKey(), children: "Resume" }) }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.EditOutlined, {}), onClick: () => handleResetToReady(record.id), children: "Reset" })] })), status === 'completed' && ((0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: !settingsService_1.settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to rerun generation" : "", placement: "bottom", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}), onClick: () => handleRerunFromCompleted(record.id), disabled: !settingsService_1.settingsService.hasValidOpenAIKey(), children: "Rerun" }) })), status === 'failed' && ((0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: !settingsService_1.settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to restart generation" : "", placement: "bottom", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}), onClick: () => handleRestartFromFailed(record.id), disabled: !settingsService_1.settingsService.hasValidOpenAIKey(), children: "Restart" }) })), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.HistoryOutlined, {}), onClick: () => handleViewReportLogs(record), children: "View Logs" }), (0, jsx_runtime_1.jsx)(antd_1.Popconfirm, { title: "Are you sure you want to delete this report?", onConfirm: () => handleDeleteReport(record.id), okText: "Yes", cancelText: "No", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", danger: true, size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.DeleteOutlined, {}), children: "Delete" }) })] }));
            }
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            width: '100%',
            boxSizing: 'border-box',
            height: '100%',
            overflow: 'hidden'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #ff8c69',
                    overflow: 'hidden',
                    width: '100%',
                    boxSizing: 'border-box',
                    maxWidth: '100%'
                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                            background: 'linear-gradient(135deg, #ff8c69 0%, #ff9f7f 100%)',
                            padding: '16px 20px',
                            borderBottom: '1px solid rgba(255, 140, 105, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }, children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, { style: { color: '#fff', fontSize: '20px', flexShrink: 0 } }), (0, jsx_runtime_1.jsxs)("div", { style: { minWidth: 0, flex: 1 }, children: [(0, jsx_runtime_1.jsx)(Title, { level: 4, style: {
                                                    margin: 0,
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.5px',
                                                    fontSize: '18px'
                                                }, children: "Wowworks Report Management" }), (0, jsx_runtime_1.jsx)(Text, { style: {
                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                    fontSize: '13px'
                                                }, children: "Create, manage, and generate Wowworks operational reports" })] })] }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(() => {
                                        const resumableCount = compatibility_1.reportCheckpointService.getResumableCheckpoints().length;
                                        return resumableCount > 0 ? ((0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: !settingsService_1.settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to resume reports" : "", placement: "bottom", children: (0, jsx_runtime_1.jsxs)(antd_1.Button, { type: "default", icon: (0, jsx_runtime_1.jsx)(icons_1.PlayCircleOutlined, {}), onClick: () => setIsResumableModalVisible(true), disabled: !settingsService_1.settingsService.hasValidOpenAIKey(), style: {
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    flexShrink: 0
                                                }, children: ["Resume (", resumableCount, ")"] }) })) : null;
                                    })(), (0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: !settingsService_1.settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to create reports" : "", placement: "bottom", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", icon: (0, jsx_runtime_1.jsx)(icons_1.PlusOutlined, {}), onClick: () => setIsCreateModalVisible(true), disabled: !settingsService_1.settingsService.hasValidOpenAIKey(), style: {
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                color: '#fff',
                                                fontWeight: 600,
                                                flexShrink: 0
                                            }, children: "New Report" }) })] })] }), !settingsService_1.settingsService.hasValidOpenAIKey() && ((0, jsx_runtime_1.jsx)("div", { style: { padding: '0 20px', marginTop: '16px' }, children: (0, jsx_runtime_1.jsx)(antd_1.Alert, { message: "OpenAI API Key Required", description: (0, jsx_runtime_1.jsxs)("span", { children: ["You need to configure your OpenAI API key to use the AI report generation features.", (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "link", icon: (0, jsx_runtime_1.jsx)(icons_1.SettingOutlined, {}), style: { padding: 0, height: 'auto', marginLeft: 8 }, onClick: () => window.location.hash = '#/settings', children: "Go to Settings" })] }), type: "warning", showIcon: true, style: { marginBottom: '16px' } }) })), (0, jsx_runtime_1.jsxs)("div", { style: { padding: '20px', width: '100%', boxSizing: 'border-box' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '16px' }, children: (0, jsx_runtime_1.jsx)(Search, { placeholder: "Search reports by name or prompt...", allowClear: true, value: searchText, onChange: (e) => setSearchText(e.target.value), style: { width: '100%', maxWidth: '350px' }, prefix: (0, jsx_runtime_1.jsx)(icons_1.SearchOutlined, {}) }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                    background: '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid #f0f0f0',
                                    overflow: 'hidden',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }, children: (0, jsx_runtime_1.jsx)(antd_1.Table, { columns: columns, dataSource: filteredReports, rowKey: "id", loading: loading, pagination: {
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} reports`,
                                    }, scroll: { x: 600 }, style: {
                                        background: 'transparent'
                                    } }) })] })] }), (0, jsx_runtime_1.jsxs)(antd_1.Modal, { title: "Create New Report", open: isCreateModalVisible, onCancel: () => {
                    setIsCreateModalVisible(false);
                    form.resetFields();
                }, footer: null, width: 400, children: [!settingsService_1.settingsService.hasValidOpenAIKey() && ((0, jsx_runtime_1.jsx)(antd_1.Alert, { message: "OpenAI API Key Required", description: "You need to configure your OpenAI API key to create and generate reports.", type: "warning", showIcon: true, style: { marginBottom: '16px' }, action: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "link", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.SettingOutlined, {}), onClick: () => {
                                setIsCreateModalVisible(false);
                                window.location.hash = '#/settings';
                            }, children: "Go to Settings" }) })), (0, jsx_runtime_1.jsxs)(antd_1.Form, { form: form, layout: "vertical", onFinish: handleCreateReport, children: [(0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "name", label: "Report Name", rules: [{ required: true, message: 'Please enter a report name' }], children: (0, jsx_runtime_1.jsx)(antd_1.Input, { placeholder: "Enter report name" }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { style: { marginBottom: 0, textAlign: 'right' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => {
                                                setIsCreateModalVisible(false);
                                                form.resetFields();
                                            }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", htmlType: "submit", disabled: !settingsService_1.settingsService.hasValidOpenAIKey(), children: "Create Report" })] }) })] })] }), (0, jsx_runtime_1.jsx)(antd_1.Modal, { title: "Edit Report", open: isEditModalVisible, onCancel: () => {
                    setIsEditModalVisible(false);
                    setEditingReport(null);
                    form.resetFields();
                }, footer: null, width: 600, children: (0, jsx_runtime_1.jsxs)(antd_1.Form, { form: form, layout: "vertical", onFinish: handleEditReport, children: [(0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "name", label: "Report Name", rules: [{ required: true, message: 'Please enter a report name' }], children: (0, jsx_runtime_1.jsx)(antd_1.Input, { placeholder: "Enter report name" }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "prompt", label: "Report Prompt", rules: [{ required: true, message: 'Please enter a report prompt' }], children: (0, jsx_runtime_1.jsx)(antd_1.Input.TextArea, { placeholder: "Enter your report prompt...", rows: 6 }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { style: { marginBottom: 0, textAlign: 'right' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => {
                                            setIsEditModalVisible(false);
                                            setEditingReport(null);
                                            form.resetFields();
                                        }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", htmlType: "submit", children: "Update Report" })] }) })] }) }), (0, jsx_runtime_1.jsx)(ResumableReportsModal_1.default, { visible: isResumableModalVisible, onClose: () => setIsResumableModalVisible(false), onResume: (reportId) => {
                    navigate(`/custom-report?reportId=${reportId}`);
                } })] }));
};
exports.default = ReportsPage;
//# sourceMappingURL=ReportsPage.js.map