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
                            color: '#1890ff'
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
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: 24 
                }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>
                            <FileTextOutlined style={{ marginRight: 12 }} />
                            Custom Operational Report Management
                        </Title>
                        <Text type="secondary">
                            Create, manage, and generate custom operational reports
                        </Text>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)}
                    >
                        New Report
                    </Button>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search reports by name or prompt..."
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 400 }}
                        prefix={<SearchOutlined />}
                    />
                </div>

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
                    scroll={{ x: 1200 }}
                />
            </Card>

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
