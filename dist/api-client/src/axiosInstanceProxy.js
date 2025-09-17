"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInstance = exports.axiosInstanceConfig = exports.axiosInstance = exports.setInterceptorForInstance = exports.setHeadersForInstance = exports.createInstance = void 0;
const axios_1 = __importStar(require("axios"));
let axiosInstance;
let axiosInstanceConfig;
// Initialize the global instance with a default config
exports.axiosInstance = axiosInstance = axios_1.default.create({});
const setInstance = (config) => {
    exports.axiosInstance = axiosInstance = (0, exports.createInstance)(config);
    return axiosInstance;
};
exports.setInstance = setInstance;
const createInstance = (config) => {
    const instance = axios_1.default.create(config);
    instance.config = config;
    return (0, exports.setHeadersForInstance)(config.headers, instance);
};
exports.createInstance = createInstance;
const setHeadersForInstance = (headers = {}, instance) => {
    // Convert headers to a plain object if they're AxiosHeaders
    const headersObj = headers instanceof axios_1.AxiosHeaders ? headers.toJSON() : headers;
    const configHeadersObj = instance.config?.headers instanceof axios_1.AxiosHeaders
        ? instance.config.headers.toJSON()
        : instance.config?.headers || {};
    const targetHeaders = { ...configHeadersObj, ...headersObj };
    instance.defaults.headers.common = {
        ...instance.defaults.headers.common,
        ...targetHeaders,
    };
    return instance;
};
exports.setHeadersForInstance = setHeadersForInstance;
const setInterceptorForInstance = (resolveFn, rejectFn, instance) => {
    instance.interceptors.response.use(resolveFn, rejectFn);
    return instance;
};
exports.setInterceptorForInstance = setInterceptorForInstance;
//# sourceMappingURL=axiosInstanceProxy.js.map