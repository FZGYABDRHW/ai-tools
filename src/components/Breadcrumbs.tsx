import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, UnorderedListOutlined, BarChartOutlined, HistoryOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Breadcrumbs: React.FC = () => {
    const location = useLocation();

    const getBreadcrumbItems = () => {
        const pathname = location.pathname;
        const items = [];

        // Always show home
        items.push({
            title: (
                <Link to="/task-text-builder">
                    <HomeOutlined style={{ marginRight: 4 }} />
                    Home
                </Link>
            ),
        });

        // Add specific breadcrumbs based on current route
        if (pathname === '/task-text-builder') {
            items.push({
                title: (
                    <span>
                        <FileTextOutlined style={{ marginRight: 4 }} />
                        Wowworks Task Builder
                    </span>
                ),
            });
        } else if (pathname === '/reports') {
            items.push({
                title: (
                    <span>
                        <UnorderedListOutlined style={{ marginRight: 4 }} />
                        Wowworks Report Management
                    </span>
                ),
            });
        } else if (pathname === '/custom-report') {
            // Get report ID and tab from URL parameters
            const searchParams = new URLSearchParams(location.search);
            const reportId = searchParams.get('reportId');
            const tab = searchParams.get('tab');
            
            items.push({
                title: (
                    <Link to="/reports">
                        <UnorderedListOutlined style={{ marginRight: 4 }} />
                        Wowworks Report Management
                    </Link>
                ),
            });
            items.push({
                title: (
                    <Link to={`/custom-report?reportId=${reportId}`}>
                        <BarChartOutlined style={{ marginRight: 4 }} />
                        Report
                    </Link>
                ),
            });
            
            // Add report ID if available
            if (reportId) {
                items.push({
                    title: (
                        <span>
                            ID: {reportId}
                        </span>
                    ),
                });
            }
            
            // Add tab if available
            if (tab) {
                items.push({
                    title: (
                        <span>
                            {tab === 'logs' ? 'Logs' : 'Editor'}
                        </span>
                    ),
                });
            }
        } else if (pathname === '/report-logs') {
            // Get report ID from URL parameters
            const searchParams = new URLSearchParams(location.search);
            const reportId = searchParams.get('reportId');
            
            items.push({
                title: (
                    <Link to="/reports">
                        <UnorderedListOutlined style={{ marginRight: 4 }} />
                        Wowworks Report Management
                    </Link>
                ),
            });
            
            if (reportId) {
                // If viewing logs for a specific report
                items.push({
                    title: (
                        <Link to={`/custom-report?reportId=${reportId}`}>
                            <BarChartOutlined style={{ marginRight: 4 }} />
                            Report
                        </Link>
                    ),
                });
                items.push({
                    title: (
                        <span>
                            ID: {reportId}
                        </span>
                    ),
                });
                items.push({
                    title: (
                        <span>
                            <HistoryOutlined style={{ marginRight: 4 }} />
                            Logs
                        </span>
                    ),
                });
            } else {
                // If viewing all logs
                items.push({
                    title: (
                        <span>
                            <HistoryOutlined style={{ marginRight: 4 }} />
                            Report Logs
                        </span>
                    ),
                });
            }
        }

        return items;
    };

    return (
        <div style={{ 
            padding: '12px 24px', 
            background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)'
        }}>
            <Breadcrumb
                items={getBreadcrumbItems()}
                style={{ fontSize: '14px' }}
            />
        </div>
    );
};

export default Breadcrumbs;
