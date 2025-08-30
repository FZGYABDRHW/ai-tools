import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Button, 
    Input, 
    Space, 
    Typography, 
    Tag,
    Tooltip,
    Popconfirm,
    message,
    Select,
    DatePicker,
    Row,
    Col
} from 'antd';
import { 
    SearchOutlined, 
    DeleteOutlined, 
    EyeOutlined,
    FileTextOutlined,
    CalendarOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { ReportLog } from '../types';
import { reportLogService } from '../services/reportLogService';

const { Text, Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface ReportLogsListProps {
    onViewLog: (logId: string) => void;
    selectedReportId?: string;
    refreshKey?: number; // Add refresh key to force refresh
}

const ReportLogsList: React.FC<ReportLogsListProps> = ({ onViewLog, selectedReportId, refreshKey }) => {
    const [reportLogs, setReportLogs] = useState<ReportLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<ReportLog[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadReportLogs();
    }, [selectedReportId, refreshKey]);

    useEffect(() => {
        filterLogs();
    }, [reportLogs, searchText, statusFilter, dateRange]);

    const loadReportLogs = () => {
        setLoading(true);
        try {
            let logs: ReportLog[];
            if (selectedReportId) {
                logs = reportLogService.getReportLogsByReportId(selectedReportId);
            } else {
                logs = reportLogService.getAllReportLogs();
            }
            setReportLogs(logs);
        } catch (error) {
            message.error('Failed to load report logs');
        } finally {
            setLoading(false);
        }
    };

    const filterLogs = () => {
        let filtered = [...reportLogs];

        // Search filter
        if (searchText.trim()) {
            filtered = filtered.filter(log =>
                log.reportName.toLowerCase().includes(searchText.toLowerCase()) ||
                log.prompt.toLowerCase().includes(searchText.toLowerCase())
            );
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

    const handleDeleteLog = (logId: string) => {
        try {
            const success = reportLogService.deleteReportLog(logId);
            if (success) {
                message.success('Report log deleted successfully');
                loadReportLogs();
            } else {
                message.error('Failed to delete report log');
            }
        } catch (error) {
            message.error('Failed to delete report log');
        }
    };

    const handleClearAllLogs = () => {
        try {
            reportLogService.clearAllReportLogs();
            message.success('All report logs cleared');
            loadReportLogs();
        } catch (error) {
            message.error('Failed to clear report logs');
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString();
    };

    const formatDuration = (milliseconds: number): string => {
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
            render: (text: string, record: ReportLog) => (
                <div>
                    <Text 
                        strong 
                        style={{ 
                            cursor: 'pointer',
                            color: '#ff8c69'
                        }}
                        onClick={() => onViewLog(record.id)}
                    >
                        {text}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.processedTasks} tasks processed
                    </Text>
                </div>
            ),
            sorter: (a: ReportLog, b: ReportLog) => a.reportName.localeCompare(b.reportName),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'completed' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Completed', value: 'completed' },
                { text: 'Failed', value: 'failed' }
            ],
            onFilter: (value: string, record: ReportLog) => record.status === value,
        },
        {
            title: 'Completed At',
            dataIndex: 'completedAt',
            key: 'completedAt',
            render: (text: string) => (
                <div>
                    <Text>{formatDate(text)}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {new Date(text).toLocaleDateString()}
                    </Text>
                </div>
            ),
            sorter: (a: ReportLog, b: ReportLog) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
            defaultSortOrder: 'descend' as const,
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (_, record: ReportLog) => (
                <Text>
                    {record.metadata?.duration ? formatDuration(record.metadata.duration) : 'N/A'}
                </Text>
            ),
            sorter: (a: ReportLog, b: ReportLog) => 
                (a.metadata?.duration || 0) - (b.metadata?.duration || 0),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record: ReportLog) => (
                <Space>
                    <Tooltip title="View Report Log">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => onViewLog(record.id)}
                        >
                            View
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure you want to delete this report log?"
                        onConfirm={() => handleDeleteLog(record.id)}
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
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <Card style={{ marginBottom: '20px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            <FileTextOutlined style={{ marginRight: 8, color: '#ff8c69' }} />
                            Report Logs
                            {selectedReportId && (
                                <Text type="secondary" style={{ fontSize: '16px', marginLeft: 8 }}>
                                    (Filtered by Report)
                                </Text>
                            )}
                        </Title>
                    </Col>
                    <Col>
                        <Space>
                            <Popconfirm
                                title="Are you sure you want to clear all report logs?"
                                onConfirm={handleClearAllLogs}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger>
                                    Clear All Logs
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Filters */}
            <Card style={{ marginBottom: '20px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Search
                            placeholder="Search report logs..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Select.Option value="all">All Status</Select.Option>
                            <Select.Option value="completed">Completed</Select.Option>
                            <Select.Option value="failed">Failed</Select.Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <RangePicker
                            placeholder={['Start Date', 'End Date']}
                            onChange={(dates) => {
                                if (dates) {
                                    setDateRange([
                                        dates[0]?.toISOString() || '',
                                        dates[1]?.toISOString() || ''
                                    ]);
                                } else {
                                    setDateRange(null);
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={4}>
                        <Text type="secondary">
                            {filteredLogs.length} of {reportLogs.length} logs
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredLogs}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} report logs`
                    }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
        </div>
    );
};

export default ReportLogsList;
