"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const antd_2 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const machines_1 = require("../machines");
const SidebarContext_1 = require("../contexts/SidebarContext");
const MilkdownEditor_1 = __importDefault(require("./MilkdownEditor"));
const SimpleMarkdownRenderer_1 = __importDefault(require("./SimpleMarkdownRenderer"));
const compatibility_1 = require("../services/effects/compatibility");
const promptEnhancerService_1 = require("../services/promptEnhancerService");
const ReportLogsList_1 = __importDefault(require("./ReportLogsList"));
const ReportLogViewer_1 = __importDefault(require("./ReportLogViewer"));
const { Title } = antd_1.Typography;
const { TextArea } = antd_1.Input;
const { Content } = antd_1.Layout;
const CustomOperationalReport = () => {
    const { authToken, user, selectedServer } = (0, machines_1.useAuth)();
    const { hideSidebar, showSidebar } = (0, react_1.useContext)(SidebarContext_1.SidebarContext);
    const location = (0, react_router_dom_1.useLocation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Get initial tab from URL or default to 'editor'
    const getInitialTab = () => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        return tab === 'logs' ? 'logs' : 'editor';
    };
    const [reportText, setReportText] = (0, react_1.useState)('');
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const [tableData, setTableData] = (0, react_1.useState)(null);
    const [progressInfo, setProgressInfo] = (0, react_1.useState)(null);
    const [isTableFullScreen, setIsTableFullScreen] = (0, react_1.useState)(false);
    const [dynamicPageSize, setDynamicPageSize] = (0, react_1.useState)(20);
    const [activeTab, setActiveTab] = (0, react_1.useState)(getInitialTab);
    const [selectedLogId, setSelectedLogId] = (0, react_1.useState)(null);
    const [logsRefreshKey, setLogsRefreshKey] = (0, react_1.useState)(0);
    const [currentGenerationStatus, setCurrentGenerationStatus] = (0, react_1.useState)(null);
    const [isEnhancingPrompt, setIsEnhancingPrompt] = (0, react_1.useState)(false);
    const [enhanceModalOpen, setEnhanceModalOpen] = (0, react_1.useState)(false);
    const [enhanceResult, setEnhanceResult] = (0, react_1.useState)(null);
    // Get extracted parameters from report data or generation state
    const getExtractedParameters = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (reportId) {
            // First try to get from report data (persistent)
            const report = compatibility_1.reportService.getReportById(reportId);
            if (report?.extractedParameters) {
                return report.extractedParameters;
            }
            // Fallback to generation state (temporary)
            const generationState = compatibility_1.reportGenerationService.getGenerationState(reportId);
            return generationState?.extractedParameters || null;
        }
        return null;
    };
    const tableContainerRef = (0, react_1.useRef)(null);
    const abortControllerRef = (0, react_1.useRef)(null);
    const loadedPromptRef = (0, react_1.useRef)(null);
    const didLoadRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        const storageKey = reportId ? `customOperationalReport_${reportId}` : 'customOperationalReport';
        localStorage.setItem(storageKey, reportText);
    }, [reportText, location.search]);
    // Update generation status for UI updates
    (0, react_1.useEffect)(() => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        setCurrentGenerationStatus(reportId ? compatibility_1.reportGenerationService.getGenerationStatus(reportId) : null);
        // Poll for status changes
        const interval = setInterval(() => {
            const currentStatus = reportId ? compatibility_1.reportGenerationService.getGenerationStatus(reportId) : null;
            setCurrentGenerationStatus(currentStatus);
            if (currentStatus === 'ready' && reportId) {
                compatibility_1.reportGenerationService.clearExtractedParameters(reportId);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [location.search]);
    // Load report and restore generation state when reportId is provided in URL
    (0, react_1.useEffect)(() => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        console.log('Loading report with ID:', reportId);
        if (reportId) {
            const report = compatibility_1.reportService.getReportById(reportId);
            console.log('Found report:', report);
            if (report) {
                // Load prompt from report; fallback to per-report localStorage
                const storageKey = `customOperationalReport_${reportId}`;
                const fallback = localStorage.getItem(storageKey);
                const promptToLoad = report.prompt || fallback || '';
                loadedPromptRef.current = promptToLoad;
                setReportText(promptToLoad);
                didLoadRef.current = true;
                if (report.tableData) {
                    setTableData(report.tableData);
                }
            }
            // Restore generation state if report is currently generating
            const generationState = compatibility_1.reportGenerationService.getGenerationState(reportId);
            if (generationState) {
                console.log('Restoring generation state:', generationState);
                // Check if the generation was actually interrupted by app reload
                const isCurrentlyGenerating = generationState.status === 'in_progress';
                const wasInterrupted = isCurrentlyGenerating;
                if (wasInterrupted) {
                    console.log('Generation was interrupted by app reload, setting status to paused');
                    // If generation was interrupted, set it to paused state
                    compatibility_1.reportGenerationService.updateGenerationStatus(reportId, 'paused');
                    setIsGenerating(false);
                }
                else {
                    setIsGenerating(isCurrentlyGenerating);
                }
                setProgressInfo(generationState.progress);
                if (generationState.tableData) {
                    setTableData({
                        columns: [...generationState.tableData.columns],
                        results: [...generationState.tableData.results],
                        csv: generationState.tableData.csv
                    });
                }
                // Reconnect to ongoing generation for live updates
                if (isCurrentlyGenerating && !wasInterrupted) {
                    console.log('Reconnecting to ongoing generation');
                    compatibility_1.reportGenerationService.reconnectToGeneration(reportId, {
                        onProgress: (progress) => {
                            console.log('Received progress update:', progress);
                            setTableData({
                                columns: [...progress.columns],
                                results: [...progress.results],
                                csv: progress.csv
                            });
                            setProgressInfo({
                                processed: progress.results.length,
                                total: progress.results.length
                            });
                        },
                        onComplete: (result) => {
                            console.log('Generation completed:', result);
                            setTableData({
                                columns: [...result.columns],
                                results: [...result.results],
                                csv: result.csv
                            });
                            setIsGenerating(false);
                            antd_1.message.success('Custom report generated successfully! Report saved and log created.');
                        },
                        onError: (error) => {
                            console.log('Generation error:', error);
                            setIsGenerating(false);
                            if (error.message !== 'Aborted') {
                                antd_1.message.error('Failed to generate custom report');
                            }
                        }
                    });
                }
            }
        }
    }, [location.search]);
    // Sync table data with report service when report changes
    (0, react_1.useEffect)(() => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (reportId) {
            const report = compatibility_1.reportService.getReportById(reportId);
            if (report?.tableData && !isGenerating) {
                // Only update if we're not currently generating to avoid conflicts
                setTableData(report.tableData);
            }
        }
    }, [location.search, isGenerating]);
    // Auto-save report text changes when editing existing report
    (0, react_1.useEffect)(() => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (!reportId || !reportText.trim() || !didLoadRef.current)
            return;
        const report = compatibility_1.reportService.getReportById(reportId);
        if (!report)
            return;
        // Only save when user changed text compared to what we loaded
        if (loadedPromptRef.current !== null && reportText !== loadedPromptRef.current) {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                console.log('Auto-saving report text changes');
                compatibility_1.reportService.updateReport(reportId, { prompt: reportText }).catch(error => {
                    console.error('Failed to auto-save report:', error);
                });
                // Update baseline to avoid repeat saves for same content
                loadedPromptRef.current = reportText;
            }, 600);
            return () => clearTimeout(timeout);
        }
    }, [reportText, location.search]);
    // Calculate dynamic page size based on available container height
    const calculateDynamicPageSize = (0, react_1.useCallback)(() => {
        if (!tableContainerRef.current)
            return;
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
    (0, react_1.useEffect)(() => {
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
            antd_1.message.error('Please enter some text for the report');
            return;
        }
        if (!authToken.trim()) {
            antd_1.message.error('Please login first');
            return;
        }
        // Get or create report ID
        const searchParams = new URLSearchParams(location.search);
        let reportId = searchParams.get('reportId');
        if (!reportId) {
            // Create new report
            const newReport = await compatibility_1.reportService.createReport({
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
            await compatibility_1.reportGenerationService.startGeneration(reportId, reportText, authToken, selectedServer, (progress) => {
                // Progress callback - update UI in real-time
                setTableData(progress);
                setProgressInfo({
                    processed: progress.results.length,
                    total: progress.results.length
                });
            }, (result) => {
                // Complete callback
                setTableData(result);
                setIsGenerating(false);
                antd_1.message.success('Custom report generated successfully! Report saved and log created.');
            }, (error) => {
                // Error callback
                setIsGenerating(false);
                if (error.message !== 'Aborted') {
                    antd_1.message.error('Failed to generate custom report');
                }
            }, 0, // startOffset
            getExtractedParameters()?.parameters);
        }
        catch (error) {
            setIsGenerating(false);
            antd_1.message.error('Failed to start report generation');
        }
    };
    const handleViewLog = (logId) => {
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
    const handleTabChange = (key) => {
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
        if (!tableData)
            return;
        const blob = new Blob([tableData.csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'operational_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        antd_1.message.success('CSV file downloaded successfully!');
    };
    const toggleTableFullScreen = () => {
        if (isTableFullScreen) {
            setIsTableFullScreen(false);
            showSidebar();
        }
        else {
            setIsTableFullScreen(true);
            hideSidebar();
        }
    };
    const handleStopReport = async () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (!reportId)
            return;
        try {
            const stopped = await compatibility_1.reportGenerationService.stopGeneration(reportId);
            if (stopped) {
                console.log('Aborting report generation...');
                setIsGenerating(false);
                setProgressInfo(null);
                setCurrentGenerationStatus('paused');
                antd_1.message.info('Report generation paused.');
            }
        }
        catch (e) {
            // no-op
        }
    };
    const handleResumeReport = async () => {
        console.log('handleResumeReport called');
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        console.log('Report ID from URL:', reportId);
        if (!reportId) {
            antd_1.message.error('No report ID found');
            return;
        }
        if (!authToken.trim()) {
            antd_1.message.error('Please login first');
            return;
        }
        // Get existing data before starting
        const existingData = compatibility_1.reportService.getReportById(reportId)?.tableData;
        console.log('Existing table data before resume:', existingData?.results?.length || 0, 'results');
        setIsGenerating(true);
        // Don't clear table data - preserve existing results
        setProgressInfo(null);
        try {
            await compatibility_1.reportGenerationService.resumeGeneration({
                reportId,
                authToken,
                selectedServer,
                onProgress: (progress) => {
                    // Progress callback - update UI in real-time
                    console.log('Resume progress callback received:', progress.results.length, 'results');
                    setTableData({
                        columns: [...progress.columns],
                        results: [...progress.results],
                        csv: progress.csv
                    });
                    setProgressInfo({
                        processed: progress.results.length,
                        total: progress.results.length
                    });
                },
                onComplete: (result) => {
                    // Complete callback
                    setTableData({
                        columns: [...result.columns],
                        results: [...result.results],
                        csv: result.csv
                    });
                    setIsGenerating(false);
                    antd_1.message.success('Report generation resumed and completed successfully!');
                },
                onError: (error) => {
                    // Error callback
                    setIsGenerating(false);
                    if (error.message !== 'Aborted') {
                        antd_1.message.error('Failed to resume report generation');
                    }
                }
            });
        }
        catch (error) {
            setIsGenerating(false);
            antd_1.message.error('Failed to resume report generation');
        }
    };
    const handleResetToReady = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (!reportId) {
            antd_1.message.error('No report ID found');
            return;
        }
        antd_1.Modal.confirm({
            title: 'Reset Report to Ready State',
            content: 'This will clear all generation progress and checkpoint data. The report will be ready for a fresh start. Are you sure?',
            okText: 'Reset',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: async () => {
                const ok = await compatibility_1.reportGenerationService.resetToReady(reportId);
                if (ok) {
                    antd_1.message.success('Report reset to ready state');
                    // Clear local state
                    setIsGenerating(false);
                    setTableData(null);
                    setProgressInfo(null);
                }
                else {
                    antd_1.message.error('Failed to reset report');
                }
            }
        });
    };
    const handleRerunFromCompleted = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (!reportId) {
            antd_1.message.error('No report ID found');
            return;
        }
        antd_1.Modal.confirm({
            title: 'Rerun Report Generation',
            content: 'This will clear the completed state and allow new generation. Are you sure?',
            okText: 'Rerun',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: () => {
                if (compatibility_1.reportGenerationService.rerunFromCompleted(reportId)) {
                    antd_1.message.success('Report ready for rerun');
                    // Clear local state - table data is cleared by the service
                    setIsGenerating(false);
                    setTableData(null);
                    setProgressInfo(null);
                    // Force refresh of generation status
                    setCurrentGenerationStatus('ready');
                }
                else {
                    antd_1.message.error('Failed to prepare report for rerun');
                }
            }
        });
    };
    const handleRestartFromFailed = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (!reportId) {
            antd_1.message.error('No report ID found');
            return;
        }
        antd_1.Modal.confirm({
            title: 'Restart Report Generation',
            content: 'This will clear the failed state and allow new generation. Are you sure?',
            okText: 'Restart',
            okType: 'default',
            cancelText: 'Cancel',
            onOk: () => {
                if (compatibility_1.reportGenerationService.restartFromFailed(reportId)) {
                    antd_1.message.success('Report ready for restart');
                    // Clear local state - table data is cleared by the service
                    setIsGenerating(false);
                    setTableData(null);
                    setProgressInfo(null);
                    // Force refresh of generation status
                    setCurrentGenerationStatus('ready');
                }
                else {
                    antd_1.message.error('Failed to prepare report for restart');
                }
            }
        });
    };
    const handleCompleteGeneration = () => {
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('reportId');
        if (!reportId) {
            antd_1.message.error('No report ID found');
            return;
        }
        antd_1.Modal.confirm({
            title: 'Complete Report Generation',
            content: 'This will stop the current generation, create a report log with current results, and reset the report to ready state. Are you sure?',
            okText: 'Complete',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Get current report data
                    const report = compatibility_1.reportService.getReportById(reportId);
                    if (!report) {
                        antd_1.message.error('Report not found');
                        return;
                    }
                    // Get current table data
                    const currentTableData = tableData;
                    if (!currentTableData || currentTableData.results.length === 0) {
                        antd_1.message.error('No data to save to report log');
                        return;
                    }
                    // Create report log with current results
                    await compatibility_1.reportLogService.createFromReportGeneration(reportId, report.name, reportText, currentTableData, currentTableData.results.length, currentTableData.results.length, Date.now(), 'completed');
                    // Stop generation first if it's in progress
                    if (isGenerating) {
                        compatibility_1.reportGenerationService.stopGeneration(reportId);
                    }
                    // Reset to ready
                    if (compatibility_1.reportGenerationService.resetToReady(reportId)) {
                        antd_1.message.success('Report generation completed and log created successfully!');
                        // Clear local state
                        setIsGenerating(false);
                        setTableData(null);
                        setProgressInfo(null);
                        // Refresh logs list to show the new log
                        setLogsRefreshKey(prev => prev + 1);
                    }
                    else {
                        antd_1.message.error('Failed to reset report to ready state');
                    }
                }
                catch (error) {
                    console.error('Error completing generation:', error);
                    antd_1.message.error('Failed to complete report generation');
                }
            }
        });
    };
    const handleEnhancePrompt = async () => {
        if (!reportText.trim()) {
            antd_1.message.error('Please enter a prompt to enhance');
            return;
        }
        // Open modal immediately with loading state
        setEnhanceResult(null);
        setEnhanceModalOpen(true);
        setIsEnhancingPrompt(true);
        try {
            const result = await promptEnhancerService_1.promptEnhancerService.enhancePrompt(reportText);
            console.log('Enhancement result:', result);
            // Ensure suggestions generated by default
            if (!result.aiSuggestions || result.aiSuggestions.length === 0) {
                console.log('Generating suggestions...');
                result.aiSuggestions = await promptEnhancerService_1.promptEnhancerService.getAISuggestions(result.originalPrompt, result.enhancedPrompt);
                console.log('Generated suggestions:', result.aiSuggestions);
            }
            setEnhanceResult(result);
            console.log('Modal should be open now');
        }
        catch (error) {
            console.error('Error enhancing prompt:', error);
            antd_1.message.error(`Failed to enhance prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setEnhanceModalOpen(false);
        }
        finally {
            setIsEnhancingPrompt(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { width: '100%', boxSizing: 'border-box', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Tabs, { activeKey: activeTab, onChange: handleTabChange, style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }, tabBarStyle: { marginBottom: 0 }, items: [
                    {
                        key: 'editor',
                        label: ((0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)(icons_1.BarChartOutlined, { style: { marginRight: 8 } }), "Report Editor"] })),
                        children: ((0, jsx_runtime_1.jsxs)("div", { style: { height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', marginTop: '16px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                                        padding: '8px 20px',
                                        borderRadius: '8px',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: '1px solid #ff8c69'
                                    }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }, children: [(0, jsx_runtime_1.jsx)(icons_1.BarChartOutlined, { style: { fontSize: '20px', color: '#ff8c69', marginTop: '2px' } }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { color: '#333', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }, children: "Report Generation Control" }), (0, jsx_runtime_1.jsx)("div", { style: { color: '#666', fontSize: '12px', marginBottom: '6px' }, children: (() => {
                                                                const searchParams = new URLSearchParams(location.search);
                                                                const reportId = searchParams.get('reportId');
                                                                const status = reportId ? compatibility_1.reportGenerationService.getGenerationStatus(reportId) : null;
                                                                switch (status) {
                                                                    case 'preparing':
                                                                        return '🔧 Preparing generation... (Extracting parameters and generating schema)';
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
                                                            })() }), getExtractedParameters() && getExtractedParameters().humanReadable.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: '6px',
                                                                alignItems: 'center'
                                                            }, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                                                        color: '#ff8c69',
                                                                        fontSize: '10px',
                                                                        fontWeight: 600,
                                                                        marginRight: '4px'
                                                                    }, children: "\uD83D\uDD0D Parameters:" }), getExtractedParameters().humanReadable.map((param, index) => ((0, jsx_runtime_1.jsx)("span", { style: {
                                                                        color: '#333',
                                                                        fontSize: '10px',
                                                                        background: 'rgba(255, 140, 105, 0.15)',
                                                                        padding: '2px 6px',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid rgba(255, 140, 105, 0.3)',
                                                                        whiteSpace: 'nowrap'
                                                                    }, children: param }, index)))] })), getExtractedParameters() && getExtractedParameters().humanReadable.length === 0 && ((0, jsx_runtime_1.jsx)("div", { style: {
                                                                color: '#666',
                                                                fontSize: '10px',
                                                                fontStyle: 'italic'
                                                            }, children: "No parameters detected in prompt" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [!isGenerating ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(() => {
                                                            const searchParams = new URLSearchParams(location.search);
                                                            const reportId = searchParams.get('reportId');
                                                            const status = reportId ? compatibility_1.reportGenerationService.getGenerationStatus(reportId) : null;
                                                            const canResume = reportId && compatibility_1.reportCheckpointService.canResume(reportId);
                                                            console.log('Resume button check:', { reportId, canResume, status });
                                                            return (status === 'paused' || status === 'failed') && canResume ? ((0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "middle", onClick: handleResumeReport, icon: (0, jsx_runtime_1.jsx)(icons_1.PlayCircleOutlined, {}), style: {
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    height: '36px',
                                                                    padding: '0 16px',
                                                                    background: '#ff8c69',
                                                                    borderColor: '#ff8c69',
                                                                    color: '#fff'
                                                                }, children: "Continue" })) : null;
                                                        })(), (() => {
                                                            const searchParams = new URLSearchParams(location.search);
                                                            const reportId = searchParams.get('reportId');
                                                            const status = reportId ? compatibility_1.reportGenerationService.getGenerationStatus(reportId) : null;
                                                            return status === 'paused' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "middle", onClick: handleCompleteGeneration, icon: (0, jsx_runtime_1.jsx)(icons_1.CheckCircleOutlined, {}), style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 600,
                                                                            height: '36px',
                                                                            padding: '0 16px',
                                                                            background: '#73d13d',
                                                                            borderColor: '#73d13d',
                                                                            color: '#fff'
                                                                        }, children: "Save & Finish" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "middle", onClick: handleResetToReady, icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}), style: {
                                                                            fontSize: '14px',
                                                                            fontWeight: 600,
                                                                            height: '36px',
                                                                            padding: '0 16px',
                                                                            background: '#ffa940',
                                                                            borderColor: '#ffa940',
                                                                            color: '#fff'
                                                                        }, children: "Start Over" })] })) : null;
                                                        })(), (() => {
                                                            const searchParams = new URLSearchParams(location.search);
                                                            const reportId = searchParams.get('reportId');
                                                            const status = reportId ? compatibility_1.reportGenerationService.getGenerationStatus(reportId) : null;
                                                            return status === 'completed' ? ((0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "middle", onClick: handleRerunFromCompleted, icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}), style: {
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    height: '36px',
                                                                    padding: '0 16px',
                                                                    background: '#ff8c69',
                                                                    borderColor: '#ff8c69',
                                                                    color: '#fff'
                                                                }, children: "Generate Again" })) : null;
                                                        })(), (() => {
                                                            const searchParams = new URLSearchParams(location.search);
                                                            const reportId = searchParams.get('reportId');
                                                            const status = reportId ? compatibility_1.reportGenerationService.getGenerationStatus(reportId) : null;
                                                            return status === 'failed' ? ((0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", size: "middle", onClick: handleRestartFromFailed, icon: (0, jsx_runtime_1.jsx)(icons_1.ReloadOutlined, {}), style: {
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    height: '36px',
                                                                    padding: '0 16px',
                                                                    background: '#ffa940',
                                                                    borderColor: '#ffa940',
                                                                    color: '#fff'
                                                                }, children: "Try Again" })) : null;
                                                        })(), (() => {
                                                            const searchParams = new URLSearchParams(location.search);
                                                            const reportId = searchParams.get('reportId');
                                                            const status = reportId ? compatibility_1.reportGenerationService.getGenerationStatus(reportId) : null;
                                                            // Only show Start Report button when status is 'ready' or null (no status)
                                                            return (status === 'ready' || status === null) ? ((0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", size: "middle", onClick: handleCustomReport, icon: (0, jsx_runtime_1.jsx)(icons_1.BarChartOutlined, {}), disabled: !reportText.trim() || !authToken.trim() || !user, style: {
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    height: '36px',
                                                                    padding: '0 16px',
                                                                    background: '#ff8c69',
                                                                    borderColor: '#ff8c69'
                                                                }, children: "Generate Report" })) : null;
                                                        })()] })) : ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { danger: true, size: "middle", onClick: handleStopReport, icon: (0, jsx_runtime_1.jsx)(icons_1.StopOutlined, {}), style: {
                                                                fontSize: '14px',
                                                                fontWeight: 600,
                                                                height: '36px',
                                                                padding: '0 16px',
                                                                backgroundColor: '#ff9c6e',
                                                                borderColor: '#ff9c6e',
                                                                color: '#ffffff'
                                                            }, children: "Pause" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", size: "middle", onClick: handleCompleteGeneration, icon: (0, jsx_runtime_1.jsx)(icons_1.CheckCircleOutlined, {}), style: {
                                                                fontSize: '14px',
                                                                fontWeight: 600,
                                                                height: '36px',
                                                                padding: '0 16px',
                                                                backgroundColor: '#73d13d',
                                                                borderColor: '#73d13d',
                                                                color: '#ffffff'
                                                            }, children: "Save & Finish" })] })), progressInfo && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                                        background: 'rgba(255, 140, 105, 0.1)',
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        color: '#ff8c69',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        border: '1px solid rgba(255, 140, 105, 0.3)'
                                                    }, children: [isGenerating ? '🔄 Processing' : '✅ Complete', ": ", progressInfo.processed, " items"] }))] })] }), (0, jsx_runtime_1.jsxs)(antd_1.Row, { gutter: 24, style: { flex: 1, minHeight: 0, height: 'calc(100% - 80px)' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Col, { xs: 24, lg: isTableFullScreen ? 0 : 12, style: { display: 'flex', flexDirection: 'column' }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                                                    flex: 1,
                                                    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                    border: '1px solid #ff8c69',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                                            background: 'linear-gradient(135deg, #ff8c69 0%, #ff9f7f 100%)',
                                                            padding: '12px 20px',
                                                            borderBottom: '1px solid rgba(255, 140, 105, 0.2)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between'
                                                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.BarChartOutlined, { style: { color: '#fff', fontSize: '16px' } }), (0, jsx_runtime_1.jsxs)("span", { style: {
                                                                            color: '#fff',
                                                                            fontSize: '14px',
                                                                            fontWeight: 600,
                                                                            letterSpacing: '0.5px'
                                                                        }, children: ["Editor", (currentGenerationStatus === 'preparing' || currentGenerationStatus === 'in_progress' || currentGenerationStatus === 'paused') && ((0, jsx_runtime_1.jsx)("span", { style: {
                                                                                    fontSize: '12px',
                                                                                    marginLeft: '8px',
                                                                                    opacity: 0.8
                                                                                }, children: "(Read Only)" }))] })] }), !(currentGenerationStatus === 'preparing' || currentGenerationStatus === 'in_progress' || currentGenerationStatus === 'paused') && ((0, jsx_runtime_1.jsx)("div", { style: { position: 'relative' }, children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.ThunderboltOutlined, {}), onClick: handleEnhancePrompt, loading: isEnhancingPrompt, disabled: !reportText.trim(), style: {
                                                                        color: '#fff',
                                                                        borderColor: 'rgba(255,255,255,0.3)',
                                                                        fontSize: '12px',
                                                                        fontWeight: 500,
                                                                        height: '28px',
                                                                        padding: '0 12px',
                                                                        cursor: (!reportText.trim()) ? 'not-allowed' : 'pointer',
                                                                        zIndex: 10,
                                                                        position: 'relative',
                                                                        opacity: (!reportText.trim()) ? 0.5 : 1
                                                                    }, title: `Enhance prompt with AI to make it more suitable for report generation. ${!reportText.trim() ? 'Enter some text first.' : ''}`, children: "Enhance Prompt" }) }))] }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                            flex: 1,
                                                            background: '#fff',
                                                            overflow: 'hidden'
                                                        }, children: (0, jsx_runtime_1.jsx)(MilkdownEditor_1.default, { value: reportText, onChange: setReportText, placeholder: "Write your prompt here...", readOnly: currentGenerationStatus === 'preparing' || currentGenerationStatus === 'in_progress' || currentGenerationStatus === 'paused' }) })] }) }), (0, jsx_runtime_1.jsx)(antd_1.Col, { xs: 24, lg: isTableFullScreen ? 24 : 12, style: { display: 'flex', flexDirection: 'column' }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                                                    flex: 1,
                                                    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                    border: '1px solid #ff8c69',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                                                            background: 'linear-gradient(135deg, #ff8c69 0%, #ff9f7f 100%)',
                                                            padding: '12px 20px',
                                                            borderBottom: '1px solid rgba(255, 140, 105, 0.2)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between'
                                                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.BarChartOutlined, { style: { color: '#fff', fontSize: '16px' } }), (0, jsx_runtime_1.jsx)("span", { style: {
                                                                            color: '#fff',
                                                                            fontSize: '14px',
                                                                            fontWeight: 600,
                                                                            letterSpacing: '0.5px'
                                                                        }, children: "Results" })] }), tableData && ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", size: "small", icon: (0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, {}), onClick: handleDownloadCSV, style: { color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }, children: "Download CSV" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", size: "small", icon: isTableFullScreen ? (0, jsx_runtime_1.jsx)(icons_1.FullscreenExitOutlined, {}) : (0, jsx_runtime_1.jsx)(icons_1.FullscreenOutlined, {}), onClick: toggleTableFullScreen, style: { color: '#fff', borderColor: 'rgba(255,255,255,0.3)' } })] }))] }), (0, jsx_runtime_1.jsx)("div", { ref: tableContainerRef, style: {
                                                            flex: 1,
                                                            padding: '16px',
                                                            background: '#fff',
                                                            overflow: 'hidden'
                                                        }, children: !tableData && isGenerating ? ((0, jsx_runtime_1.jsxs)("div", { style: {
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: '100%',
                                                                flexDirection: 'column',
                                                                gap: 16
                                                            }, children: [(0, jsx_runtime_1.jsx)(icons_1.LoadingOutlined, { style: { fontSize: 32, color: '#1890ff' } }), (0, jsx_runtime_1.jsx)("div", { children: "Initializing report generation..." }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: 12, color: '#666' }, children: "Setting up schema and preparing tasks" })] })) : tableData ? ((0, jsx_runtime_1.jsx)("div", { style: {
                                                                flex: 1,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                height: '100%',
                                                                width: '100%'
                                                            }, children: (0, jsx_runtime_1.jsx)("div", { style: { flex: 1, overflow: 'hidden', height: '100%' }, children: (0, jsx_runtime_1.jsx)(antd_1.Table, { dataSource: tableData.results.map((row, index) => ({
                                                                        ...row,
                                                                        key: row.taskId || index
                                                                    })), columns: tableData.columns.map(col => ({
                                                                        title: col,
                                                                        dataIndex: col,
                                                                        key: col,
                                                                        width: 150,
                                                                        ellipsis: true,
                                                                        render: (value) => {
                                                                            if (typeof value === 'object' && value !== null) {
                                                                                return JSON.stringify(value);
                                                                            }
                                                                            return String(value || '');
                                                                        }
                                                                    })), pagination: {
                                                                        pageSize: dynamicPageSize,
                                                                        showSizeChanger: false,
                                                                        showQuickJumper: true,
                                                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                                                        size: 'small'
                                                                    }, scroll: {
                                                                        x: 'max-content',
                                                                        y: '100%'
                                                                    }, size: "small", style: {
                                                                        height: '100%',
                                                                        width: '100%'
                                                                    } }) }) })) : ((0, jsx_runtime_1.jsx)("div", { style: {
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: '100%',
                                                                color: '#666',
                                                                fontSize: 16
                                                            }, children: "Generate a report to see the table here" })) })] }) })] })] }))
                    },
                    {
                        key: 'logs',
                        label: ((0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)(icons_1.HistoryOutlined, { style: { marginRight: 8 } }), "Report Logs"] })),
                        children: ((0, jsx_runtime_1.jsx)("div", { style: { height: 'calc(100vh - 200px)', overflow: 'auto', marginTop: '16px' }, children: selectedLogId ? ((0, jsx_runtime_1.jsx)(ReportLogViewer_1.default, { reportLogId: selectedLogId, onBack: handleBackToList })) : ((0, jsx_runtime_1.jsx)(ReportLogsList_1.default, { onViewLog: handleViewLog, selectedReportId: new URLSearchParams(location.search).get('reportId') || undefined, refreshKey: logsRefreshKey })) }))
                    }
                ] }), (0, jsx_runtime_1.jsx)(antd_1.Modal, { open: enhanceModalOpen, onCancel: () => {
                    console.log('Modal cancelled');
                    setEnhanceModalOpen(false);
                }, title: "Enhanced Prompt", width: "100vw", style: { top: 0, paddingBottom: 0 }, bodyStyle: { height: 'calc(100vh - 120px)', overflow: 'auto' }, footer: [
                    (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: () => setEnhanceModalOpen(false), children: "Cancel" }, "cancel"),
                    (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", onClick: () => {
                            if (enhanceResult) {
                                setReportText(enhanceResult.enhancedPrompt);
                                antd_1.message.success('Prompt enhanced and applied successfully!');
                            }
                            setEnhanceModalOpen(false);
                        }, children: "Use Enhanced Prompt" }, "use-enhanced"),
                    (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", ghost: true, onClick: async () => {
                            if (!enhanceResult)
                                return;
                            let toMerge = enhanceResult.aiSuggestions || [];
                            if (!toMerge.length) {
                                toMerge = await promptEnhancerService_1.promptEnhancerService.getAISuggestions(enhanceResult.originalPrompt, enhanceResult.enhancedPrompt);
                            }
                            if (!toMerge.length) {
                                antd_1.message.info('No suggestions to apply');
                                return;
                            }
                            const merged = await promptEnhancerService_1.promptEnhancerService.mergeWithSuggestions(enhanceResult.enhancedPrompt, toMerge, enhanceResult.originalPrompt);
                            setReportText(merged);
                            antd_1.message.success('Enhanced prompt with suggestions applied!');
                            setEnhanceModalOpen(false);
                        }, children: "Use Enhanced Prompt with Suggestions" }, "use-with-suggestions")
                ], children: isEnhancingPrompt && !enhanceResult ? ((0, jsx_runtime_1.jsxs)("div", { style: { padding: '20px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', marginBottom: '30px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.LoadingOutlined, { style: { fontSize: '32px', color: '#ff8c69' } }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: '16px', fontSize: '16px', color: '#666' }, children: "Enhancing your prompt with AI..." })] }), (0, jsx_runtime_1.jsx)(antd_2.Skeleton, { active: true, paragraph: { rows: 8 } })] })) : enhanceResult ? ((0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 16, padding: '20px', height: '100%' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '20px', height: 'calc(100vh - 200px)' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsx)("strong", { style: { fontSize: '16px', marginBottom: '12px' }, children: "Original Prompt (Markdown):" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                background: '#f5f5f5',
                                                padding: 16,
                                                borderRadius: 8,
                                                fontSize: 14,
                                                flex: 1,
                                                overflow: 'auto',
                                                border: '1px solid #d9d9d9'
                                            }, children: (0, jsx_runtime_1.jsx)(SimpleMarkdownRenderer_1.default, { content: enhanceResult.originalPrompt, style: {
                                                    color: '#333',
                                                    lineHeight: '1.6'
                                                } }) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsx)("strong", { style: { fontSize: '16px', marginBottom: '12px' }, children: "Enhanced Prompt (Markdown):" }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                background: '#e6f7ff',
                                                padding: 16,
                                                borderRadius: 8,
                                                fontSize: 14,
                                                flex: 1,
                                                overflow: 'auto',
                                                border: '1px solid #91d5ff'
                                            }, children: (0, jsx_runtime_1.jsx)(SimpleMarkdownRenderer_1.default, { content: enhanceResult.enhancedPrompt, style: {
                                                    color: '#333',
                                                    lineHeight: '1.6'
                                                } }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '20px' }, children: [(0, jsx_runtime_1.jsx)("strong", { style: { fontSize: '16px' }, children: "Suggestions (additional helpful fields):" }), enhanceResult.aiSuggestions && enhanceResult.aiSuggestions.length > 0 ? ((0, jsx_runtime_1.jsx)("ul", { style: { marginTop: 12, paddingLeft: 20 }, children: enhanceResult.aiSuggestions.map((s, index) => ((0, jsx_runtime_1.jsxs)("li", { style: { fontSize: 14, color: '#666', marginBottom: 6 }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontWeight: 600 }, children: s.field }), ": ", s.description] }, index))) })) : ((0, jsx_runtime_1.jsx)("div", { style: { marginTop: 12, fontSize: 14, color: '#999' }, children: "No suggestions available." }))] })] })) : null })] }));
};
exports.default = CustomOperationalReport;
//# sourceMappingURL=CustomOperationalReport.js.map