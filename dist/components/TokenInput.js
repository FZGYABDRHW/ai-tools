"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const machines_1 = require("../machines");
const { Text } = antd_1.Typography;
const TokenInput = () => {
    const { authToken } = (0, machines_1.useAuth)();
    // Note: setAuthToken is not available in the new XState system
    // This component might need to be refactored or removed
    const setAuthToken = (token) => {
        console.warn('setAuthToken is not available in XState auth system');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.KeyOutlined, { style: { color: '#1890ff', fontSize: '16px' } }), (0, jsx_runtime_1.jsx)(Text, { strong: true, style: { color: '#666', fontSize: '14px' }, children: "Auth Token" })] }), (0, jsx_runtime_1.jsx)(antd_1.Input, { placeholder: "Enter your authentication token", value: authToken, onChange: (e) => setAuthToken(e.target.value), style: {
                    width: 320,
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9'
                }, size: "large", allowClear: true }), authToken && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '4px'
                }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#52c41a'
                        } }), (0, jsx_runtime_1.jsx)(Text, { style: { fontSize: '12px', color: '#52c41a' }, children: "Connected" })] }))] }));
};
exports.default = TokenInput;
//# sourceMappingURL=TokenInput.js.map