import React from 'react';
import { Modal, List, Button, Progress, Typography, Space, Tag } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import * as effectsApi from '../services/effects/api';
const { reportCheckpointService, reportService } = effectsApi as any;
import { ReportCheckpoint } from '../services/effects/types';

const { Text, Title } = Typography;

interface ResumableReportsModalProps {
    visible: boolean;
    onClose: () => void;
    onResume: (reportId: string) => void;
}

const ResumableReportsModal: React.FC<ResumableReportsModalProps> = ({
    visible,
    onClose,
    onResume
}) => {
    const resumableCheckpoints: any[] = [];

    const formatDuration = (milliseconds: number): string => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    };

    const formatTimeAgo = (timestamp: number): string => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    const handleResume = (checkpoint: any) => {
        onResume(checkpoint.reportId as string);
        onClose();
    };

    const handleClear = async (reportId: string) => {
        await effectsApi.clearCheckpoint(reportId);
        onClose();
    };

    return (
        <Modal
            title={
                <Space>
                    <FileTextOutlined />
                    <span>Resumable Reports</span>
                    {resumableCheckpoints.length > 0 && (
                        <Tag color="blue">{resumableCheckpoints.length}</Tag>
                    )}
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {resumableCheckpoints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <Title level={4} style={{ color: '#666' }}>No Resumable Reports</Title>
                    <Text type="secondary">
                        All reports have been completed or there are no interrupted generations.
                    </Text>
                </div>
            ) : (
                <List
                    dataSource={resumableCheckpoints}
                    renderItem={(checkpoint) => {
                        const report = undefined as any; // placeholder; list is empty for now
                        const progressPercentage = reportCheckpointService.getProgressPercentage(checkpoint as any);
                        const estimatedTimeRemaining = reportCheckpointService.getEstimatedTimeRemaining(checkpoint as any);

                        return (
                            <List.Item
                                actions={[
                                    <Button
                                        type="primary"
                                        icon={<PlayCircleOutlined />}
                                        onClick={() => handleResume(checkpoint)}
                                    >
                                        Resume
                                    </Button>,
                                    <Button
                                        danger
                                        size="small"
                                        onClick={() => handleClear(checkpoint.reportId)}
                                    >
                                        Clear
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            <Text strong>{report?.name || 'Custom Report'}</Text>
                                            <Tag color={
                                                checkpoint.status === 'in_progress' ? 'blue' : 'orange'
                                            }>
                                                {checkpoint.status === 'in_progress' ? 'In Progress' : 'Paused'}
                                            </Tag>
                                        </Space>
                                    }
                                    description={
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {checkpoint.prompt.substring(0, 100)}...
                                            </Text>
                                            <br />
                                            <Space style={{ marginTop: '8px' }}>
                                                <ClockCircleOutlined style={{ color: '#666' }} />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Started {formatTimeAgo(checkpoint.startTime)}
                                                </Text>
                                                {checkpoint.lastCheckpointTime !== checkpoint.startTime && (
                                                    <>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>•</Text>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            Last update {formatTimeAgo(checkpoint.lastCheckpointTime)}
                                                        </Text>
                                                    </>
                                                )}
                                            </Space>
                                        </div>
                                    }
                                />
                                <div style={{ width: '200px' }}>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Progress: {checkpoint.currentTaskIndex}/{checkpoint.totalTasks} tasks
                                        </Text>
                                    </div>
                                    <Progress
                                        percent={progressPercentage}
                                        size="small"
                                        status={checkpoint.status === 'in_progress' ? 'active' : 'normal'}
                                    />
                                    {estimatedTimeRemaining > 0 && (
                                        <div style={{ marginTop: '4px' }}>
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                ~{formatDuration(estimatedTimeRemaining)} remaining
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </List.Item>
                        );
                    }}
                />
            )}
        </Modal>
    );
};

export default ResumableReportsModal;
