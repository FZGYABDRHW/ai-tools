"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const machines_1 = require("../machines");
const LoginForm_1 = __importDefault(require("./LoginForm"));
const { Title, Text } = antd_1.Typography;
const AuthGuard = ({ children }) => {
    const { authToken, user } = (0, machines_1.useAuth)();
    if (!authToken || !user) {
        return ((0, jsx_runtime_1.jsx)("div", { style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                padding: '24px'
            }, children: (0, jsx_runtime_1.jsxs)(antd_1.Card, { style: { maxWidth: 400, width: '100%' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.UserOutlined, { style: { fontSize: '48px', color: '#1890ff', marginBottom: '16px' } }), (0, jsx_runtime_1.jsx)(Title, { level: 3, children: "Authentication Required" }), (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "Please login to access AI Tools features" })] }), (0, jsx_runtime_1.jsx)(LoginForm_1.default, {})] }) }));
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.default = AuthGuard;
//# sourceMappingURL=AuthGuard.js.map