import React, { useState, useEffect } from 'react';
import {
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
    Alert
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined,
    FileTextOutlined,
    HistoryOutlined,
    PlayCircleOutlined,
    EditOutlined,
    PauseCircleOutlined,
    CheckCircleOutlined,
    ReloadOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Report } from '../types';
import * as effectsApi from '../services/effects/api';
import { useNavigate } from 'react-router-dom';
import ResumableReportsModal from './ResumableReportsModal';
import { settingsService } from '../services/settingsService';

const { Text, Title } = Typography;
const { Search } = Input;

const StatusTag: React.FC<{ reportId: string }> = ({ reportId }) => {
    const [status, setStatus] = React.useState<any>(null);
    const [progress, setProgress] = React.useState<any>(null);
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            const s = await effectsApi.getGenerationStatus(reportId);
            const st = await effectsApi.getGenerationState(reportId);
            if (mounted) {
                setStatus(s);
                setProgress(st?.progress ?? null);
            }
        })();
        return () => { mounted = false; };
    }, [reportId]);

    switch (status) {
        case 'preparing':
            return (
                <Tag color="cyan" style={{ marginLeft: 8 }}>
                    🔧 Preparing...
                </Tag>
            );
        case 'in_progress':
            return (
                <Tag color="blue" style={{ marginLeft: 8 }}>
                    🔄 Generating...
                    {progress ? ` (${progress.processed}/${progress.total})` : ''}
                </Tag>
            );
        case 'paused':
            return (
                <Tag color="orange" style={{ marginLeft: 8 }}>
                    ⏸️ Paused
                    {progress ? ` (${progress.processed} completed)` : ''}
                </Tag>
            );
        case 'failed':
            return (
                <Tag color="red" style={{ marginLeft: 8 }}>
                    ❌ Failed
                </Tag>
            );
        case 'completed':
            return (
                <Tag color="green" style={{ marginLeft: 8 }}>
                    ✅ Completed
                </Tag>
            );
        case 'ready':
            return (
                <Tag color="purple" style={{ marginLeft: 8 }}>
                    🚀 Ready
                </Tag>
            );
        default:
            return null;
    }
};

const ActionsCell: React.FC<{ record: Report; onOpen: (r: Report) => void; onStop: (id: string) => void; onPause: (id: string) => void; onComplete: (id: string) => void; onReset: (id: string) => void; onRerun: (id: string) => void; onRestart: (id: string) => void; }> = ({ record, onOpen, onStop, onPause, onComplete, onReset, onRerun, onRestart }) => {
    const navigate = useNavigate();
    const [status, setStatus] = React.useState<any>(null);
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            const s = await effectsApi.getGenerationStatus(record.id);
            if (mounted) setStatus(s);
        })();
        return () => { mounted = false; };
    }, [record.id]);

    return (
        <Space>
            {status === 'ready' && (
                <Tooltip title={!settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to start generation" : ""} placement="bottom">
                    <Button type="primary" size="small" icon={<PlayCircleOutlined />} onClick={() => onOpen(record)} disabled={!settingsService.hasValidOpenAIKey()}>Start Generation</Button>
                </Tooltip>
            )}
            {status === 'preparing' && (
                <>
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => onReset(record.id)}>Reset</Button>
                    <Button size="small" icon={<PauseCircleOutlined />} onClick={() => onPause(record.id)}>Pause</Button>
                </>
            )}
            {status === 'in_progress' && (
                <>
                    <Button danger size="small" icon={<DeleteOutlined />} onClick={() => onReset(record.id)}>Reset</Button>
                    <Button size="small" icon={<PauseCircleOutlined />} onClick={() => onStop(record.id)}>Pause</Button>
                    <Button type="default" size="small" icon={<CheckCircleOutlined />} onClick={() => onComplete(record.id)}>Complete</Button>
                </>
            )}
            {status === 'paused' && (
                <>
                    <Button size="small" icon={<ReloadOutlined />} onClick={() => onReset(record.id)}>Reset</Button>
                    <Button size="small" icon={<PlayCircleOutlined />} onClick={() => onOpen(record)} disabled={!settingsService.hasValidOpenAIKey()}>Resume</Button>
                </>
            )}
            {status === 'completed' && (
                <Button size="small" onClick={() => onRerun(record.id)}>Rerun</Button>
            )}
            {status === 'failed' && (
                <Button size="small" onClick={() => onRestart(record.id)}>Restart</Button>
            )}
            <Button size="small" icon={<HistoryOutlined />} onClick={() => navigate(`/report-logs?reportId=${record.id}`)}>Logs</Button>
        </Space>
    );
};

const ReportsPage: React.FC = () => {
    // Legacy facades removed; use effectsApi Promise functions directly
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingReport, setEditingReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeGenerations, setActiveGenerations] = useState<Map<string, any>>(new Map());
    const [isResumableModalVisible, setIsResumableModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        loadReports();
        // Clean up any orphaned data on page load
        effectsApi.cleanupOrphanedData().then(cleanedCount => {
            if (cleanedCount > 0) {
                console.log(`Cleaned up ${cleanedCount} orphaned data entries`);
            }
        });
    }, []);

    useEffect(() => {
        filterReports();
    }, [reports, searchText]);

    // Monitor active generations
    useEffect(() => {
        const updateActiveGenerations = async () => {
            try {
                const map = await effectsApi.getActiveGenerations();
                setActiveGenerations(map);
            } catch {}
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
            const allReports = await effectsApi.getAllReportsWithSync();
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
            const newReport = await effectsApi.createReport({
                name: values.name,
                prompt: '' // Empty prompt, user will fill it in the editor
            });
            message.success('Report created successfully!');
            setIsCreateModalVisible(false);
            form.resetFields();
            loadReports();
            // Navigate to the report editor
            navigate(`/custom-report?reportId=${newReport.id}`, { state: { reportId: newReport.id } });
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to create report';
            message.error(errorMessage);
            console.error('Report creation error:', error);
        }
    };

    const handleEditReport = async (values: { name: string; prompt: string }) => {
        if (!editingReport) return;

        try {
            const updatedReport = await effectsApi.updateReport(editingReport.id, values);
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

    const handleDeleteReport = async (reportId: string) => {
        // Get cleanup summary to show what will be removed
        const cleanupSummary = await effectsApi.getCleanupSummary();
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

        Modal.confirm({
            title: 'Delete Report',
            content: description,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
        try {
            const success = await effectsApi.deleteReport(reportId);
            if (success) {
                message.success('Report deleted successfully!');
                loadReports();
            } else {
                message.error('Report not found');
            }
        } catch (error) {
            message.error('Failed to delete report');
        }
    }
        });
    };



    const handleOpenReport = (report: Report) => {
        navigate(`/custom-report?reportId=${report.id}`, { state: { reportId: report.id } });
    };

    const handleViewReportLogs = (report: Report) => {
        navigate(`/report-logs?reportId=${report.id}`, { state: { selectedReportId: report.id } });
    };

    const handleStopGeneration = async (reportId: string) => {
        if (await effectsApi.stopGeneration(reportId)) {
            message.success('Report generation stopped');
            loadReports(); // Refresh to update status
        }
    };

    const handleSetToPaused = async (reportId: string) => {
        if (await effectsApi.setToPaused(reportId)) {
            message.success('Report set to paused');
            loadReports(); // Refresh to update status
        }
    };

    const handleSetToCompleted = async (reportId: string) => {
        if (await effectsApi.setToCompleted(reportId)) {
            message.success('Report marked as completed');
            loadReports(); // Refresh to update status
        }
    };

    const handleResetToReady = (reportId: string) => {
        Modal.confirm({
            title: 'Reset Report to Ready State',
            content: 'This will clear all generation progress and checkpoint data. The report will be ready for a fresh start. Are you sure?',
            okText: 'Reset',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: async () => {
                const ok = await effectsApi.resetToReady(reportId);
                if (ok) {
                    message.success('Report reset to ready state');
                    loadReports(); // Refresh to update status
                } else {
                    message.error('Failed to reset report');
                }
            }
        });
    };

    const handleRerunFromCompleted = (reportId: string) => {
        Modal.confirm({
            title: 'Rerun Report Generation',
            content: 'This will clear the completed state and allow new generation. Are you sure?',
            okText: 'Rerun',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: async () => {
                if (await effectsApi.rerunFromCompleted(reportId)) {
                    message.success('Report ready for rerun');
                    loadReports(); // Refresh to update status
                } else {
                    message.error('Failed to prepare report for rerun');
                }
            }
        });
    };

    const handleRestartFromFailed = (reportId: string) => {
        Modal.confirm({
            title: 'Restart Report Generation',
            content: 'This will clear the failed state and allow new generation. Are you sure?',
            okText: 'Restart',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: async () => {
                if (await effectsApi.restartFromFailed(reportId)) {
                    message.success('Report ready for restart');
                    loadReports(); // Refresh to update status
                } else {
                    message.error('Failed to prepare report for restart');
                }
            }
        });
    };

    const handleCompleteGeneration = (reportId: string) => {
        Modal.confirm({
            title: 'Complete Report Generation',
            content: 'This will stop the current generation, create a report log with current results, and reset the report to ready state. Are you sure?',
            okText: 'Complete',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Get current report data
                    const report = await effectsApi.getReportById(reportId);
                    if (!report) {
                        message.error('Report not found');
                        return;
                    }

                    // Get current generation state and table data
                    const generationState = await effectsApi.getGenerationState(reportId);
                    const currentTableData = generationState?.tableData || report.tableData;

                    if (!currentTableData || currentTableData.results.length === 0) {
                        message.error('No data to save to report log');
                        return;
                    }

                    // Create report log with current results
                    await effectsApi.createReportLogFromGeneration({
                        reportId,
                        reportName: report.name,
                        prompt: report.prompt,
                        tableData: currentTableData as any,
                        totalTasks: currentTableData.results.length,
                        processedTasks: currentTableData.results.length,
                        startTime: Date.now(),
                        status: 'completed'
                    });

                    // Stop generation first if it's in progress
                    if (await effectsApi.isGenerating(reportId)) {
                        await effectsApi.stopGeneration(reportId);
                    }

                    // Reset to ready
                    const ok = await effectsApi.resetToReady(reportId);
                    if (ok) {
                        message.success('Report generation completed and log created successfully!');
                        loadReports(); // Refresh to update status
                    } else {
                        message.error('Failed to reset report to ready state');
                    }
                } catch (error) {
                    console.error('Error completing generation:', error);
                    message.error('Failed to complete report generation');
                }
            }
        });
    };

    const isGenerating = async (reportId: string) => {
        return await effectsApi.isGenerating(reportId);
    };

    const getGenerationStatus = async (reportId: string) => {
        return await effectsApi.getGenerationStatus(reportId);
    };

    const getGenerationProgress = async (reportId: string) => {
        const state = await effectsApi.getGenerationState(reportId);
        return state?.progress;
    };

    // Removed invalid hooks usage in getStatusTag; use StatusTag component instead

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
                    <StatusTag reportId={record.id} />
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
            render: (_: any, record: Report) => (
                <Space>
                    <ActionsCell
                        record={record}
                        onOpen={handleOpenReport}
                        onStop={handleStopGeneration}
                        onPause={handleStopGeneration}
                        onComplete={handleCompleteGeneration}
                        onReset={handleResetToReady}
                        onRerun={handleRerunFromCompleted}
                        onRestart={handleRestartFromFailed}
                    />
                    <Button
                        type="primary"
                        size="small"
                        icon={<HistoryOutlined />}
                        onClick={() => handleViewReportLogs(record)}
                    >
                        View Logs
                    </Button>
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
                </Space>
            )
        },
    ];

    return (
        <div style={{
            width: '100%',
            boxSizing: 'border-box',
            height: '100%',
            overflow: 'hidden'
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
                    <Space>
                        {(() => {
                            const resumableCount = 0; // effectsApi does not support listing resumables yet
                            return resumableCount > 0 ? (
                                <Tooltip
                                    title={!settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to resume reports" : ""}
                                    placement="bottom"
                                >
                                    <Button
                                        type="default"
                                        icon={<PlayCircleOutlined />}
                                        onClick={() => setIsResumableModalVisible(true)}
                                        disabled={!settingsService.hasValidOpenAIKey()}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            color: '#fff',
                                            fontWeight: 600,
                                            flexShrink: 0
                                        }}
                                    >
                                        Resume ({resumableCount})
                                    </Button>
                                </Tooltip>
                            ) : null;
                        })()}
                    <Tooltip
                        title={!settingsService.hasValidOpenAIKey() ? "Configure OpenAI API key in Settings to create reports" : ""}
                        placement="bottom"
                    >
                        <Button
                            type="default"
                            icon={<PlusOutlined />}
                            onClick={() => setIsCreateModalVisible(true)}
                            disabled={!settingsService.hasValidOpenAIKey()}
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
                    </Tooltip>
                    </Space>
                </div>

                {/* API Key Check */}
                {!settingsService.hasValidOpenAIKey() && (
                    <div style={{ padding: '0 20px', marginTop: '16px' }}>
                        <Alert
                            message="OpenAI API Key Required"
                            description={
                                <span>
                                    You need to configure your OpenAI API key to use the AI report generation features.
                                    <Button
                                        type="link"
                                        icon={<SettingOutlined />}
                                        style={{ padding: 0, height: 'auto', marginLeft: 8 }}
                                        onClick={() => window.location.hash = '#/settings'}
                                    >
                                        Go to Settings
                                    </Button>
                                </span>
                            }
                            type="warning"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />
                    </div>
                )}

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
                {!settingsService.hasValidOpenAIKey() && (
                    <Alert
                        message="OpenAI API Key Required"
                        description="You need to configure your OpenAI API key to create and generate reports."
                        type="warning"
                        showIcon
                        style={{ marginBottom: '16px' }}
                        action={
                            <Button
                                type="link"
                                size="small"
                                icon={<SettingOutlined />}
                                onClick={() => {
                                    setIsCreateModalVisible(false);
                                    window.location.hash = '#/settings';
                                }}
                            >
                                Go to Settings
                            </Button>
                        }
                    />
                )}
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
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!settingsService.hasValidOpenAIKey()}
                            >
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

            {/* Resumable Reports Modal */}
            <ResumableReportsModal
                visible={isResumableModalVisible}
                onClose={() => setIsResumableModalVisible(false)}
                onResume={(reportId) => {
                    navigate(`/custom-report?reportId=${reportId}`);
                }}
            />

        </div>
    );
};

export default ReportsPage;
