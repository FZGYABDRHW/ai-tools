import React, { useEffect, useState, useContext } from 'react';
import { Card, Typography, Form, Input, Button, Space, Divider, message, Layout, Alert } from 'antd';
import { FileTextOutlined, CopyOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import builder from '../builder';
import { settingsService } from '../services/settingsService';

const { Title, Text } = Typography;

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
        <div style={{ 
            width: '100%', 
            boxSizing: 'border-box',
            height: '100%',
            maxWidth: '800px',
            margin: '0 auto',
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
                    gap: '12px'
                }}>
                    <FileTextOutlined style={{ color: '#fff', fontSize: '20px' }} />
                    <Title level={4} style={{ 
                        margin: 0, 
                        color: '#fff',
                        fontWeight: 600,
                        letterSpacing: '0.5px'
                    }}>
                        Wowworks Task Builder
                    </Title>
                </div>
                
                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {/* API Key Check */}
                    {!settingsService.hasValidOpenAIKey() && (
                        <Alert
                            message="OpenAI API Key Required"
                            description={
                                <span>
                                    You need to configure your OpenAI API key to use the AI features. 
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
                            style={{ marginBottom: '24px' }}
                        />
                    )}
                    
                    <Title level={3} style={{ marginBottom: '24px' }}>
                        <FileTextOutlined style={{ marginRight: 8, color: '#ff8c69' }} />
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
                            disabled={!taskId.trim() || !authToken.trim() || !user || !settingsService.hasValidOpenAIKey()}
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
                </div>
            </div>
        </div>
    );
};

export default TaskAuthForm;
