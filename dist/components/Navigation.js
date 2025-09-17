"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const icons_1 = require("@ant-design/icons");
const SidebarContext_1 = require("../contexts/SidebarContext");
const logo_png_1 = __importDefault(require("../logo.png"));
const { Sider } = antd_1.Layout;
const { Title } = antd_1.Typography;
const Navigation = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const { isSidebarVisible } = (0, react_1.useContext)(SidebarContext_1.SidebarContext);
    const menuItems = [
        {
            key: '/task-text-builder',
            icon: (0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, {}),
            label: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/task-text-builder", children: "Wowworks Task Builder" }),
        },
        {
            key: '/reports',
            icon: (0, jsx_runtime_1.jsx)(icons_1.UnorderedListOutlined, {}),
            label: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/reports", children: "Wowworks Report Management" }),
        },
        {
            key: '/report-logs',
            icon: (0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, {}),
            label: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/report-logs", children: "Report Logs" }),
        },
        {
            key: '/settings',
            icon: (0, jsx_runtime_1.jsx)(icons_1.SettingOutlined, {}),
            label: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/settings", children: "Settings" }),
        },
    ];
    if (!isSidebarVisible) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(Sider, { width: 250, theme: "light", style: {
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            borderRight: '1px solid #e8e8e8',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
        }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    padding: '8px 16px',
                    textAlign: 'left',
                    background: 'transparent',
                    borderBottom: '1px solid #e8e8e8',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center'
                }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }, children: [(0, jsx_runtime_1.jsx)("img", { src: logo_png_1.default, alt: "Wowworks Logo", style: {
                                height: '32px',
                                width: 'auto'
                            } }), (0, jsx_runtime_1.jsx)("span", { style: {
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#ff8c69'
                            }, children: "AI Tools" })] }) }), (0, jsx_runtime_1.jsx)("div", { style: { padding: '16px 0' }, children: (0, jsx_runtime_1.jsx)(antd_1.Menu, { mode: "inline", selectedKeys: [location.pathname], items: menuItems, style: {
                        height: '100%',
                        borderRight: 0,
                        background: 'transparent'
                    } }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '16px',
                    textAlign: 'center',
                    background: 'rgba(255, 140, 105, 0.05)',
                    borderTop: '1px solid rgba(255, 140, 105, 0.1)'
                }, children: (0, jsx_runtime_1.jsx)("div", { style: {
                        fontSize: '11px',
                        color: '#666',
                        fontWeight: 500
                    }, children: "Powered by Vlad v5.0" }) })] }));
};
exports.default = Navigation;
//# sourceMappingURL=Navigation.js.map