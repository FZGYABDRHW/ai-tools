"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReportsRegistry = exports.useReport = exports.useReportsList = exports.useReportsRegistryContext = exports.ReportsRegistryProvider = exports.reportsRegistryMachine = exports.reportsListMachine = exports.reportMachine = exports.handleProfileLoadFailure = exports.handleTokenRefreshSuccess = exports.handleLogoutSuccess = exports.clearLoading = exports.setLoading = exports.updateServer = exports.clearError = exports.setError = exports.clearAuthData = exports.setUser = exports.setAuthData = exports.checkStoredAuth = exports.refreshTokenActor = exports.logoutServiceActor = exports.loadUserProfileActor = exports.loginServiceActor = exports.initializeAuthActor = exports.useAuth = exports.useAuthMachine = exports.AuthProvider = exports.authMachine = void 0;
// Export the main machine
var authMachine_1 = require("./authMachine");
Object.defineProperty(exports, "authMachine", { enumerable: true, get: function () { return __importDefault(authMachine_1).default; } });
// Export the React integration
var AuthProvider_1 = require("./AuthProvider");
Object.defineProperty(exports, "AuthProvider", { enumerable: true, get: function () { return AuthProvider_1.AuthProvider; } });
Object.defineProperty(exports, "useAuthMachine", { enumerable: true, get: function () { return AuthProvider_1.useAuthMachine; } });
Object.defineProperty(exports, "useAuth", { enumerable: true, get: function () { return AuthProvider_1.useAuth; } });
// Export actors (for testing or advanced usage)
var actors_1 = require("./actors");
Object.defineProperty(exports, "initializeAuthActor", { enumerable: true, get: function () { return actors_1.initializeAuthActor; } });
Object.defineProperty(exports, "loginServiceActor", { enumerable: true, get: function () { return actors_1.loginServiceActor; } });
Object.defineProperty(exports, "loadUserProfileActor", { enumerable: true, get: function () { return actors_1.loadUserProfileActor; } });
Object.defineProperty(exports, "logoutServiceActor", { enumerable: true, get: function () { return actors_1.logoutServiceActor; } });
Object.defineProperty(exports, "refreshTokenActor", { enumerable: true, get: function () { return actors_1.refreshTokenActor; } });
// Export actions (for testing or advanced usage)
var actions_1 = require("./actions");
Object.defineProperty(exports, "checkStoredAuth", { enumerable: true, get: function () { return actions_1.checkStoredAuth; } });
Object.defineProperty(exports, "setAuthData", { enumerable: true, get: function () { return actions_1.setAuthData; } });
Object.defineProperty(exports, "setUser", { enumerable: true, get: function () { return actions_1.setUser; } });
Object.defineProperty(exports, "clearAuthData", { enumerable: true, get: function () { return actions_1.clearAuthData; } });
Object.defineProperty(exports, "setError", { enumerable: true, get: function () { return actions_1.setError; } });
Object.defineProperty(exports, "clearError", { enumerable: true, get: function () { return actions_1.clearError; } });
Object.defineProperty(exports, "updateServer", { enumerable: true, get: function () { return actions_1.updateServer; } });
Object.defineProperty(exports, "setLoading", { enumerable: true, get: function () { return actions_1.setLoading; } });
Object.defineProperty(exports, "clearLoading", { enumerable: true, get: function () { return actions_1.clearLoading; } });
Object.defineProperty(exports, "handleLogoutSuccess", { enumerable: true, get: function () { return actions_1.handleLogoutSuccess; } });
Object.defineProperty(exports, "handleTokenRefreshSuccess", { enumerable: true, get: function () { return actions_1.handleTokenRefreshSuccess; } });
Object.defineProperty(exports, "handleProfileLoadFailure", { enumerable: true, get: function () { return actions_1.handleProfileLoadFailure; } });
// Reports machines
var reportMachine_1 = require("./reports/reportMachine");
Object.defineProperty(exports, "reportMachine", { enumerable: true, get: function () { return __importDefault(reportMachine_1).default; } });
var listMachine_1 = require("./reports/listMachine");
Object.defineProperty(exports, "reportsListMachine", { enumerable: true, get: function () { return __importDefault(listMachine_1).default; } });
var registryMachine_1 = require("./reports/registryMachine");
Object.defineProperty(exports, "reportsRegistryMachine", { enumerable: true, get: function () { return __importDefault(registryMachine_1).default; } });
var RegistryProvider_1 = require("./reports/RegistryProvider");
Object.defineProperty(exports, "ReportsRegistryProvider", { enumerable: true, get: function () { return RegistryProvider_1.ReportsRegistryProvider; } });
Object.defineProperty(exports, "useReportsRegistryContext", { enumerable: true, get: function () { return RegistryProvider_1.useReportsRegistryContext; } });
var hooks_1 = require("./reports/hooks");
Object.defineProperty(exports, "useReportsList", { enumerable: true, get: function () { return hooks_1.useReportsList; } });
Object.defineProperty(exports, "useReport", { enumerable: true, get: function () { return hooks_1.useReport; } });
Object.defineProperty(exports, "useReportsRegistry", { enumerable: true, get: function () { return hooks_1.useReportsRegistry; } });
//# sourceMappingURL=index.js.map