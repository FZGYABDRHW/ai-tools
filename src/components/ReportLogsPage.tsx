import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import ReportLogsList from './ReportLogsList';
import ReportLogViewer from './ReportLogViewer';

const { Content } = Layout;

const ReportLogsPage: React.FC = () => {
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);
    const location = useLocation();

    useEffect(() => {
        // Get selectedReportId from navigation state or URL parameters
        if (location.state?.selectedReportId) {
            setSelectedReportId(location.state.selectedReportId);
        } else {
            // Fallback to URL parameters
            const searchParams = new URLSearchParams(location.search);
            const reportId = searchParams.get('reportId');
            if (reportId) {
                setSelectedReportId(reportId);
            }
        }
    }, [location.state, location.search]);

    const handleViewLog = (logId: string) => {
        setSelectedLogId(logId);
    };

    const handleBackToList = () => {
        setSelectedLogId(null);
    };

    return (
        <Layout style={{ background: 'transparent' }}>
            <Content style={{ 
                padding: '0px',
                overflowY: 'auto'
            }}>
                {selectedLogId ? (
                    <ReportLogViewer 
                        reportLogId={selectedLogId} 
                        onBack={handleBackToList}
                    />
                ) : (
                    <ReportLogsList 
                        onViewLog={handleViewLog} 
                        selectedReportId={selectedReportId}
                    />
                )}
            </Content>
        </Layout>
    );
};

export default ReportLogsPage;
