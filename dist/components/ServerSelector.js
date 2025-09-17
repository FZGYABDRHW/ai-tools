"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const machines_1 = require("../machines");
const servers_1 = require("../config/servers");
const { Text } = antd_1.Typography;
const { Option } = antd_1.Select;
const ServerSelector = () => {
    const { selectedServer, setSelectedServer } = (0, machines_1.useAuth)();
    const availableServers = (0, servers_1.getAvailableServers)();
    const handleServerChange = (value) => {
        setSelectedServer(value);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.GlobalOutlined, { style: { color: '#1890ff', fontSize: '16px' } }), (0, jsx_runtime_1.jsx)(Text, { strong: true, style: { color: '#666', fontSize: '14px' }, children: "Server" })] }), (0, jsx_runtime_1.jsx)(antd_1.Select, { value: selectedServer, onChange: handleServerChange, style: {
                    width: 140,
                    borderRadius: '6px'
                }, size: "large", children: availableServers.map((server) => ((0, jsx_runtime_1.jsx)(Option, { value: server.region, children: (0, jsx_runtime_1.jsxs)("span", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)("span", { style: { fontSize: '16px' }, children: server.flag }), (0, jsx_runtime_1.jsx)("span", { children: server.name })] }) }, server.region))) })] }));
};
exports.default = ServerSelector;
//# sourceMappingURL=ServerSelector.js.map