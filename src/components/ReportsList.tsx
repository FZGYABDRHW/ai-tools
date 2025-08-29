import React, { useState, useEffect } from 'react';
import { 
    Card, 
    List, 
    Button, 
    Input, 
    Modal, 
    Form, 
    message, 
    Popconfirm, 
    Space, 
    Typography, 
    Tag,
    Empty,
    Tooltip
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    PlayCircleOutlined,
    DownloadOutlined,
    UploadOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { Report } from '../types';
import { reportService } from '../services/reportService';

const { Text, Title } = Typography;
const { Search } = Input;

interface ReportsListProps {
    onSelectReport: (report: Report) => void;
    onNewReport: () => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ onSelectReport, onNewReport }) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingReport, setEditingReport] = useState<Report | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadReports();
    }, []);

    useEffect(() => {
        filterReports();
    }, [reports, searchText]);

    const loadReports = () => {
        const allReports = reportService.getAllReports();
        setReports(allReports);
    };

    const filterReports = () => {
        if (!searchText.trim()) {
            setFilteredReports(reports);
        } else {
            const filtered = reports.filter(report =>
                report.name.toLowerCase().includes(searchText.toLowerCase()) ||
                report.prompt.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredReports(filtered);
        }
    };

    const handleCreateReport = async (values: { name: string; prompt: string }) => {
        try {
            const newReport = reportService.createReport(values);
            message.success('Report created successfully!');
            setIsCreateModalVisible(false);
            form.resetFields();
            loadReports();
            onSelectReport(newReport);
        } catch (error) {
            message.error('Failed to create report');
        }
    };

    const handleEditReport = async (values: { name: string; prompt: string }) => {
        if (!editingReport) return;
        
        try {
            const updatedReport = reportService.updateReport(editingReport.id, values);
            if (updatedReport) {
                message.success('Report updated successfully!');
                setIsEditModalVisible(false);
                setEditingReport(null);
                form.resetFields();
                loadReports();
            } else {
                message.error('Report not found');
            }
        } catch (error) {
            message.error('Failed to update report');
        }
    };

    const handleDeleteReport = (reportId: string) => {
        try {
            const success = reportService.deleteReport(reportId);
            if (success) {
                message.success('Report deleted successfully!');
                loadReports();
            } else {
                message.error('Report not found');
            }
        } catch (error) {
            message.error('Failed to delete report');
        }
    };

    const handleExportReports = () => {
        try {
            const jsonData = reportService.exportReports();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ai-tools-reports-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            message.success('Reports exported successfully!');
        } catch (error) {
            message.error('Failed to export reports');
        }
    };

    const handleImportReports = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = e.target?.result as string;
                const success = reportService.importReports(jsonData);
                if (success) {
                    message.success('Reports imported successfully!');
                    loadReports();
                } else {
                    message.error('Invalid file format');
                }
            } catch (error) {
                message.error('Failed to import reports');
            }
        };
        reader.readAsText(file);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString() + ' ' + 
               new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <Card 
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>
                        <FileTextOutlined style={{ marginRight: 8 }} />
                        Saved Reports
                    </Title>
                    <Space>
                        <Tooltip title="Import Reports">
                            <Button 
                                icon={<UploadOutlined />} 
                                size="small"
                                onClick={() => document.getElementById('import-input')?.click()}
                            />
                        </Tooltip>
                        <Tooltip title="Export Reports">
                            <Button 
                                icon={<DownloadOutlined />} 
                                size="small"
                                onClick={handleExportReports}
                            />
                        </Tooltip>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setIsCreateModalVisible(true)}
                        >
                            New Report
                        </Button>
                    </Space>
                </div>
            }
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search reports..."
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
                {filteredReports.length === 0 ? (
                    <Empty 
                        description="No reports found"
                        style={{ marginTop: 60 }}
                    >
                        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                            Create Your First Report
                        </Button>
                    </Empty>
                ) : (
                    <List
                        dataSource={filteredReports}
                        renderItem={(report) => (
                            <List.Item
                                key={report.id}
                                style={{ 
                                    padding: '12px 0',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer'
                                }}
                                onClick={() => onSelectReport(report)}
                                actions={[
                                    <Tooltip title="Edit Report">
                                        <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingReport(report);
                                                form.setFieldsValue({
                                                    name: report.name,
                                                    prompt: report.prompt
                                                });
                                                setIsEditModalVisible(true);
                                            }}
                                        />
                                    </Tooltip>,
                                    <Tooltip title="Generate Report">
                                        <Button
                                            type="text"
                                            icon={<PlayCircleOutlined />}
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectReport(report);
                                            }}
                                        />
                                    </Tooltip>,
                                    <Popconfirm
                                        title="Are you sure you want to delete this report?"
                                        onConfirm={(e) => {
                                            e?.stopPropagation();
                                            handleDeleteReport(report.id);
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Tooltip title="Delete Report">
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Tooltip>
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Text strong>{report.name}</Text>
                                            {report.lastGeneratedAt && (
                                                <Tag color="green">Generated</Tag>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {truncateText(report.prompt)}
                                            </Text>
                                            <br />
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                Created: {formatDate(report.createdAt)}
                                                {report.lastGeneratedAt && (
                                                    <span> • Last generated: {formatDate(report.lastGeneratedAt)}</span>
                                                )}
                                            </Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>

            {/* Create Report Modal */}
            <Modal
                title="Create New Report"
                open={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateReport}
                >
                    <Form.Item
                        name="name"
                        label="Report Name"
                        rules={[{ required: true, message: 'Please enter a report name' }]}
                    >
                        <Input placeholder="Enter report name" />
                    </Form.Item>
                    <Form.Item
                        name="prompt"
                        label="Report Prompt"
                        rules={[{ required: true, message: 'Please enter a report prompt' }]}
                    >
                        <Input.TextArea 
                            placeholder="Enter your report prompt..."
                            rows={4}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsCreateModalVisible(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create Report
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Report Modal */}
            <Modal
                title="Edit Report"
                open={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setEditingReport(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditReport}
                >
                    <Form.Item
                        name="name"
                        label="Report Name"
                        rules={[{ required: true, message: 'Please enter a report name' }]}
                    >
                        <Input placeholder="Enter report name" />
                    </Form.Item>
                    <Form.Item
                        name="prompt"
                        label="Report Prompt"
                        rules={[{ required: true, message: 'Please enter a report prompt' }]}
                    >
                        <Input.TextArea 
                            placeholder="Enter your report prompt..."
                            rows={4}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => {
                                setIsEditModalVisible(false);
                                setEditingReport(null);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Update Report
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Hidden file input for import */}
            <input
                id="import-input"
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImportReports}
            />
        </Card>
    );
};

export default ReportsList;
