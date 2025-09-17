"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const icons_1 = require("@ant-design/icons");
const { Text } = antd_1.Typography;
const Breadcrumbs = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const getBreadcrumbItems = () => {
        const pathname = location.pathname;
        const items = [];
        // Always show home
        items.push({
            title: ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/task-text-builder", children: [(0, jsx_runtime_1.jsx)(icons_1.HomeOutlined, { style: { marginRight: 4 } }), "Home"] })),
        });
        // Add specific breadcrumbs based on current route
        if (pathname === '/task-text-builder') {
            items.push({
                title: ((0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, { style: { marginRight: 4 } }), "Wowworks Task Builder"] })),
            });
        }
        else if (pathname === '/reports') {
            items.push({
                title: ((0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)(icons_1.UnorderedListOutlined, { style: { marginRight: 4 } }), "Wowworks Report Management"] })),
            });
        }
        else if (pathname === '/custom-report') {
            // Get report ID and tab from URL parameters
            const searchParams = new URLSearchParams(location.search);
            const reportId = searchParams.get('reportId');
            const tab = searchParams.get('tab');
            items.push({
                title: ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/reports", children: [(0, jsx_runtime_1.jsx)(icons_1.UnorderedListOutlined, { style: { marginRight: 4 } }), "Wowworks Report Management"] })),
            });
            items.push({
                title: ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: `/custom-report?reportId=${reportId}`, children: [(0, jsx_runtime_1.jsx)(icons_1.BarChartOutlined, { style: { marginRight: 4 } }), "Report"] })),
            });
            // Add report ID if available
            if (reportId) {
                items.push({
                    title: ((0, jsx_runtime_1.jsxs)("span", { children: ["ID: ", reportId] })),
                });
            }
            // Add tab if available
            if (tab) {
                items.push({
                    title: ((0, jsx_runtime_1.jsx)("span", { children: tab === 'logs' ? 'Logs' : 'Editor' })),
                });
            }
        }
        else if (pathname === '/report-logs') {
            // Get report ID from URL parameters
            const searchParams = new URLSearchParams(location.search);
            const reportId = searchParams.get('reportId');
            items.push({
                title: ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/reports", children: [(0, jsx_runtime_1.jsx)(icons_1.UnorderedListOutlined, { style: { marginRight: 4 } }), "Wowworks Report Management"] })),
            });
            if (reportId) {
                // If viewing logs for a specific report
                items.push({
                    title: ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: `/custom-report?reportId=${reportId}`, children: [(0, jsx_runtime_1.jsx)(icons_1.BarChartOutlined, { style: { marginRight: 4 } }), "Report"] })),
                });
                items.push({
                    title: ((0, jsx_runtime_1.jsxs)("span", { children: ["ID: ", reportId] })),
                });
                items.push({
                    title: ((0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)(icons_1.HistoryOutlined, { style: { marginRight: 4 } }), "Logs"] })),
                });
            }
            else {
                // If viewing all logs
                items.push({
                    title: ((0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)(icons_1.HistoryOutlined, { style: { marginRight: 4 } }), "Report Logs"] })),
                });
            }
        }
        return items;
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            padding: '12px 24px',
            background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)'
        }, children: (0, jsx_runtime_1.jsx)(antd_1.Breadcrumb, { items: getBreadcrumbItems(), style: { fontSize: '14px' } }) }));
};
exports.default = Breadcrumbs;
//# sourceMappingURL=Breadcrumbs.js.map