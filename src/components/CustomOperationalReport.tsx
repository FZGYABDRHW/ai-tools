import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { Card, Typography, Form, Input, Button, Space, Divider, Layout, Table, Row, Col, message, Tabs, Modal } from 'antd';
import { BarChartOutlined, LoadingOutlined, DownloadOutlined, StopOutlined, FullscreenOutlined, FullscreenExitOutlined, HistoryOutlined, PlayCircleOutlined, EditOutlined, ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SidebarContext } from '../contexts/SidebarContext';
import { buildServiceInitializer } from '../serviceInit';
import { buildReport } from '../reportBuilder';
import builder from '../builder';
import MilkdownEditor from './MilkdownEditor';
import { reportLogService } from '../services/reportLogService';
import { reportService } from '../services/reportService';
import { reportGenerationService } from '../services/reportGenerationService';
import { reportCheckpointService } from '../services/reportCheckpointService';

import ReportLogsList from './ReportLogsList';
import ReportLogViewer from './ReportLogViewer';

const { Title } = Typography;
const { TextArea } = Input;
const { Content } = Layout;

const CustomOperationalReport: React.FC = () => {
    const { authToken, user } = useContext(AuthContext);
    const { hideSidebar, showSidebar } = useContext(SidebarContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get initial tab from URL or default to 'editor'
    const getInitialTab = () => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        return tab === 'logs' ? 'logs' : 'editor';
    };
    
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
    const [isTableFullScreen, setIsTableFullScreen] = useState<boolean>(false);
    const [dynamicPageSize, setDynamicPageSize] = useState<number>(20);
    const [activeTab, setActiveTab] = useState<string>(getInitialTab);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [logsRefreshKey, setLogsRefreshKey] = useState<number>(0);
    const [currentGenerationStatus, setCurrentGenerationStatus] = useState<string | null>(null);
    // Get extracted parameters from report data or generation state
    const getExtractedParameters = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (reportId) {
            // First try to get from report data (persistent)
            const report = reportService.getReportById(reportId);
            if (report?.extractedParameters) {
                return report.extractedParameters;
            }
            
            // Fallback to generation state (temporary)
            const generationState = reportGenerationService.getGenerationState(reportId);
            return generationState?.extractedParameters || null;
        }
        return null;
    };
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        localStorage.setItem('customOperationalReport', reportText);
    }, [reportText]);

    // Update generation status for UI updates
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        const status = reportId ? reportGenerationService.getGenerationStatus(reportId) : null;
        setCurrentGenerationStatus(status);
        
        // Set up interval to check for status changes
        const interval = setInterval(() => {
            const currentStatus = reportId ? reportGenerationService.getGenerationStatus(reportId) : null;
            if (currentStatus !== status) {
                setCurrentGenerationStatus(currentStatus);
            }
        }, 1000);
        
        return () => clearInterval(interval);
    }, [location.search]);

    // Load report and restore generation state when reportId is provided in URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        
        console.log('Loading report with ID:', reportId);
        
        if (reportId) {
            const report = reportService.getReportById(reportId);
            console.log('Found report:', report);
            if (report) {
                setReportText(report.prompt);
                if (report.tableData) {
                    setTableData(report.tableData);
                }
            }

            // Restore generation state if report is currently generating
            const generationState = reportGenerationService.getGenerationState(reportId);
            if (generationState) {
                console.log('Restoring generation state:', generationState);
                
                // Check if the generation was actually interrupted by app reload
                const isCurrentlyGenerating = generationState.status === 'in_progress';
                const wasInterrupted = isCurrentlyGenerating && !generationState.abortController;
                
                if (wasInterrupted) {
                    console.log('Generation was interrupted by app reload, setting status to paused');
                    // If generation was interrupted, set it to paused state
                    reportGenerationService.updateGenerationStatus(reportId, 'paused');
                    setIsGenerating(false);
                } else {
                    setIsGenerating(isCurrentlyGenerating);
                }
                
                setProgressInfo(generationState.progress);
                if (generationState.tableData) {
                    setTableData(generationState.tableData);
                }

                // Reconnect to ongoing generation for live updates
                if (isCurrentlyGenerating && !wasInterrupted) {
                    console.log('Reconnecting to ongoing generation');
                    reportGenerationService.reconnectToGeneration(reportId, {
                        onProgress: (progress) => {
                            console.log('Received progress update:', progress);
                            setTableData(progress);
                            setProgressInfo({
                                processed: progress.results.length,
                                total: progress.results.length
                            });
                        },
                        onComplete: (result) => {
                            console.log('Generation completed:', result);
                            setTableData(result);
                            setIsGenerating(false);
                            message.success('Custom report generated successfully! Report saved and log created.');
                        },
                        onError: (error) => {
                            console.log('Generation error:', error);
                            setIsGenerating(false);
                            if (error.message !== 'Aborted') {
                                message.error('Failed to generate custom report');
                            }
                        }
                    });
                }
            }
        }
    }, [location.search]);

    // Auto-save report text changes when editing existing report
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        
        if (reportId && reportText.trim()) {
            const report = reportService.getReportById(reportId);
            if (report && report.prompt !== reportText) {
                console.log('Auto-saving report text changes');
                reportService.updateReport(reportId, { prompt: reportText });
            }
        }
    }, [reportText, location.search]);



    // Calculate dynamic page size based on available container height
    const calculateDynamicPageSize = useCallback(() => {
        if (!tableContainerRef.current) return;
        
        const container = tableContainerRef.current;
        const containerHeight = container.clientHeight;
        
        // Estimate row height (including padding, borders, etc.)
        const estimatedRowHeight = 40; // Approximate height per row
        const headerHeight = 55; // Table header height
        const paginationHeight = 50; // Pagination controls height
        const padding = 32; // Container padding (16px top + 16px bottom)
        
        // Calculate available height for rows
        const availableHeight = containerHeight - headerHeight - paginationHeight - padding;
        
        // Calculate how many rows can fit
        const maxRows = Math.max(1, Math.floor(availableHeight / estimatedRowHeight));
        
        setDynamicPageSize(maxRows);
    }, []);

    // Recalculate page size on window resize
    useEffect(() => {
        const handleResize = () => {
            calculateDynamicPageSize();
        };

        window.addEventListener('resize', handleResize);
        calculateDynamicPageSize(); // Initial calculation

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [calculateDynamicPageSize]);

    const handleCustomReport = async () => {
        if (!reportText.trim()) {
            message.error('Please enter some text for the report');
            return;
        }
        if (!authToken.trim()) {
            message.error('Please login first');
            return;
        }

        // Get or create report ID
        const searchParams = new URLSearchParams(location.search);
        let reportId = searchParams.get('reportId');
        
        if (!reportId) {
            // Create new report
            const newReport = reportService.createReport({
                name: 'Custom Operational Report',
                prompt: reportText
            });
            reportId = newReport.id;
            // Update URL with the new report ID
            navigate(`/custom-report?reportId=${reportId}`, { replace: true });
        }

        setIsGenerating(true);
        setTableData(null); // Clear previous data
        setProgressInfo(null); // Clear progress info
        
        try {
            await reportGenerationService.startGeneration(
                reportId,
                reportText, 
                authToken,
                (progress) => {
                    // Progress callback - update UI in real-time
                    setTableData(progress);
                    setProgressInfo({
                        processed: progress.results.length,
                        total: progress.results.length
                    });
                },
                (result) => {
                    // Complete callback
                    setTableData(result);
                    setIsGenerating(false);
                    message.success('Custom report generated successfully! Report saved and log created.');
                },
                (error) => {
                    // Error callback
                    setIsGenerating(false);
                    if (error.message !== 'Aborted') {
                        message.error('Failed to generate custom report');
                    }
                },
                0, // startOffset
                getExtractedParameters()?.parameters
            );
        } catch (error) {
            setIsGenerating(false);
            message.error('Failed to start report generation');
        }
    };

    const handleViewLog = (logId: string) => {
        setSelectedLogId(logId);
        setActiveTab('logs');
        // Update URL with tab parameter
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('tab', 'logs');
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    const handleBackToList = () => {
        setSelectedLogId(null);
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        // Update URL with tab parameter while preserving reportId
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('tab', key);
        
        // Preserve reportId if it exists in state
        if (location.state?.reportId && !searchParams.get('reportId')) {
            searchParams.set('reportId', location.state.reportId);
        }
        
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
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

    const toggleTableFullScreen = () => {
        if (isTableFullScreen) {
            setIsTableFullScreen(false);
            showSidebar();
        } else {
            setIsTableFullScreen(true);
            hideSidebar();
        }
    };

    const handleStopReport = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        
        if (reportId && reportGenerationService.stopGeneration(reportId)) {
            console.log('Aborting report generation...');
            setIsGenerating(false);
            setProgressInfo(null);
            message.info('Report generation stopped. Report log created.');
        }
    };

    const handleResumeReport = async () => {
        console.log('handleResumeReport called');
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        console.log('Report ID from URL:', reportId);
        
        if (!reportId) {
            message.error('No report ID found');
            return;
        }

        if (!authToken.trim()) {
            message.error('Please login first');
            return;
        }

        // Get existing data before starting
        const existingData = reportService.getReportById(reportId)?.tableData;
        console.log('Existing table data before resume:', existingData?.results?.length || 0, 'results');

        setIsGenerating(true);
        // Don't clear table data - preserve existing results
        setProgressInfo(null);

        try {
            await reportGenerationService.resumeGeneration(
                reportId,
                authToken,
                (progress) => {
                    // Progress callback - update UI in real-time
                    console.log('Resume progress callback received:', progress.results.length, 'results');
                    setTableData(progress);
                    setProgressInfo({
                        processed: progress.results.length,
                        total: progress.results.length
                    });
                },
                (result) => {
                    // Complete callback
                    setTableData(result);
                    setIsGenerating(false);
                    message.success('Report generation resumed and completed successfully!');
                },
                (error) => {
                    // Error callback
                    setIsGenerating(false);
                    if (error.message !== 'Aborted') {
                        message.error('Failed to resume report generation');
                    }
                }
            );
        } catch (error) {
            setIsGenerating(false);
            message.error('Failed to resume report generation');
        }
    };

    const handleResetToReady = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        
        if (!reportId) {
            message.error('No report ID found');
            return;
        }

        Modal.confirm({
            title: 'Reset Report to Ready State',
            content: 'This will clear all generation progress and checkpoint data. The report will be ready for a fresh start. Are you sure?',
            okText: 'Reset',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: () => {
                if (reportGenerationService.resetToReady(reportId)) {
                    message.success('Report reset to ready state');
                    // Clear local state
                    setIsGenerating(false);
                    setTableData(null);
                    setProgressInfo(null);
                } else {
                    message.error('Failed to reset report');
                }
            }
        });
    };

    const handleRerunFromCompleted = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        
        if (!reportId) {
            message.error('No report ID found');
            return;
        }

        Modal.confirm({
            title: 'Rerun Report Generation',
            content: 'This will clear the completed state and allow new generation. Are you sure?',
            okText: 'Rerun',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: () => {
                if (reportGenerationService.rerunFromCompleted(reportId)) {
                    message.success('Report ready for rerun');
                    // Clear local state
                    setIsGenerating(false);
                    setTableData(null);
                    setProgressInfo(null);
                } else {
                    message.error('Failed to prepare report for rerun');
                }
            }
        });
    };

    const handleRestartFromFailed = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        
        if (!reportId) {
            message.error('No report ID found');
            return;
        }

        Modal.confirm({
            title: 'Restart Report Generation',
            content: 'This will clear the failed state and allow new generation. Are you sure?',
            okText: 'Restart',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: () => {
                if (reportGenerationService.restartFromFailed(reportId)) {
                    message.success('Report ready for restart');
                    // Clear local state
                    setIsGenerating(false);
                    setTableData(null);
                    setProgressInfo(null);
                } else {
                    message.error('Failed to prepare report for restart');
                }
            }
        });
    };

    const handleCompleteGeneration = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        
        if (!reportId) {
            message.error('No report ID found');
            return;
        }

        Modal.confirm({
            title: 'Complete Report Generation',
            content: 'This will stop the current generation, create a report log with current results, and reset the report to ready state. Are you sure?',
            okText: 'Complete',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Get current report data
                    const report = reportService.getReportById(reportId);
                    if (!report) {
                        message.error('Report not found');
                        return;
                    }

                    // Get current table data
                    const currentTableData = tableData;
                    if (!currentTableData || currentTableData.results.length === 0) {
                        message.error('No data to save to report log');
                        return;
                    }

                    // Create report log with current results
                    await reportLogService.createFromReportGeneration(
                        reportId,
                        report.name,
                        reportText,
                        currentTableData,
                        currentTableData.results.length,
                        currentTableData.results.length,
                        Date.now(),
                        'completed'
                    );

                    // Stop generation first if it's in progress
                    if (isGenerating) {
                        reportGenerationService.stopGeneration(reportId);
                    }
                    
                    // Reset to ready
                    if (reportGenerationService.resetToReady(reportId)) {
                        message.success('Report generation completed and log created successfully!');
                        // Clear local state
                        setIsGenerating(false);
                        setTableData(null);
                        setProgressInfo(null);
                        // Refresh logs list to show the new log
                        setLogsRefreshKey(prev => prev + 1);
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

    return (
        <div style={{ width: '100%', boxSizing: 'border-box', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                tabBarStyle={{ marginBottom: 0 }}
                items={[
                    {
                        key: 'editor',
                        label: (
                            <span>
                                <BarChartOutlined style={{ marginRight: 8 }} />
                                Report Editor
                            </span>
                        ),
                        children: (
                            <div style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
            {/* Control Bar */}
            <div style={{
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                padding: '8px 20px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #ff8c69'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                    <BarChartOutlined style={{ fontSize: '20px', color: '#ff8c69', marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ color: '#333', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                            Report Generation Control
                        </div>
                        <div style={{ color: '#666', fontSize: '12px', marginBottom: '6px' }}>
                            {(() => {
                                const searchParams = new URLSearchParams(location.search);
                                const reportId = searchParams.get('reportId');
                                const status = reportId ? reportGenerationService.getGenerationStatus(reportId) : null;
                                
                                switch (status) {
                                    case 'in_progress':
                                        return '🔄 Processing tasks...';
                                    case 'paused':
                                        return '⏸️ Generation paused';
                                    case 'failed':
                                        return '❌ Generation failed';
                                    case 'completed':
                                        return '✅ Generation completed';
                                    case 'ready':
                                        return '🚀 Ready to generate';
                                    default:
                                        return 'Ready to generate report';
                                }
                            })()}
                        </div>

                        {/* Compact Parameters Display */}
                        {getExtractedParameters() && getExtractedParameters()!.humanReadable.length > 0 && (
                            <div style={{ 
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px',
                                alignItems: 'center'
                            }}>
                                <span style={{ 
                                    color: '#ff8c69', 
                                    fontSize: '10px', 
                                    fontWeight: 600,
                                    marginRight: '4px'
                                }}>
                                    🔍 Parameters:
                                </span>
                                {getExtractedParameters()!.humanReadable.map((param, index) => (
                                    <span key={index} style={{ 
                                        color: '#333', 
                                        fontSize: '10px',
                                        background: 'rgba(255, 140, 105, 0.15)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(255, 140, 105, 0.3)',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {param}
                                    </span>
                                ))}
                            </div>
                        )}
                        {getExtractedParameters() && getExtractedParameters()!.humanReadable.length === 0 && (
                            <div style={{ 
                                color: '#666', 
                                fontSize: '10px',
                                fontStyle: 'italic'
                            }}>
                                No parameters detected in prompt
                            </div>
                        )}
                    </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!isGenerating ? (
                                            <>
                                                {(() => {
                                                    const searchParams = new URLSearchParams(location.search);
                                                    const reportId = searchParams.get('reportId');
                                                    const status = reportId ? reportGenerationService.getGenerationStatus(reportId) : null;
                                                    const canResume = reportId && reportCheckpointService.canResume(reportId);
                                                    console.log('Resume button check:', { reportId, canResume, status });
                                                    
                                                    return (status === 'paused' || status === 'failed') && canResume ? (
                                                        <Button
                                                            type="default"
                                                            size="middle"
                                                            onClick={handleResumeReport}
                                                            icon={<PlayCircleOutlined />}
                                                            style={{
                                                                fontSize: '14px',
                                                                fontWeight: 600,
                                                                height: '36px',
                                                                padding: '0 16px',
                                                                background: '#ff8c69',
                                                                borderColor: '#ff8c69',
                                                                color: '#fff'
                                                            }}
                                                        >
                                                            Continue
                                                        </Button>
                                                    ) : null;
                                                })()}
                                                {(() => {
                                                    const searchParams = new URLSearchParams(location.search);
                                                    const reportId = searchParams.get('reportId');
                                                    const status = reportId ? reportGenerationService.getGenerationStatus(reportId) : null;
                                                    
                                                    return status === 'paused' ? (
                                                        <>
                                                            <Button
                                                                type="default"
                                                                size="middle"
                                                                onClick={handleCompleteGeneration}
                                                                icon={<CheckCircleOutlined />}
                                                                style={{
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    height: '36px',
                                                                    padding: '0 16px',
                                                                    background: '#73d13d',
                                                                    borderColor: '#73d13d',
                                                                    color: '#fff'
                                                                }}
                                                            >
                                                                Save & Finish
                                                            </Button>
                                                            <Button
                                                                type="default"
                                                                size="middle"
                                                                onClick={handleResetToReady}
                                                                icon={<ReloadOutlined />}
                                                                style={{
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    height: '36px',
                                                                    padding: '0 16px',
                                                                    background: '#ffa940',
                                                                    borderColor: '#ffa940',
                                                                    color: '#fff'
                                                                }}
                                                            >
                                                                Start Over
                                                            </Button>
                                                        </>
                                                    ) : null;
                                                })()}
                                                {(() => {
                                                    const searchParams = new URLSearchParams(location.search);
                                                    const reportId = searchParams.get('reportId');
                                                    const status = reportId ? reportGenerationService.getGenerationStatus(reportId) : null;
                                                    
                                                    return status === 'completed' ? (
                                                        <Button
                                                            type="default"
                                                            size="middle"
                                                            onClick={handleRerunFromCompleted}
                                                            icon={<ReloadOutlined />}
                                                            style={{
                                                                fontSize: '14px',
                                                                fontWeight: 600,
                                                                height: '36px',
                                                                padding: '0 16px',
                                                                background: '#ff8c69',
                                                                borderColor: '#ff8c69',
                                                                color: '#fff'
                                                            }}
                                                        >
                                                            Generate Again
                                                        </Button>
                                                    ) : null;
                                                })()}
                                                {(() => {
                                                    const searchParams = new URLSearchParams(location.search);
                                                    const reportId = searchParams.get('reportId');
                                                    const status = reportId ? reportGenerationService.getGenerationStatus(reportId) : null;
                                                    
                                                    return status === 'failed' ? (
                                                        <Button
                                                            type="default"
                                                            size="middle"
                                                            onClick={handleRestartFromFailed}
                                                            icon={<ReloadOutlined />}
                                                            style={{
                                                                fontSize: '14px',
                                                                fontWeight: 600,
                                                                height: '36px',
                                                                padding: '0 16px',
                                                                background: '#ffa940',
                                                                borderColor: '#ffa940',
                                                                color: '#fff'
                                                            }}
                                                        >
                                                            Try Again
                                                        </Button>
                                                    ) : null;
                                                })()}
                                                {(() => {
                                                    const searchParams = new URLSearchParams(location.search);
                                                    const reportId = searchParams.get('reportId');
                                                    const status = reportId ? reportGenerationService.getGenerationStatus(reportId) : null;
                                                    
                                                    // Only show Start Report button when status is 'ready' or null (no status)
                                                    return (status === 'ready' || status === null) ? (
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
                                background: '#ff8c69',
                                borderColor: '#ff8c69'
                            }}
                        >
                                                            Generate Report
                        </Button>
                                                    ) : null;
                                                })()}
                                            </>
                    ) : (
                                            <div style={{ display: 'flex', gap: '8px' }}>
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
                                                        backgroundColor: '#ff9c6e',
                                                        borderColor: '#ff9c6e',
                                                        color: '#ffffff'
                                                    }}
                                                >
                                                    Pause
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    size="middle"
                                                    onClick={handleCompleteGeneration}
                                                    icon={<CheckCircleOutlined />}
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        height: '36px',
                                                        padding: '0 16px',
                                                        backgroundColor: '#73d13d',
                                                        borderColor: '#73d13d',
                                color: '#ffffff'
                            }}
                        >
                                                    Save & Finish
                        </Button>
                                            </div>
                    )}
                    
                    {progressInfo && (
                        <div style={{
                            background: 'rgba(255, 140, 105, 0.1)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            color: '#ff8c69',
                            fontSize: '12px',
                            fontWeight: 500,
                            border: '1px solid rgba(255, 140, 105, 0.3)'
                        }}>
                            {isGenerating ? '🔄 Processing' : '✅ Complete'}: {progressInfo.processed} items
                        </div>
                    )}
                </div>
            </div>
            
                                <Row gutter={24} style={{ flex: 1, minHeight: 0, height: 'calc(100% - 80px)' }}>
                                    <Col xs={24} lg={isTableFullScreen ? 0 : 12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                                        flex: 1,
                        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: '1px solid #ff8c69',
                        overflow: 'hidden',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column'
                    }}>
                        {/* Header for the editor */}
                        <div style={{
                            background: 'linear-gradient(135deg, #ff8c69 0%, #ff9f7f 100%)',
                            padding: '12px 20px',
                            borderBottom: '1px solid rgba(255, 140, 105, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <BarChartOutlined style={{ color: '#fff', fontSize: '16px' }} />
                            <span style={{ 
                                color: '#fff', 
                                fontSize: '14px', 
                                fontWeight: 600,
                                letterSpacing: '0.5px'
                            }}>
                                                 Editor
                                                {(currentGenerationStatus === 'in_progress' || currentGenerationStatus === 'paused') && (
                                                        <span style={{ 
                                                            fontSize: '12px', 
                                                            marginLeft: '8px',
                                                            opacity: 0.8
                                                        }}>
                                                            (Read Only)
                                                        </span>
                                                    )}
                            </span>
                        </div>
                        
                        {/* Editor container */}
                        <div style={{ 
                                            flex: 1,
                            background: '#fff',
                            overflow: 'hidden'
                        }}>
                            <MilkdownEditor
                                value={reportText}
                                onChange={setReportText}
                                placeholder="Write your prompt here..."
                                                readOnly={currentGenerationStatus === 'in_progress' || currentGenerationStatus === 'paused'}
                            />
                        </div>
                    </div>
                </Col>
                
                                <Col xs={24} lg={isTableFullScreen ? 24 : 12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                                        flex: 1,
                        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: '1px solid #ff8c69',
                        overflow: 'hidden',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column'
                    }}>
                                        {/* Header for the results */}
                        <div style={{
                            background: 'linear-gradient(135deg, #ff8c69 0%, #ff9f7f 100%)',
                            padding: '12px 20px',
                            borderBottom: '1px solid rgba(255, 140, 105, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BarChartOutlined style={{ color: '#fff', fontSize: '16px' }} />
                                <span style={{ 
                                    color: '#fff', 
                                    fontSize: '14px', 
                                    fontWeight: 600,
                                    letterSpacing: '0.5px'
                                }}>
                                                     Results
                                </span>
                            </div>
                            
                            {tableData && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Button
                                                        type="text"
                                        size="small"
                                        icon={<DownloadOutlined />}
                                        onClick={handleDownloadCSV}
                                                        style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                                    >
                                        Download CSV
                                    </Button>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={isTableFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                                                        onClick={toggleTableFullScreen}
                                                        style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                                                    />
                                </div>
                            )}
                        </div>
                        
                        {/* Table container */}
                        <div 
                            ref={tableContainerRef}
                            style={{ 
                                flex: 1,
                                padding: '16px',
                                background: '#fff',
                                overflow: 'hidden'
                            }}
                        >
                            {!tableData && isGenerating ? (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                                height: '100%',
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
                                height: '100%',
                                width: '100%'
                            }}>

                                <div style={{ flex: 1, overflow: 'hidden', height: '100%' }}>
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
                                            pageSize: dynamicPageSize,
                                            showSizeChanger: false,
                                            showQuickJumper: true,
                                            showTotal: (total, range) => 
                                                `${range[0]}-${range[1]} of ${total} items`,
                                            size: 'small'
                                        }}
                                        scroll={{ 
                                            x: 'max-content',
                                            y: '100%'
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
                                                height: '100%',
                                color: '#666',
                                fontSize: 16
                            }}>
                                Generate a report to see the table here
                            </div>
                        )}
                        </div>
                    </div>
                </Col>
            </Row>
                                </div>
                        )
                    },
                    {
                        key: 'logs',
                        label: (
                            <span>
                                <HistoryOutlined style={{ marginRight: 8 }} />
                                Report Logs
                            </span>
                        ),
                        children: (
                            <div style={{ height: 'calc(100vh - 200px)', overflow: 'auto', marginTop: '16px' }}>
                                {selectedLogId ? (
                                    <ReportLogViewer 
                                        reportLogId={selectedLogId} 
                                        onBack={handleBackToList}
                                    />
                                ) : (
                                    <ReportLogsList 
                                        onViewLog={handleViewLog} 
                                        selectedReportId={new URLSearchParams(location.search).get('reportId') || undefined}
                                        refreshKey={logsRefreshKey}
                                    />
                                )}
                            </div>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default CustomOperationalReport;
