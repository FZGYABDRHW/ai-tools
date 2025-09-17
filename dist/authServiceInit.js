"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAuthServiceInitializer = void 0;
const axiosInstanceProxy_1 = require("./api-client/src/axiosInstanceProxy");
const servers_1 = require("./config/servers");
const buildAuthServiceInitializer = (serverRegion = 'EU') => {
    const serverConfig = (0, servers_1.getServerConfig)(serverRegion);
    const config = {
        baseURL: serverConfig.baseURL,
    };
    const instance = (0, axiosInstanceProxy_1.createInstance)(config);
    return (Service) => new Service({ instance });
};
exports.buildAuthServiceInitializer = buildAuthServiceInitializer;
//# sourceMappingURL=authServiceInit.js.map