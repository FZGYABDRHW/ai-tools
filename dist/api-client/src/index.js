"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInterceptor = exports.setHeaders = exports.init = void 0;
const axiosInstanceProxy_1 = require("./axiosInstanceProxy");
const init = (config = {}) => (0, axiosInstanceProxy_1.setInstance)(config);
exports.init = init;
const setHeaders = (headers) => {
    (0, axiosInstanceProxy_1.setHeadersForInstance)(headers, axiosInstanceProxy_1.axiosInstance);
};
exports.setHeaders = setHeaders;
const setInterceptor = (resolveFn, rejectFn) => {
    (0, axiosInstanceProxy_1.setInterceptorForInstance)(resolveFn, rejectFn, axiosInstanceProxy_1.axiosInstance);
};
exports.setInterceptor = setInterceptor;
//# sourceMappingURL=index.js.map