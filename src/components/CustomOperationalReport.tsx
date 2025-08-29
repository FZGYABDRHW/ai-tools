import React, { useEffect, useState, useContext, useRef } from 'react';
import { Card, Typography, Form, Input, Button, Space, Divider, Layout, Table, Row, Col, message } from 'antd';
import { BarChartOutlined, LoadingOutlined, DownloadOutlined, StopOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import { buildServiceInitializer } from '../serviceInit';
import { buildReport } from '../reportBuilder';
import builder from '../builder';
import MilkdownEditor from './MilkdownEditor';

const { Title } = Typography;
const { TextArea } = Input;
const { Content } = Layout;

const CustomOperationalReport: React.FC = () => {
    const { authToken, user } = useContext(AuthContext);
    const [reportText, setReportText] = useState<string>(() => {
        return localStorage.getItem('customOperationalReport') || '';
    });
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [tableData, setTableData] = useState<{
        columns: string[];
        results: Array<Record<string, unknown>>;
        csv: string;
    } | null>(null);
    const [progressInfo, setProgressInfo] = useState<{
        processed: number;
        total: number;
    } | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        localStorage.setItem('customOperationalReport', reportText);
    }, [reportText]);

    const handleCustomReport = async () => {
        if (!reportText.trim()) {
            message.error('Please enter some text for the report');
            return;
        }
        if (!authToken.trim()) {
            message.error('Please login first');
            return;
        }

        setIsGenerating(true);
        setTableData(null); // Clear previous data
        setProgressInfo(null); // Clear progress info
        
        // Create abort controller for cancellation
        abortControllerRef.current = new AbortController();
        
        try {
            const si = buildServiceInitializer(authToken);
            const result = await buildReport(
                reportText, 
                si, 
                (taskId) => builder(taskId, authToken),
                (progress) => {
                    // Update table data in real-time
                    setTableData(progress);
                    setProgressInfo({
                        processed: progress.results.length,
                        total: progress.results.length // We'll update this when we know the total
                    });
                },
                abortControllerRef.current?.signal
            );
            setTableData(result);
            message.success('Custom report generated successfully!');
        } catch (error: any) {
            if (error.message === 'Aborted') {
                console.log('Report generation was cancelled');
                message.info('Report generation was stopped');
            } else {
                console.error('Error generating report:', error);
                message.error('Failed to generate custom report');
            }
        } finally {
            setIsGenerating(false);
            abortControllerRef.current = null;
        }
    };



    const handleDownloadCSV = () => {
        if (!tableData) return;
        
        const blob = new Blob([tableData.csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'operational_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('CSV file downloaded successfully!');
    };

    const handleStopReport = () => {
        if (abortControllerRef.current) {
            console.log('Aborting report generation...');
            abortControllerRef.current.abort();
            setIsGenerating(false);
            setProgressInfo(null);
            message.info('Report generation stopped');
        }
    };

    return (
        <Content style={{ padding: '24px' }}>
            {/* Control Bar */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '8px 20px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BarChartOutlined style={{ fontSize: '20px', color: '#fff' }} />
                    <div>
                        <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>
                            Report Generation Control
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                            {isGenerating ? 'Processing tasks...' : 'Ready to generate report'}
                        </div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!isGenerating ? (
                        <Button
                            type="primary"
                            size="middle"
                            onClick={handleCustomReport}
                            icon={<BarChartOutlined />}
                            disabled={!reportText.trim() || !authToken.trim() || !user}
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                height: '36px',
                                padding: '0 16px',
                                background: '#52c41a',
                                borderColor: '#52c41a'
                            }}
                        >
                            ▶️ Start Report
                        </Button>
                    ) : (
                        <Button
                            danger
                            size="middle"
                            onClick={handleStopReport}
                            icon={<StopOutlined />}
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                height: '36px',
                                padding: '0 16px',
                                backgroundColor: '#ff4d4f',
                                borderColor: '#ff4d4f'
                            }}
                        >
                            ⏹️ Stop Report
                        </Button>
                    )}
                    
                    {progressInfo && (
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 500
                        }}>
                            {isGenerating ? '🔄 Processing' : '✅ Complete'}: {progressInfo.processed} items
                        </div>
                    )}
                </div>
            </div>
            
            <Row gutter={24}>
                <Col xs={24} lg={12}>
                    <div style={{ height: 'calc(100vh - 100px)' }}>
                        <MilkdownEditor
                            value={reportText}
                            onChange={setReportText}
                            placeholder="Write your prompt here..."
                        />
                    </div>
                </Col>
                
                <Col xs={24} lg={12}>
                    <Card style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', padding: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8, flexShrink: 0 }}>
                            {tableData && (
                                <Button
                                    type="default"
                                    icon={<DownloadOutlined />}
                                    onClick={handleDownloadCSV}
                                    size="small"
                                >
                                    Download CSV
                                </Button>
                            )}
                        </div>
                        
                        {!tableData && isGenerating ? (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: 200,
                                flexDirection: 'column',
                                gap: 16
                            }}>
                                <LoadingOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                                <div>Initializing report generation...</div>
                                <div style={{ fontSize: 12, color: '#666' }}>
                                    Setting up schema and preparing tasks
                                </div>
                            </div>
                        ) : tableData ? (
                            <div style={{ 
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                                width: '100%'
                            }}>

                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <Table
                                        dataSource={tableData.results.map((row, index) => ({
                                            ...row,
                                            key: row.taskId || index
                                        }))}
                                        columns={tableData.columns.map(col => ({
                                            title: col,
                                            dataIndex: col,
                                            key: col,
                                            width: 150,
                                            ellipsis: true,
                                            render: (value: any) => {
                                                if (typeof value === 'object' && value !== null) {
                                                    return JSON.stringify(value);
                                                }
                                                return String(value || '');
                                            }
                                        }))}
                                        pagination={{
                                            pageSize: 20,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                            showTotal: (total, range) => 
                                                `${range[0]}-${range[1]} of ${total} items`,
                                            size: 'small'
                                        }}
                                        scroll={{ 
                                            x: 'max-content',
                                            y: 'calc(100vh - 250px)'
                                        }}
                                        size="small"
                                        style={{ 
                                            height: '100%',
                                            width: '100%'
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: 200,
                                color: '#666',
                                fontSize: 16
                            }}>
                                Generate a report to see the table here
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default CustomOperationalReport;
