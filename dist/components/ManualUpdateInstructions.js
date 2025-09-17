"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const icons_1 = require("@ant-design/icons");
const { Text, Title, Paragraph } = antd_1.Typography;
const ManualUpdateInstructions = ({ visible, onClose, version, fileName, filePath, }) => {
    const handleClose = () => {
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)(antd_1.Modal, { title: (0, jsx_runtime_1.jsxs)(antd_1.Space, { children: [(0, jsx_runtime_1.jsx)(icons_1.DownloadOutlined, { style: { color: '#52c41a' } }), (0, jsx_runtime_1.jsx)("span", { children: "Manual Update Instructions" })] }), open: visible, onCancel: handleClose, footer: [
            (0, jsx_runtime_1.jsx)(antd_1.Button, { onClick: handleClose, children: "Got It" }, "close")
        ], width: 700, centered: true, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", style: { width: '100%' }, size: "large", children: [(0, jsx_runtime_1.jsx)(antd_1.Alert, { message: "Download Complete!", description: `Update package v${version} has been downloaded to your Downloads folder.`, type: "success", showIcon: true, icon: (0, jsx_runtime_1.jsx)(icons_1.CheckCircleOutlined, {}) }), (0, jsx_runtime_1.jsx)("div", { style: {
                        padding: 16,
                        backgroundColor: '#f6ffed',
                        borderRadius: 6,
                        border: '1px solid #b7eb8f'
                    }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, children: "Downloaded File:" }), (0, jsx_runtime_1.jsx)(Text, { code: true, children: fileName }), (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "Location: Downloads folder" })] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Title, { level: 4, children: "\uD83D\uDCF1 Manual Update Steps" }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "large", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                        padding: 16,
                                        backgroundColor: '#fff7e6',
                                        borderRadius: 6,
                                        border: '1px solid #ffd591'
                                    }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, style: { color: '#d46b08' }, children: "1\uFE0F\u20E3 Quit Current Application" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Close Wowworks AI Tools completely" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Make sure it's not running in the background" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Check Activity Monitor if needed" })] }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                        padding: 16,
                                        backgroundColor: '#f6ffed',
                                        borderRadius: 6,
                                        border: '1px solid #b7eb8f'
                                    }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, style: { color: '#389e0d' }, children: "2\uFE0F\u20E3 Extract Update Package" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Go to Downloads folder" }), (0, jsx_runtime_1.jsxs)(Text, { children: ["\u2022 Find: ", (0, jsx_runtime_1.jsx)(Text, { code: true, children: fileName })] }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Double-click to extract the ZIP file" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 You'll get a new app folder" })] }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                        padding: 16,
                                        backgroundColor: '#e6f7ff',
                                        borderRadius: 6,
                                        border: '1px solid #91d5ff'
                                    }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, style: { color: '#096dd9' }, children: "3\uFE0F\u20E3 Replace Application" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Drag the new app to Applications folder" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Replace the old version when prompted" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Enter your password if asked" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Wait for the copy to complete" })] }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                        padding: 16,
                                        backgroundColor: '#fff0f6',
                                        borderRadius: 6,
                                        border: '1px solid #ffadd2'
                                    }, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)(Text, { strong: true, style: { color: '#c41d7f' }, children: "4\uFE0F\u20E3 Launch New Version" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Open the new version from Applications" }), (0, jsx_runtime_1.jsxs)(Text, { children: ["\u2022 Verify the version shows v", version] }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Your data and settings will be preserved" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Delete the old version after confirming it works" })] }) })] })] }), (0, jsx_runtime_1.jsx)(antd_1.Divider, {}), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(Title, { level: 5, children: [(0, jsx_runtime_1.jsx)(icons_1.ExclamationCircleOutlined, { style: { color: '#faad14', marginRight: 8 } }), "Important Notes"] }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", children: [(0, jsx_runtime_1.jsx)(Text, { children: "\u2022 This method bypasses code signing requirements" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Your data and preferences will be preserved" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 The old version will remain until you delete it" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 If you encounter issues, you can revert to the old version" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(Title, { level: 5, children: [(0, jsx_runtime_1.jsx)(icons_1.InfoCircleOutlined, { style: { color: '#1890ff', marginRight: 8 } }), "Troubleshooting"] }), (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", size: "small", children: [(0, jsx_runtime_1.jsx)(Text, { children: "\u2022 If the app won't open, check Gatekeeper settings" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Right-click the app \u2192 \"Open\" to bypass security" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Make sure you have sufficient disk space" }), (0, jsx_runtime_1.jsx)(Text, { children: "\u2022 Contact support if you encounter persistent issues" })] })] })] }) }));
};
exports.default = ManualUpdateInstructions;
//# sourceMappingURL=ManualUpdateInstructions.js.map