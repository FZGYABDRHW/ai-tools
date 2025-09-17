"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const compatibility_1 = require("../services/effects/compatibility");
const { Text, Title } = antd_1.Typography;
const { Search } = antd_1.Input;
const ReportsList = ({ onSelectReport, onNewReport }) => {
    const [reports, setReports] = (0, react_1.useState)([]);
    const [filteredReports, setFilteredReports] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [isCreateModalVisible, setIsCreateModalVisible] = (0, react_1.useState)(false);
    const [isEditModalVisible, setIsEditModalVisible] = (0, react_1.useState)(false);
    const [editingReport, setEditingReport] = (0, react_1.useState)(null);
    const [form] = antd_1.Form.useForm();
    (0, react_1.useEffect)(() => {
        loadReports();
    }, []);
    (0, react_1.useEffect)(() => {
        filterReports();
    }, [reports, searchText]);
    const loadReports = async () => {
        try {
            // Use the async method that waits for sync to complete
            const allReports = await compatibility_1.reportService.getAllReportsWithSync();
            setReports(allReports);
        }
        catch (error) {
            console.error('Failed to load reports:', error);
            // Fallback to synchronous method
            const allReports = compatibility_1.reportService.getAllReports();
            setReports(allReports);
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
            const newReport = await compatibility_1.reportService.createReport(values);
            antd_1.message.success('Report created successfully!');
            setIsCreateModalVisible(false);
            form.resetFields();
            loadReports();
            onSelectReport(newReport);
        }
        catch (error) {
            antd_1.message.error('Failed to create report');
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
    };
    const handleExportReports = () => {
        try {
            const jsonData = compatibility_1.reportService.exportReports();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ai-tools-reports-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            antd_1.message.success('Reports exported successfully!');
        }
        catch (error) {
            antd_1.message.error('Failed to export reports');
        }
    };
    const handleImportReports = (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = e.target?.result;
                const success = compatibility_1.reportService.importReports(jsonData);
                if (success) {
                    antd_1.message.success('Reports imported successfully!');
                    loadReports();
                }
                else {
                    antd_1.message.error('Invalid file format');
                }
            }
            catch (error) {
                antd_1.message.error('Failed to import reports');
            }
        };
        reader.readAsText(file);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + ' ' +
            new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const truncateText = (text, maxLength = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    return ((0, jsx_runtime_1.jsxs)(antd_1.Card, { title: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsxs)(Title, { level: 4, style: { margin: 0 }, children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, { style: { marginRight: 8 } }), "Saved Reports"] }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: "Import Reports", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { icon: (0, jsx_runtime_1.jsx)(icons_1.UploadOutlined, {}), size: "small", onClick: () => document.getElementById('import-input')?.click() }) }), (0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: "Export Reports", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { icon: (0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, {}), size: "small", onClick: handleExportReports }) }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", icon: (0, jsx_runtime_1.jsx)(icons_1.PlusOutlined, {}), onClick: () => setIsCreateModalVisible(true), children: "New Report" })] })] }), style: { height: '100%', display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { marginBottom: 16 }, children: (0, jsx_runtime_1.jsx)(Search, { placeholder: "Search reports...", allowClear: true, value: searchText, onChange: (e) => setSearchText(e.target.value), style: { width: '100%' } }) }), (0, jsx_runtime_1.jsx)("div", { style: { flex: 1, overflow: 'auto' }, children: filteredReports.length === 0 ? ((0, jsx_runtime_1.jsx)(antd_1.Empty, { description: "No reports found", style: { marginTop: 60 }, children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", onClick: () => setIsCreateModalVisible(true), children: "Create Your First Report" }) })) : ((0, jsx_runtime_1.jsx)(antd_1.List, { dataSource: filteredReports, renderItem: (report) => ((0, jsx_runtime_1.jsx)(antd_1.List.Item, { style: {
                            padding: '12px 0',
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer'
                        }, onClick: () => onSelectReport(report), actions: [
                            (0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: "Edit Report", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", icon: (0, jsx_runtime_1.jsx)(icons_1.EditOutlined, {}), size: "small", onClick: (e) => {
                                        e.stopPropagation();
                                        setEditingReport(report);
                                        form.setFieldsValue({
                                            name: report.name,
                                            prompt: report.prompt
                                        });
                                        setIsEditModalVisible(true);
                                    } }) }),
                            (0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: "Generate Report", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", icon: (0, jsx_runtime_1.jsx)(icons_1.PlayCircleOutlined, {}), size: "small", onClick: (e) => {
                                        e.stopPropagation();
                                        onSelectReport(report);
                                    } }) }),
                            (0, jsx_runtime_1.jsx)(antd_1.Popconfirm, { title: "Are you sure you want to delete this report?", onConfirm: (e) => {
                                    e?.stopPropagation();
                                    handleDeleteReport(report.id);
                                }, okText: "Yes", cancelText: "No", children: (0, jsx_runtime_1.jsx)(antd_1.Tooltip, { title: "Delete Report", children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", danger: true, icon: (0, jsx_runtime_1.jsx)(icons_1.DeleteOutlined, {}), size: "small", onClick: (e) => e.stopPropagation() }) }) })
                        ], children: (0, jsx_runtime_1.jsx)(antd_1.List.Item.Meta, { title: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, children: report.name }), report.lastGeneratedAt && ((0, jsx_runtime_1.jsx)(antd_1.Tag, { color: "green", children: "Generated" }))] }), description: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Text, { type: "secondary", style: { fontSize: '12px' }, children: truncateText(report.prompt) }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", style: { fontSize: '11px' }, children: ["Created: ", formatDate(report.createdAt), report.lastGeneratedAt && ((0, jsx_runtime_1.jsxs)("span", { children: [" \u2022 Last generated: ", formatDate(report.lastGeneratedAt)] }))] })] }) }) }, report.id)) })) }), (0, jsx_runtime_1.jsx)(antd_1.Modal, { title: "Create New Report", open: isCreateModalVisible, onCancel: () => {
                    setIsCreateModalVisible(false);
                    form.resetFields();
                }, footer: null, children: (0, jsx_runtime_1.jsxs)(antd_1.Form, { form: form, layout: "vertical", onFinish: handleCreateReport, children: [(0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "name", label: "Report Name", rules: [{ required: true, message: 'Please enter a report name' }], children: (0, jsx_runtime_1.jsx)(antd_1.Input, { placeholder: "Enter report name" }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "prompt", label: "Report Prompt", rules: [{ required: true, message: 'Please enter a report prompt' }], children: (0, jsx_runtime_1.jsx)(antd_1.Input.TextArea, { placeholder: "Enter your report prompt...", rows: 4 }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { style: { marginBottom: 0, textAlign: 'right' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => {
                                            setIsCreateModalVisible(false);
                                            form.resetFields();
                                        }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", htmlType: "submit", children: "Create Report" })] }) })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Modal, { title: "Edit Report", open: isEditModalVisible, onCancel: () => {
                    setIsEditModalVisible(false);
                    setEditingReport(null);
                    form.resetFields();
                }, footer: null, children: (0, jsx_runtime_1.jsxs)(antd_1.Form, { form: form, layout: "vertical", onFinish: handleEditReport, children: [(0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "name", label: "Report Name", rules: [{ required: true, message: 'Please enter a report name' }], children: (0, jsx_runtime_1.jsx)(antd_1.Input, { placeholder: "Enter report name" }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { name: "prompt", label: "Report Prompt", rules: [{ required: true, message: 'Please enter a report prompt' }], children: (0, jsx_runtime_1.jsx)(antd_1.Input.TextArea, { placeholder: "Enter your report prompt...", rows: 4 }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { style: { marginBottom: 0, textAlign: 'right' }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => {
                                            setIsEditModalVisible(false);
                                            setEditingReport(null);
                                            form.resetFields();
                                        }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", htmlType: "submit", children: "Update Report" })] }) })] }) }), (0, jsx_runtime_1.jsx)("input", { id: "import-input", type: "file", accept: ".json", style: { display: 'none' }, onChange: handleImportReports })] }));
};
exports.default = ReportsList;
//# sourceMappingURL=ReportsList.js.map