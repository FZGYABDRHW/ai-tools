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
const builder_1 = __importDefault(require("../builder"));
const settingsService_1 = require("../services/settingsService");
const { Title, Text } = antd_1.Typography;
const TaskAuthForm = () => {
    const [taskId, setTaskId] = (0, react_1.useState)(() => {
        return localStorage.getItem('taskId') || '';
    });
    const { authToken, user, selectedServer } = (0, machines_1.useAuth)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [promptText, setPromptText] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        localStorage.setItem('taskId', taskId);
    }, [taskId]);
    const handleBuildPrompt = async () => {
        if (!taskId.trim()) {
            antd_1.message.error('Please enter a Task ID');
            return;
        }
        if (!authToken.trim()) {
            antd_1.message.error('Please login first');
            return;
        }
        setIsLoading(true);
        try {
            const prompt = await (0, builder_1.default)(Number(taskId), authToken, selectedServer);
            setPromptText(prompt);
            antd_1.message.success('Prompt built successfully!');
        }
        catch (error) {
            console.error('Error building prompt:', error);
            antd_1.message.error('Failed to build prompt. Please check your Task ID and Auth Token.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCopyToClipboard = () => {
        if (promptText) {
            navigator.clipboard.writeText(promptText).then(() => {
                antd_1.message.success('Copied to clipboard successfully!');
            }, (err) => {
                console.error('Failed to copy text: ', err);
                antd_1.message.error('Failed to copy to clipboard');
            });
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            width: '100%',
            boxSizing: 'border-box',
            height: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            overflow: 'hidden'
        }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #ff8c69',
                overflow: 'hidden',
                width: '100%',
                boxSizing: 'border-box',
                maxWidth: '100%'
            }, children: [(0, jsx_runtime_1.jsxs)("div", { style: {
                        background: 'linear-gradient(135deg, #ff8c69 0%, #ff9f7f 100%)',
                        padding: '16px 20px',
                        borderBottom: '1px solid rgba(255, 140, 105, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }, children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, { style: { color: '#fff', fontSize: '20px' } }), (0, jsx_runtime_1.jsx)(Title, { level: 4, style: {
                                margin: 0,
                                color: '#fff',
                                fontWeight: 600,
                                letterSpacing: '0.5px'
                            }, children: "Wowworks Task Builder" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { padding: '24px' }, children: [!settingsService_1.settingsService.hasValidOpenAIKey() && ((0, jsx_runtime_1.jsx)(antd_1.Alert, { message: "OpenAI API Key Required", description: (0, jsx_runtime_1.jsxs)("span", { children: ["You need to configure your OpenAI API key to use the AI features.", (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "link", icon: (0, jsx_runtime_1.jsx)(icons_1.SettingOutlined, {}), style: { padding: 0, height: 'auto', marginLeft: 8 }, onClick: () => window.location.hash = '#/settings', children: "Go to Settings" })] }), type: "warning", showIcon: true, style: { marginBottom: '24px' } })), (0, jsx_runtime_1.jsxs)(Title, { level: 3, style: { marginBottom: '24px' }, children: [(0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, { style: { marginRight: 8, color: '#ff8c69' } }), "AI Task Builder"] }), (0, jsx_runtime_1.jsxs)(antd_1.Form, { layout: "vertical", style: { maxWidth: 600 }, children: [(0, jsx_runtime_1.jsx)(antd_1.Form.Item, { label: "Task ID", required: true, rules: [{ required: true, message: 'Please enter a Task ID' }], children: (0, jsx_runtime_1.jsx)(antd_1.Input, { placeholder: "Enter Task ID", value: taskId, onChange: (e) => setTaskId(e.target.value), size: "large" }) }), (0, jsx_runtime_1.jsx)(antd_1.Form.Item, { children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", size: "large", onClick: handleBuildPrompt, loading: isLoading, icon: isLoading ? (0, jsx_runtime_1.jsx)(icons_1.LoadingOutlined, {}) : (0, jsx_runtime_1.jsx)(icons_1.FileTextOutlined, {}), disabled: !taskId.trim() || !authToken.trim() || !user || !settingsService_1.settingsService.hasValidOpenAIKey(), children: isLoading ? 'Building...' : 'Build Text for Prompt' }) })] }), promptText && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 24 }, children: [(0, jsx_runtime_1.jsx)(antd_1.Divider, {}), (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(Title, { level: 4, children: "Generated Prompt" }), (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "default", icon: (0, jsx_runtime_1.jsx)(icons_1.CopyOutlined, {}), onClick: handleCopyToClipboard, children: "Copy to Clipboard" })] }), (0, jsx_runtime_1.jsx)(antd_1.Card, { style: { backgroundColor: '#fafafa' }, children: (0, jsx_runtime_1.jsx)(Text, { style: { fontSize: '14px', whiteSpace: 'pre-wrap' }, children: promptText }) })] })] }))] })] }) }));
};
exports.default = TaskAuthForm;
//# sourceMappingURL=TaskAuthForm.js.map