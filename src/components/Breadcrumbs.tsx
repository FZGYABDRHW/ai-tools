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
