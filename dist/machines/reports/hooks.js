"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReportsRegistry = exports.useReport = exports.useReportsList = void 0;
const react_1 = require("react");
const react_2 = require("@xstate/react");
const reportMachine_1 = __importDefault(require("./reportMachine"));
const listMachine_1 = __importDefault(require("./listMachine"));
const registryMachine_1 = __importDefault(require("./registryMachine"));
const useReportsList = () => {
    const [state, send] = (0, react_2.useMachine)(listMachine_1.default);
    const reports = state.context.reports;
    const filters = state.context.filters;
    const isLoading = state.context.isLoading;
    const error = state.context.error;
    return {
        reports,
        filters,
        isLoading,
        error,
        refresh: () => send({ type: 'REFRESH' }),
        setFilters: (filters) => send({ type: 'FILTER', filters }),
        create: (name, prompt) => send({ type: 'CREATE', name, prompt }),
        update: (id, updates) => send({ type: 'UPDATE', id, updates }),
        remove: (id) => send({ type: 'DELETE', id })
    };
};
exports.useReportsList = useReportsList;
const useReport = (reportId, options) => {
    const [state, send] = (0, react_2.useMachine)(reportMachine_1.default, { input: { reportId, authToken: options?.authToken, server: options?.server } });
    (0, react_1.useEffect)(() => {
        send({ type: 'LOAD', id: reportId });
    }, [reportId, send]);
    return {
        state,
        context: state.context,
        load: () => send({ type: 'LOAD', id: reportId }),
        generate: (prompt, parameters) => send({ type: 'GENERATE', prompt, parameters }),
        pause: () => send({ type: 'PAUSE' }),
        resume: () => send({ type: 'RESUME' }),
        cancel: () => send({ type: 'CANCEL' }),
        rerunFromCompleted: () => send({ type: 'RERUN_FROM_COMPLETED' }),
        restartFromFailed: () => send({ type: 'RESTART_FROM_FAILED' })
    };
};
exports.useReport = useReport;
const useReportsRegistry = () => {
    const [state, send] = (0, react_2.useMachine)(registryMachine_1.default);
    return {
        actorRefs: state.context.actors,
        generatingIds: (0, react_1.useMemo)(() => Array.from(state.context.generating), [state.context.generating]),
        register: (id) => send({ type: 'REGISTER', id }),
        unregister: (id) => send({ type: 'UNREGISTER', id }),
        generate: (id, prompt, parameters) => send({ type: 'GENERATE', id, prompt, parameters }),
        pause: (id) => send({ type: 'PAUSE', id }),
        resume: (id) => send({ type: 'RESUME', id }),
        cancel: (id) => send({ type: 'CANCEL', id }),
        rerunFromCompleted: (id) => send({ type: 'RERUN_FROM_COMPLETED', id }),
        restartFromFailed: (id) => send({ type: 'RESTART_FROM_FAILED', id })
    };
};
exports.useReportsRegistry = useReportsRegistry;
//# sourceMappingURL=hooks.js.map