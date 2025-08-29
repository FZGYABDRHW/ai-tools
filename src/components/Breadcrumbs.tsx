import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';

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
                        AI Task Builder
                    </span>
                ),
            });
        } else if (pathname === '/reports') {
            items.push({
                title: (
                    <span>
                        <UnorderedListOutlined style={{ marginRight: 4 }} />
                        Custom Operational Report Management
                    </span>
                ),
            });
        } else if (pathname === '/custom-report') {
            items.push({
                title: (
                    <Link to="/reports">
                        <UnorderedListOutlined style={{ marginRight: 4 }} />
                        Custom Operational Report Management
                    </Link>
                ),
            });
            items.push({
                title: (
                    <span>
                        <BarChartOutlined style={{ marginRight: 4 }} />
                        Report Editor
                    </span>
                ),
            });

            // Add entity ID if available in location state
            if (location.state?.reportId) {
                items.push({
                    title: (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            ID: {location.state.reportId}
                        </Text>
                    ),
                });
            }
        }

        return items;
    };

    return (
        <div style={{ 
            padding: '12px 24px', 
            background: '#fff', 
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
            <Breadcrumb
                items={getBreadcrumbItems()}
                style={{ fontSize: '14px' }}
            />
        </div>
    );
};

export default Breadcrumbs;
