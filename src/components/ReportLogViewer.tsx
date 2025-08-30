import React, { useState, useEffect, useRef } from 'react';
import { 
    Card, 
    Typography, 
    Table, 
    Button, 
    Space, 
    Divider, 
    Layout, 
    Row, 
    Col, 
    Tag,
    Descriptions,
    Statistic,
    Tooltip,
    message
} from 'antd';
import { 
    DownloadOutlined, 
    FullscreenOutlined, 
    FullscreenExitOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { ReportLog } from '../types';
import { reportLogService } from '../services/reportLogService';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const { Title, Text } = Typography;
const { Content } = Layout;

interface ReportLogViewerProps {
    reportLogId?: string;
    onBack?: () => void;
}

const ReportLogViewer: React.FC<ReportLogViewerProps> = ({ reportLogId, onBack }) => {
    const [reportLog, setReportLog] = useState<ReportLog | null>(null);
    const [isTableFullScreen, setIsTableFullScreen] = useState<boolean>(false);
    const [dynamicPageSize, setDynamicPageSize] = useState<number>(20);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const markdownEditorRef = useRef<Editor>(null);

    useEffect(() => {
        if (reportLogId) {
            loadReportLog(reportLogId);
        }
    }, [reportLogId]);

    useEffect(() => {
        if (markdownEditorRef.current && reportLog) {
            const editorInstance = markdownEditorRef.current.getInstance();
            editorInstance.setMarkdown(reportLog.prompt);
        }
    }, [reportLog]);



    useEffect(() => {
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

    const loadReportLog = (id: string) => {
        const log = reportLogService.getReportLogById(id);
        if (log) {
            setReportLog(log);
        } else {
            message.error('Report log not found');
            onBack?.();
        }
    };

    const handleDownloadCSV = () => {
        if (!reportLog?.tableData) return;
        
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
        message.success('CSV downloaded successfully!');
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

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString();
    };

    if (!reportLog) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text type="secondary">Loading report log...</Text>
            </div>
        );
    }

    const columns = reportLog.tableData.columns.map(col => ({
        title: col,
        dataIndex: col,
        key: col,
        render: (value: any) => {
            if (typeof value === 'object') {
                return <Text type="secondary">{JSON.stringify(value)}</Text>;
            }
            return <Text>{String(value || '')}</Text>;
        },
        ellipsis: true,
    }));

    return (
        <Layout style={{ background: 'transparent' }}>
            <Content style={{ 
                padding: '12px',
                overflowY: 'auto'
            }}>
                {/* Header */}
                <Card size="small" style={{ marginBottom: '12px' }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space direction="vertical" size="small">
                                <Title level={4} style={{ margin: 0 }}>
                                    <FileTextOutlined style={{ marginRight: 6, color: '#ff8c69' }} />
                                    {reportLog.reportName}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Report Log • {formatDate(reportLog.completedAt)}
                                </Text>
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                {onBack && (
                                    <Button onClick={onBack}>
                                        Back to Reports
                                    </Button>
                                )}
                                <Button 
                                    type="primary" 
                                    icon={<DownloadOutlined />}
                                    onClick={handleDownloadCSV}
                                >
                                    Download CSV
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Report Log Details */}
                <Row gutter={[12, 12]} style={{ marginBottom: '12px' }}>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic
                                title="Status"
                                value={reportLog.status}
                                prefix={
                                    reportLog.status === 'completed' 
                                        ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                        : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                }
                                valueStyle={{ 
                                    color: reportLog.status === 'completed' ? '#52c41a' : '#ff4d4f',
                                    fontSize: '14px'
                                }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic
                                title="Tasks Processed"
                                value={`${reportLog.processedTasks}/${reportLog.totalTasks}`}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ fontSize: '14px' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card size="small">
                            <Statistic
                                title="Duration"
                                value={reportLog.metadata?.duration ? formatDuration(reportLog.metadata.duration) : 'N/A'}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ fontSize: '14px' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Report Information */}
                <Card style={{ marginBottom: '12px' }}>
                    <Descriptions title="Report Information" bordered column={2}>
                        <Descriptions.Item label="Report Name" span={2}>
                            {reportLog.reportName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Generated At">
                            {formatDate(reportLog.generatedAt)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Completed At">
                            {formatDate(reportLog.completedAt)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={reportLog.status === 'completed' ? 'green' : 'red'}>
                                {reportLog.status.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tasks Processed">
                            {reportLog.processedTasks} / {reportLog.totalTasks}
                        </Descriptions.Item>
                        {reportLog.metadata?.duration && (
                            <Descriptions.Item label="Duration">
                                {formatDuration(reportLog.metadata.duration)}
                            </Descriptions.Item>
                        )}
                        {reportLog.metadata?.errorMessage && (
                            <Descriptions.Item label="Error Message" span={2}>
                                <Text type="danger">{reportLog.metadata.errorMessage}</Text>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>

                {/* Prompt */}
                <Card style={{ marginBottom: '12px' }}>
                    <Title level={5} style={{ marginBottom: '8px' }}>Report Prompt</Title>
                    <div style={{ 
                        background: '#f5f5f5', 
                        padding: '12px', 
                        borderRadius: '6px',
                        border: '1px solid #e8e8e8',
                        minHeight: '150px',
                        overflowY: 'auto'
                    }}>
                        <Editor
                            ref={markdownEditorRef}
                            initialValue=""
                            height="auto"
                            initialEditType="wysiwyg"
                            previewStyle="vertical"
                            hideModeSwitch={true}
                            toolbarItems={[]}
                            useCommandShortcut={false}
                            viewer={true}
                        />
                    </div>
                </Card>

                {/* Results Table */}
                <Card 
                    title={
                        <Space>
                            <Title level={4} style={{ margin: 0 }}>
                                Results ({reportLog.tableData.results.length} rows)
                            </Title>
                            <Button
                                type="text"
                                icon={isTableFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                                onClick={() => setIsTableFullScreen(!isTableFullScreen)}
                            />
                        </Space>
                    }
                    style={{ 
                        height: isTableFullScreen ? 'calc(100vh - 200px)' : 'auto',
                        position: isTableFullScreen ? 'fixed' : 'relative',
                        top: isTableFullScreen ? '100px' : 'auto',
                        left: isTableFullScreen ? '20px' : 'auto',
                        right: isTableFullScreen ? '20px' : 'auto',
                        zIndex: isTableFullScreen ? 1000 : 'auto'
                    }}
                >
                    <div ref={tableContainerRef} style={{ 
                        overflowY: 'auto',
                        height: '400px',
                        minHeight: '300px'
                    }}>
                        <Table
                            columns={columns}
                            dataSource={reportLog.tableData.results.map((row, index) => ({
                                ...row,
                                key: index
                            }))}
                            pagination={{
                                pageSize: dynamicPageSize,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => 
                                    `${range[0]}-${range[1]} of ${total} items`,
                                size: 'small'
                            }}
                            scroll={{ 
                                x: 'max-content',
                                y: isTableFullScreen ? 'calc(100vh - 300px)' : '400px'
                            }}
                            size="small"
                        />
                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default ReportLogViewer;
