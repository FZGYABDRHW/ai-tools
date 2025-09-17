"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServiceInitializer = void 0;
const axiosInstanceProxy_1 = require("./api-client/src/axiosInstanceProxy");
const servers_1 = require("./config/servers");
const buildServiceInitializer = (token, serverRegion = 'EU') => {
    const serverConfig = (0, servers_1.getServerConfig)(serverRegion);
    const config = {
        baseURL: serverConfig.baseURL,
    };
    const instance = (0, axiosInstanceProxy_1.setHeadersForInstance)({
        Authorization: `Bearer ${token}`,
        'Content-Security-Policy': `default-src 'self' 'unsafe-inline' data:; connect-src 'self' ${serverConfig.baseURL};`
    }, (0, axiosInstanceProxy_1.createInstance)(config));
    return (Service) => new Service({ instance });
};
exports.buildServiceInitializer = buildServiceInitializer;
//# sourceMappingURL=serviceInit.js.map