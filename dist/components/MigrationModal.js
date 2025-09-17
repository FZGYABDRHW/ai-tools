"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const antd_1 = require("antd");
const migrationService_1 = require("../services/migrationService");
const { Text, Title } = antd_1.Typography;
const MigrationModal = ({ visible, onComplete }) => {
    const [step, setStep] = (0, react_1.useState)('checking');
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [message, setMessage] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)(null);
    const [migrationResult, setMigrationResult] = (0, react_1.useState)(null);
    const [localStorageData, setLocalStorageData] = (0, react_1.useState)(null);
    const [validationResult, setValidationResult] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (visible) {
            startMigration();
        }
    }, [visible]);
    const startMigration = async () => {
        try {
            setStep('checking');
            setMessage('Checking for existing data...');
            setProgress(10);
            // Check if localStorage data exists
            const hasData = await migrationService_1.rendererMigrationService.checkLocalStorageData();
            if (!hasData) {
                setMessage('No existing data found. Migration not needed.');
                setStep('completed');
                setProgress(100);
                return;
            }
            setStep('extracting');
            setMessage('Extracting data from localStorage...');
            setProgress(30);
            // Extract localStorage data
            const data = await migrationService_1.rendererMigrationService.extractLocalStorageData();
            setLocalStorageData(data);
            setStep('validating');
            setMessage('Validating data integrity...');
            setProgress(50);
            // Validate data
            const validation = await migrationService_1.rendererMigrationService.validateLocalStorageData();
            setValidationResult(validation);
            if (!validation.isValid) {
                setStep('error');
                setError(`Data validation failed: ${validation.issues.join(', ')}`);
                return;
            }
            setStep('migrating');
            setMessage('Migrating data to file system...');
            setProgress(70);
            // Migrate to file system
            const result = await window.electronAPI.migration.migrateFromLocalStorage(data);
            setMigrationResult(result);
            if (result.success) {
                setMessage('Migration completed successfully!');
                setProgress(90);
                // Clear localStorage
                await migrationService_1.rendererMigrationService.clearLocalStorage();
                setStep('completed');
                setProgress(100);
                setMessage('Data has been successfully migrated to file system.');
            }
            else {
                setStep('error');
                setError(`Migration failed: ${result.errors.join(', ')}`);
            }
        }
        catch (error) {
            setStep('error');
            setError(`Migration error: ${error.message}`);
        }
    };
    const handleClose = () => {
        onComplete(step === 'completed');
    };
    const getStepDescription = () => {
        switch (step) {
            case 'checking':
                return 'Checking for existing localStorage data...';
            case 'extracting':
                return 'Extracting data from localStorage...';
            case 'validating':
                return 'Validating data integrity...';
            case 'migrating':
                return 'Migrating data to file system...';
            case 'completed':
                return 'Migration completed successfully!';
            case 'error':
                return 'Migration failed';
            default:
                return '';
        }
    };
    return ((0, jsx_runtime_1.jsx)(antd_1.Modal, { title: "Data Migration", open: visible, onCancel: handleClose, footer: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", onClick: handleClose, children: step === 'completed' ? 'Continue' : 'Close' }), closable: step === 'completed' || step === 'error', width: 600, children: (0, jsx_runtime_1.jsxs)(antd_1.Space, { direction: "vertical", style: { width: '100%' }, size: "large", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Text, { children: message }), (0, jsx_runtime_1.jsx)(antd_1.Progress, { percent: progress, status: step === 'error' ? 'exception' : 'active', style: { marginTop: 8 } })] }), step === 'validating' && validationResult && ((0, jsx_runtime_1.jsx)(antd_1.Card, { title: "Data Validation", size: "small", children: (0, jsx_runtime_1.jsxs)(antd_1.Descriptions, { size: "small", column: 1, children: [(0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Reports", children: validationResult.dataSummary.reports }), (0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Logs", children: validationResult.dataSummary.logs }), (0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Checkpoints", children: validationResult.dataSummary.checkpoints }), (0, jsx_runtime_1.jsx)(antd_1.Descriptions.Item, { label: "Generation States", children: validationResult.dataSummary.generationStates }), (0, jsx_runtime_1.jsxs)(antd_1.Descriptions.Item, { label: "Total Size", children: [(validationResult.dataSummary.totalSize / 1024).toFixed(2), " KB"] })] }) })), step === 'error' && error && ((0, jsx_runtime_1.jsx)(antd_1.Alert, { message: "Migration Failed", description: error, type: "error", showIcon: true })), step === 'completed' && migrationResult && ((0, jsx_runtime_1.jsx)(antd_1.Alert, { message: "Migration Successful", description: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: "Successfully migrated the following data:" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: ["Reports: ", migrationResult.migratedData.reports] }), (0, jsx_runtime_1.jsxs)("li", { children: ["Logs: ", migrationResult.migratedData.logs] }), (0, jsx_runtime_1.jsxs)("li", { children: ["Checkpoints: ", migrationResult.migratedData.checkpoints] }), (0, jsx_runtime_1.jsxs)("li", { children: ["Generation States: ", migrationResult.migratedData.generationStates] })] }), migrationResult.backupCreated && ((0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: "A backup was created before migration." }) })), migrationResult.errors && migrationResult.errors.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)(Text, { type: "warning", children: "Some items failed to migrate:" }) }), (0, jsx_runtime_1.jsx)("ul", { children: migrationResult.errors.map((error, index) => ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(Text, { type: "secondary", children: error }) }, index))) })] }))] }), type: "success", showIcon: true })), step === 'migrating' && localStorageData && ((0, jsx_runtime_1.jsx)(antd_1.Card, { title: "Migration Progress", size: "small", children: (0, jsx_runtime_1.jsxs)(Text, { type: "secondary", children: ["Migrating ", localStorageData.metadata.keys.length, " data sources..."] }) }))] }) }));
};
exports.MigrationModal = MigrationModal;
//# sourceMappingURL=MigrationModal.js.map