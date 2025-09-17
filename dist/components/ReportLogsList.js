"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const compatibility_1 = require("../services/effects/compatibility");
const { Text, Title } = antd_1.Typography;
const { Search } = antd_1.Input;
const { RangePicker } = antd_1.DatePicker;
const ReportLogsList = ({ onViewLog, selectedReportId, refreshKey }) => {
    const [reportLogs, setReportLogs] = (0, react_1.useState)([]);
    const [filteredLogs, setFilteredLogs] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    const [dateRange, setDateRange] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadReportLogs();
    }, [selectedReportId, refreshKey]);
    (0, react_1.useEffect)(() => {
        filterLogs();
    }, [reportLogs, searchText, statusFilter, dateRange]);
    const loadReportLogs = async () => {
        setLoading(true);
        try {
            let logs;
            if (selectedReportId) {
                // For specific report, get all logs first with sync, then filter
                const allLogs = await compatibility_1.reportLogService.getAllReportLogsWithSync();
                logs = allLogs.filter(log => log.reportId === selectedReportId);
            }
            else {
                // For all logs, use the sync method
                logs = await compatibility_1.reportLogService.getAllReportLogsWithSync();
            }
            setReportLogs(logs);
        }
        catch (error) {
            console.error('Failed to load report logs:', error);
            antd_1.message.error('Failed to load report logs');
        }
        finally {
            setLoading(false);
        }
    };
    const filterLogs = () => {
        let filtered = [...reportLogs];
        // Search filter
        if (searchText.trim()) {
            filtered = filtered.filter(log => log.reportName.toLowerCase().includes(searchText.toLowerCase()) ||
                log.prompt.toLowerCase().includes(searchText.toLowerCase()));
        }
        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(log => log.status === statusFilter);
        }
        // Date range filter
        if (dateRange) {
            const [startDate, endDate] = dateRange;
            filtered = filtered.filter(log => {
                const logDate = new Date(log.completedAt);
                return logDate >= new Date(startDate) && logDate <= new Date(endDate);
            });
        }
        setFilteredLogs(filtered);
    };
    const handleDeleteLog = (logId) => {
        try {
            const success = compatibility_1.reportLogService.deleteReportLog(logId);
            if (success) {
                antd_1.message.success('Report log deleted successfully');
                loadReportLogs();
            }
            else {
                antd_1.message.error('Failed to delete report log');
            }
        }
        catch (error) {
            antd_1.message.error('Failed to delete report log');
        }
    };
    const handleClearAllLogs = () => {
        try {
            compatibility_1.reportLogService.clearAllReportLogs();
            antd_1.message.success('All report logs cleared');
            loadReportLogs();
        }
        catch (error) {
            antd_1.message.error('Failed to clear report logs');
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
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
    const columns = [
        {
            title: 'Report Name',
            dataIndex: 'reportName',
            key: 'reportName',
            render: (text, record) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, style: {
                            cursor: 'pointer',
                            color: '#ff8c69'
                        }, onClick: () => onViewLog(record.id), children: text }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: [record.processedTasks, " tasks processed"] })] })),
            sorter: (a, b) => a.reportName.localeCompare(b.reportName),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => ((0, jsx_runtime_1.jsx)(antd_1.Tag, { color: status === 'completed' ? 'green' : 'red', children: status.toUpperCase() })),
            filters: [
                { text: 'Completed', value: 'completed' },
                { text: 'Failed', value: 'failed' }
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Completed At',
            dataIndex: 'completedAt',
            key: 'completedAt',
            render: (text) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Text, { children: formatDate(text) }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '12px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.CalendarOutlined, { style: { marginRight: 4 } }), new Date(text).toLocaleDateString()] })] })),
            sorter: (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (_, record) => ((0, jsx_runtime_1.jsx)(Text, { children: record.metadata?.duration ? formatDuration(record.metadata.duration) : 'N/A' })),
            sorter: (a, b) => (a.metadata?.duration || 0) - (b.metadata?.duration || 0),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => ((0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: "View Report Log", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.EyeOutlined, {}), onClick: () => onViewLog(record.id), children: "View" }) }), (0, jsx_runtime_1.jsx)(antd_1.Popconfirm, { title: "Are you sure you want to delete this report log?", onConfirm: () => handleDeleteLog(record.id), okText: "Yes", cancelText: "No", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", danger: true, size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.DeleteOutlined, {}), children: "Delete" }) })] })),
        },
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(antd_1.Card, { style: { marginBottom: '20px' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Row, { justify: "space-between", align: "middle", children: [(0, jsx_runtime_1.jsx)(antd_1.Col, { children: (0, jsx_runtime_1.jsxs)(Title, { level: 3, style: { margin: 0 }, children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, { style: { marginRight: 8, color: '#ff8c69' } }), "Report Logs", selectedReportId && ((0, jsx_runtime_1.jsx)(Text, { type: "secondary", style: { fontSize: '16px', marginLeft: 8 }, children: "(Filtered by Report)" }))] }) }), (0, jsx_runtime_1.jsx)(antd_1.Col, { children: (0, jsx_runtime_1.jsx)(antd_1.Space, { children: (0, jsx_runtime_1.jsx)(antd_1.Popconfirm, { title: "Are you sure you want to clear all report logs?", onConfirm: handleClearAllLogs, okText: "Yes", cancelText: "No", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { danger: true, children: "Clear All Logs" }) }) }) })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Card, { style: { marginBottom: '20px' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Row, { gutter: [16, 16], children: [(0, jsx_runtime_1.jsx)(antd_1.Col, { span: 8, children: (0, jsx_runtime_1.jsx)(Search, { placeholder: "Search report logs...", value: searchText, onChange: (e) => setSearchText(e.target.value), allowClear: true }) }), (0, jsx_runtime_1.jsx)(antd_1.Col, { span: 4, children: (0, jsx_runtime_1.jsxs)(antd_1.Select, { placeholder: "Status", value: statusFilter, onChange: setStatusFilter, style: { width: '100%' }, allowClear: true, children: [(0, jsx_runtime_1.jsx)(antd_1.Select.Option, { value: "all", children: "All Status" }), (0, jsx_runtime_1.jsx)(antd_1.Select.Option, { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)(antd_1.Select.Option, { value: "failed", children: "Failed" })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Col, { span: 8, children: (0, jsx_runtime_1.jsx)(RangePicker, { placeholder: ['Start Date', 'End Date'], onChange: (dates) => {
                                    if (dates) {
                                        setDateRange([
                                            dates[0]?.toISOString() || '',
                                            dates[1]?.toISOString() || ''
                                        ]);
                                    }
                                    else {
                                        setDateRange(null);
                                    }
                                }, style: { width: '100%' } }) }), (0, jsx_runtime_1.jsx)(antd_1.Col, { span: 4, children: (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", children: [filteredLogs.length, " of ", reportLogs.length, " logs"] }) })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Card, { children: (0, jsx_runtime_1.jsx)(antd_1.Table, { columns: columns, dataSource: filteredLogs, rowKey: "id", loading: loading, pagination: {
                        pageSize: 20,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} report logs`
                    }, scroll: { x: 'max-content' } }) })] }));
};
exports.default = ReportLogsList;
//# sourceMappingURL=ReportLogsList.js.map