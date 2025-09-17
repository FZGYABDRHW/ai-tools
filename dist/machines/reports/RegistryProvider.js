"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReportsRegistryContext = exports.ReportsRegistryProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@xstate/react");
const registryMachine_1 = __importDefault(require("./registryMachine"));
const RegistryContext = (0, react_1.createContext)(null);
const ReportsRegistryProvider = ({ children }) => {
    const [state, send] = (0, react_2.useMachine)(registryMachine_1.default);
    return ((0, jsx_runtime_1.jsx)(RegistryContext.Provider, { value: { state, send }, children: children }));
};
exports.ReportsRegistryProvider = ReportsRegistryProvider;
const useReportsRegistryContext = () => {
    const ctx = (0, react_1.useContext)(RegistryContext);
    if (!ctx)
        throw new Error('useReportsRegistryContext must be used within ReportsRegistryProvider');
    return ctx;
};
exports.useReportsRegistryContext = useReportsRegistryContext;
//# sourceMappingURL=RegistryProvider.js.map