"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const compatibility_1 = require("../services/effects/compatibility");
const react_editor_1 = require("@toast-ui/react-editor");
require("@toast-ui/editor/dist/toastui-editor.css");
const { Title, Text } = antd_1.Typography;
const { Content } = antd_1.Layout;
const ReportLogViewer = ({ reportLogId, onBack }) => {
    const [reportLog, setReportLog] = (0, react_1.useState)(null);
    const [isTableFullScreen, setIsTableFullScreen] = (0, react_1.useState)(false);
    const [dynamicPageSize, setDynamicPageSize] = (0, react_1.useState)(20);
    const tableContainerRef = (0, react_1.useRef)(null);
    const markdownEditorRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (reportLogId) {
            loadReportLog(reportLogId);
        }
    }, [reportLogId]);
    (0, react_1.useEffect)(() => {
        if (markdownEditorRef.current && reportLog) {
            const editorInstance = markdownEditorRef.current.getInstance();
            editorInstance.setMarkdown(reportLog.prompt);
        }
    }, [reportLog]);
    (0, react_1.useEffect)(() => {
        const calculateDynamicPageSize = () => {
            if (tableContainerRef.current && reportLog?.tableData) {
                const containerHeight = tableContainerRef.current.clientHeight;
                const rowHeight = 55; // Approximate row height
                const headerHeight = 55; // Table header height
                const paginationHeight = 64; // Pagination height
                const availableHeight = containerHeight - headerHeight - paginationHeight;
                const calculatedPageSize = Math.max(5, Math.floor(availableHeight / rowHeight));
                setDynamicPageSize(calculatedPageSize);
            }
        };
        calculateDynamicPageSize();
        window.addEventListener('resize', calculateDynamicPageSize);
        return () => window.removeEventListener('resize', calculateDynamicPageSize);
    }, [reportLog]);
    const loadReportLog = async (id) => {
        try {
            const log = await compatibility_1.reportLogService.getReportLogByIdWithSync(id);
            if (log) {
                setReportLog(log);
            }
            else {
                antd_1.message.error('Report log not found');
                onBack?.();
            }
        }
        catch (error) {
            console.error('Error loading report log:', error);
            antd_1.message.error('Failed to load report log');
            onBack?.();
        }
    };
    const handleDownloadCSV = () => {
        if (!reportLog?.tableData)
            return;
        const blob = new Blob([reportLog.tableData.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportLog.reportName}_${reportLog.completedAt.split('T')[0]}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        antd_1.message.success('CSV downloaded successfully!');
    };
    const formatDuration = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };
    if (!reportLog) {
        return ((0, jsx_runtime_1.jsx)("div", { style: { textAlign: 'center', padding: '50px' }, children: (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "Loading report log..." }) }));
    }
    const columns = reportLog.tableData.columns.map(col => ({
        title: col,
        dataIndex: col,
        key: col,
        render: (value) => {
            if (typeof value === 'object') {
                return (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: JSON.stringify(value) });
            }
            return (0, jsx_runtime_1.jsx)(Text, { children: String(value || '') });
        },
        ellipsis: true,
    }));
    return ((0, jsx_runtime_1.jsx)(antd_1.Layout, { style: { background: 'transparent' }, children: (0, jsx_runtime_1.jsxs)(Content, { style: {
                padding: '12px',
                overflowY: 'auto'
            }, children: [(0, jsx_runtime_1.jsx)(antd_1.Card, { size: "small", style: { marginBottom: '12px' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Row, { justify: "space-between", align: "middle", children: [(0, jsx_runtime_1.jsx)(antd_1.Col, { children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", children: [(0, jsx_runtime_1.jsxs)(Title, { level: 4, style: { margin: 0 }, children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, { style: { marginRight: 6, color: '#ff8c69' } }), reportLog.reportName] }), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: ["Report Log \u2022 ", formatDate(reportLog.completedAt)] })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Col, { children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [onBack && ((0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: onBack, children: "Back to Reports" })), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, {}), onClick: handleDownloadCSV, children: "Download CSV" })] }) })] }) }), (0, jsx_runtime_1.jsxs)(antd_1.Row, { gutter: [12, 12], style: { marginBottom: '12px' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Col, { span: 8, children: (0, jsx_runtime_1.jsx)(antd_1.Card, { size: "small", children: (0, jsx_runtime_1.jsx)(antd_1.Statistic, { title: "Status", value: reportLog.status, prefix: reportLog.status === 'completed'
                                        ? (0, jsx_runtime_1.jsx)(icons_1.CheckCircleOutlined, { style: { color: '#52c41a' } })
                                        : (0, jsx_runtime_1.jsx)(icons_1.CloseCircleOutlined, { style: { color: '#ff4d4f' } }), valueStyle: {
                                        color: reportLog.status === 'completed' ? '#52c41a' : '#ff4d4f',
                                        fontSize: '14px'
                                    } }) }) }), (0, jsx_runtime_1.jsx)(antd_1.Col, { span: 8, children: (0, jsx_runtime_1.jsx)(antd_1.Card, { size: "small", children: (0, jsx_runtime_1.jsx)(antd_1.Statistic, { title: "Tasks Processed", value: `${reportLog.processedTasks}/${reportLog.totalTasks}`, prefix: (0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, {}), valueStyle: { fontSize: '14px' } }) }) }), (0, jsx_runtime_1.jsx)(antd_1.Col, { span: 8, children: (0, jsx_runtime_1.jsx)(antd_1.Card, { size: "small", children: (0, jsx_runtime_1.jsx)(antd_1.Statistic, { title: "Duration", value: reportLog.metadata?.duration ? formatDuration(reportLog.metadata.duration) : 'N/A', prefix: (0, jsx_runtime_1.jsx)(icons_1.ClockCircleOutlined, {}), valueStyle: { fontSize: '14px' } }) }) })] }), (0, jsx_runtime_1.jsx)(antd_1.Card, { style: { marginBottom: '12px' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Descriptions, { title: "Report Information", bordered: true, column: 2, children: [(0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Report Name", span: 2, children: reportLog.reportName }), (0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Generated At", children: formatDate(reportLog.generatedAt) }), (0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Completed At", children: formatDate(reportLog.completedAt) }), (0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Status", children: (0, jsx_runtime_1.jsx)(antd_1.Tag, { color: reportLog.status === 'completed' ? 'green' : 'red', children: reportLog.status.toUpperCase() }) }), (0, jsx_runtime_1.jsxs)(antd_1.Descriptions.Item, { label: "Tasks Processed", children: [reportLog.processedTasks, " / ", reportLog.totalTasks] }), reportLog.metadata?.duration && ((0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Duration", children: formatDuration(reportLog.metadata.duration) })), reportLog.metadata?.errorMessage && ((0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Error Message", span: 2, children: (0, jsx_runtime_1.jsx)(Text, { type: "danger", children: reportLog.metadata.errorMessage }) }))] }) }), (0, jsx_runtime_1.jsxs)(antd_1.Card, { style: { marginBottom: '12px' }, children: [(0, jsx_runtime_1.jsx)(Title, { level: 5, style: { marginBottom: '8px' }, children: "Report Prompt" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                background: '#f5f5f5',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid #e8e8e8',
                                minHeight: '150px',
                                overflowY: 'auto'
                            }, children: (0, jsx_runtime_1.jsx)(react_editor_1.Editor, { ref: markdownEditorRef, initialValue: "", height: "auto", initialEditType: "wysiwyg", previewStyle: "vertical", hideModeSwitch: true, toolbarItems: [], useCommandShortcut: false, viewer: true }) })] }), reportLog.extractedParameters && reportLog.extractedParameters.humanReadable.length > 0 && ((0, jsx_runtime_1.jsxs)(antd_1.Card, { style: { marginBottom: '12px' }, children: [(0, jsx_runtime_1.jsx)(Title, { level: 5, style: { marginBottom: '8px' }, children: "Extracted Parameters" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                padding: '8px 12px',
                                background: 'rgba(255, 140, 105, 0.15)',
                                borderRadius: '6px',
                                border: '2px solid rgba(255, 140, 105, 0.4)'
                            }, children: reportLog.extractedParameters.humanReadable.map((param, index) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                    color: '#333',
                                    fontSize: '12px',
                                    marginBottom: '4px',
                                    padding: '2px 0'
                                }, children: ["\u2022 ", param] }, index))) })] })), (0, jsx_runtime_1.jsx)(antd_1.Card, { title: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsxs)(Title, { level: 4, style: { margin: 0 }, children: ["Results (", reportLog.tableData.results.length, " rows)"] }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", icon: isTableFullScreen ? (0, jsx_runtime_1.jsx)(icons_1.FullscreenExitOutlined, {}) : (0, jsx_runtime_1.jsx)(icons_1.FullscreenOutlined, {}), onClick: () => setIsTableFullScreen(!isTableFullScreen) })] }), style: {
                        height: isTableFullScreen ? 'calc(100vh - 200px)' : 'auto',
                        position: isTableFullScreen ? 'fixed' : 'relative',
                        top: isTableFullScreen ? '100px' : 'auto',
                        left: isTableFullScreen ? '20px' : 'auto',
                        right: isTableFullScreen ? '20px' : 'auto',
                        zIndex: isTableFullScreen ? 1000 : 'auto'
                    }, children: (0, jsx_runtime_1.jsx)("div", { ref: tableContainerRef, style: {
                            overflowY: 'auto',
                            height: '400px',
                            minHeight: '300px'
                        }, children: (0, jsx_runtime_1.jsx)(antd_1.Table, { columns: columns, dataSource: reportLog.tableData.results.map((row, index) => ({
                                ...row,
                                key: index
                            })), pagination: {
                                pageSize: dynamicPageSize,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                size: 'small'
                            }, scroll: {
                                x: 'max-content',
                                y: isTableFullScreen ? 'calc(100vh - 300px)' : '400px'
                            }, size: "small" }) }) })] }) }));
};
exports.default = ReportLogViewer;
//# sourceMappingURL=ReportLogViewer.js.map