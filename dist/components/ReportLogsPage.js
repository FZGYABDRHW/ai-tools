"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const react_router_dom_1 = require("react-router-dom");
const ReportLogsList_1 = __importDefault(require("./ReportLogsList"));
const ReportLogViewer_1 = __importDefault(require("./ReportLogViewer"));
const { Content } = antd_1.Layout;
const ReportLogsPage = () => {
    const [selectedLogId, setSelectedLogId] = (0, react_1.useState)(null);
    const [selectedReportId, setSelectedReportId] = (0, react_1.useState)(undefined);
    const location = (0, react_router_dom_1.useLocation)();
    (0, react_1.useEffect)(() => {
        // Get selectedReportId from navigation state or URL parameters
        if (location.state?.selectedReportId) {
            setSelectedReportId(location.state.selectedReportId);
        }
        else {
            // Fallback to URL parameters
            const searchParams = new URLSearchParams(location.search);
            const reportId = searchParams.get('reportId');
            if (reportId) {
                setSelectedReportId(reportId);
            }
        }
    }, [location.state, location.search]);
    const handleViewLog = (logId) => {
        setSelectedLogId(logId);
    };
    const handleBackToList = () => {
        setSelectedLogId(null);
    };
    return ((0, jsx_runtime_1.jsx)(antd_1.Layout, { style: { background: 'transparent' }, children: (0, jsx_runtime_1.jsx)(Content, { style: {
                padding: '0px',
                overflowY: 'auto'
            }, children: selectedLogId ? ((0, jsx_runtime_1.jsx)(ReportLogViewer_1.default, { reportLogId: selectedLogId, onBack: handleBackToList })) : ((0, jsx_runtime_1.jsx)(ReportLogsList_1.default, { onViewLog: handleViewLog, selectedReportId: selectedReportId })) }) }));
};
exports.default = ReportLogsPage;
//# sourceMappingURL=ReportLogsPage.js.map