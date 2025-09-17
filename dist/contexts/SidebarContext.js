"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = exports.SidebarContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
exports.SidebarContext = (0, react_1.createContext)({
    isSidebarVisible: true,
    toggleSidebar: () => { },
    hideSidebar: () => { },
    showSidebar: () => { }
});
const SidebarProvider = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = (0, react_1.useState)(true);
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };
    const hideSidebar = () => {
        setIsSidebarVisible(false);
    };
    const showSidebar = () => {
        setIsSidebarVisible(true);
    };
    return ((0, jsx_runtime_1.jsx)(exports.SidebarContext.Provider, { value: {
            isSidebarVisible,
            toggleSidebar,
            hideSidebar,
            showSidebar
        }, children: children }));
};
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=SidebarContext.js.map