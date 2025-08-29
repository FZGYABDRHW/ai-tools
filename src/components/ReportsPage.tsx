import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Button, 
    Input, 
    Modal, 
    Form, 
    message, 
    Popconfirm, 
    Space, 
    Typography, 
    Tag,
    Tooltip,
    Dropdown,
    Menu
} from 'antd';
import { 
    PlusOutlined, 
    SearchOutlined, 
    DeleteOutlined, 
    FileTextOutlined
} from '@ant-design/icons';
import { Report } from '../types';
import { reportService } from '../services/reportService';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;
const { Search } = Input;

const ReportsPage: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingReport, setEditingReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        loadReports();
    }, []);

    useEffect(() => {
        filterReports();
    }, [reports, searchText]);

    const loadReports = () => {
        setLoading(true);
        try {
            const allReports = reportService.getAllReports();
            setReports(allReports);
        } catch (error) {
            message.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
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

    const handleCreateReport = async (values: { name: string }) => {
        try {
            const newReport = reportService.createReport({
                name: values.name,
                prompt: '' // Empty prompt, user will fill it in the editor
            });
            message.success('Report created successfully!');
            setIsCreateModalVisible(false);
            form.resetFields();
            loadReports();
            // Navigate to the report editor
            navigate('/custom-report', { state: { reportId: newReport.id } });
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



    const handleOpenReport = (report: Report) => {
        navigate('/custom-report', { state: { reportId: report.id } });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString() + ' ' + 
               new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Report) => (
                <div>
                    <Text 
                        strong 
                        style={{ 
                            cursor: 'pointer',
                            color: '#ff8c69'
                        }}
                        onClick={() => handleOpenReport(record)}
                    >
                        {text}
                    </Text>
                    {record.lastGeneratedAt && (
                        <Tag color="green" style={{ marginLeft: 8 }}>Generated</Tag>
                    )}
                </div>
            ),
            sorter: (a: Report, b: Report) => a.name.localeCompare(b.name),
        },
        {
            title: 'Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => <Text type="secondary">{formatDate(text)}</Text>,
            sorter: (a: Report, b: Report) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record: Report) => (
                <Popconfirm
                    title="Are you sure you want to delete this report?"
                    onConfirm={() => handleDeleteReport(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="default"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                    >
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ 
            width: '100%', 
            boxSizing: 'border-box',
            minHeight: 'calc(100vh - 96px)'
        }}>
            <div style={{ 
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #ff8c69',
                overflow: 'hidden',
                width: '100%',
                boxSizing: 'border-box',
                maxWidth: '100%'
            }}>
                {/* Header */}
                <div style={{
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
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                        <FileTextOutlined style={{ color: '#fff', fontSize: '20px', flexShrink: 0 }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <Title level={4} style={{ 
                                margin: 0, 
                                color: '#fff',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                fontSize: '18px'
                            }}>
                                Wowworks Report Management
                            </Title>
                            <Text style={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '13px'
                            }}>
                                Create, manage, and generate Wowworks operational reports
                            </Text>
                        </div>
                    </div>
                    <Button 
                        type="default"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: '#fff',
                            fontWeight: 600,
                            flexShrink: 0
                        }}
                    >
                        New Report
                    </Button>
                </div>
                
                {/* Content */}
                <div style={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <Search
                            placeholder="Search reports by name or prompt..."
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: '100%', maxWidth: '350px' }}
                            prefix={<SearchOutlined />}
                        />
                    </div>

                    <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        overflow: 'hidden',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <Table
                            columns={columns}
                            dataSource={filteredReports}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => 
                                    `${range[0]}-${range[1]} of ${total} reports`,
                            }}
                            scroll={{ x: 600 }}
                            style={{
                                background: 'transparent'
                            }}
                        />
                    </div>
                </div>
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
                width={400}
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
                width={600}
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
                            rows={6}
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


        </div>
    );
};

export default ReportsPage;
