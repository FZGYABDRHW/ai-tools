"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const machines_1 = require("../machines");
const SidebarContext_1 = require("../contexts/SidebarContext");
const VersionDisplay_1 = __importDefault(require("./VersionDisplay"));
const { Header } = antd_1.Layout;
const { Text } = antd_1.Typography;
const AppHeader = () => {
    const { user, logout, isLoading } = (0, machines_1.useAuth)();
    const { isSidebarVisible, toggleSidebar } = (0, react_1.useContext)(SidebarContext_1.SidebarContext);
    const handleLogout = async () => {
        await logout();
    };
    return ((0, jsx_runtime_1.jsxs)(Header, { style: {
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            padding: '0 16px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1000
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }, children: [(0, jsx_runtime_1.jsx)(antd_1.Button, { type: "text", icon: isSidebarVisible ? (0, jsx_runtime_1.jsx)(icons_1.MenuFoldOutlined, {}) : (0, jsx_runtime_1.jsx)(icons_1.MenuUnfoldOutlined, {}), onClick: toggleSidebar, style: {
                            color: '#ff8c69',
                            fontSize: '14px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255, 140, 105, 0.1)',
                            border: '1px solid rgba(255, 140, 105, 0.3)',
                            borderRadius: '6px'
                        } }), (0, jsx_runtime_1.jsx)("div", { style: { width: '130px', flexShrink: 0, flexGrow: 0 }, children: (0, jsx_runtime_1.jsx)(VersionDisplay_1.default, { compact: true }) })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px'
                }, children: [user && ((0, jsx_runtime_1.jsxs)("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: 'rgba(255, 140, 105, 0.1)',
                            border: '1px solid rgba(255, 140, 105, 0.3)'
                        }, children: [(0, jsx_runtime_1.jsx)(icons_1.UserOutlined, { style: {
                                    color: '#ff8c69',
                                    fontSize: '14px'
                                } }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }, children: [(0, jsx_runtime_1.jsx)(Text, { style: {
                                            color: '#333',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            lineHeight: 1
                                        }, children: user.name }), (0, jsx_runtime_1.jsxs)(Text, { style: {
                                            color: '#666',
                                            fontSize: '10px',
                                            lineHeight: 1
                                        }, children: ["ID: ", user.id] })] })] })), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", icon: (0, jsx_runtime_1.jsx)(icons_1.LogoutOutlined, {}), onClick: handleLogout, loading: isLoading, size: "middle", style: {
                            background: '#ff8c69',
                            border: '1px solid #ff8c69',
                            color: '#fff',
                            height: '32px',
                            fontSize: '12px'
                        }, children: "Logout" })] })] }));
};
exports.default = AppHeader;
//# sourceMappingURL=Header.js.map