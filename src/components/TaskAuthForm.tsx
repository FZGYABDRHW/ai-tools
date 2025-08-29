import React, { useEffect, useState, useContext } from 'react';
import { Card, Typography, Form, Input, Button, Space, Divider, message, Layout } from 'antd';
import { FileTextOutlined, CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import builder from '../builder';

const { Title, Text } = Typography;
const { Content } = Layout;

const TaskAuthForm: React.FC = () => {
    const [taskId, setTaskId] = useState<string>(() => {
        return localStorage.getItem('taskId') || '';
    });
    const { authToken, user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [promptText, setPromptText] = useState<string>('');

    useEffect(() => {
        localStorage.setItem('taskId', taskId);
    }, [taskId]);

    const handleBuildPrompt = async () => {
        if (!taskId.trim()) {
            message.error('Please enter a Task ID');
            return;
        }
        if (!authToken.trim()) {
            message.error('Please login first');
            return;
        }

        setIsLoading(true);
        try {
            const prompt = await builder(Number(taskId), authToken);
            setPromptText(prompt);
            message.success('Prompt built successfully!');
        } catch (error) {
            console.error('Error building prompt:', error);
            message.error('Failed to build prompt. Please check your Task ID and Auth Token.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = () => {
        if (promptText) {
            navigator.clipboard.writeText(promptText).then(
                () => {
                    message.success('Copied to clipboard successfully!');
                },
                (err) => {
                    console.error('Failed to copy text: ', err);
                    message.error('Failed to copy to clipboard');
                }
            );
        }
    };

    return (
        <Content style={{ padding: '24px' }}>
            <Card>
                <Title level={3}>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    AI Task Builder
                </Title>
                
                <Form layout="vertical" style={{ maxWidth: 600 }}>
                    <Form.Item
                        label="Task ID"
                        required
                        rules={[{ required: true, message: 'Please enter a Task ID' }]}
                    >
                        <Input
                            placeholder="Enter Task ID"
                            value={taskId}
                            onChange={(e) => setTaskId(e.target.value)}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleBuildPrompt}
                            loading={isLoading}
                            icon={isLoading ? <LoadingOutlined /> : <FileTextOutlined />}
                            disabled={!taskId.trim() || !authToken.trim() || !user}
                        >
                            {isLoading ? 'Building...' : 'Build Text for Prompt'}
                        </Button>
                    </Form.Item>
                </Form>

                {promptText && (
                    <div style={{ marginTop: 24 }}>
                        <Divider />
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={4}>Generated Prompt</Title>
                                <Button
                                    type="default"
                                    icon={<CopyOutlined />}
                                    onClick={handleCopyToClipboard}
                                >
                                    Copy to Clipboard
                                </Button>
                            </div>
                            <Card style={{ backgroundColor: '#fafafa' }}>
                                <Text style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                                    {promptText}
                                </Text>
                            </Card>
                        </Space>
                    </div>
                )}
            </Card>
        </Content>
    );
};

export default TaskAuthForm;
