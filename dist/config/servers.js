"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableServers = exports.getServerConfig = exports.DEFAULT_SERVER = exports.SERVER_CONFIGS = void 0;
exports.SERVER_CONFIGS = {
    EU: {
        region: 'EU',
        name: 'Europe',
        baseURL: 'https://api.eu.wowworks.org',
        flag: '🇪🇺'
    },
    RU: {
        region: 'RU',
        name: 'Russia',
        baseURL: 'https://api.wowworks.ru/',
        flag: '🇷🇺'
    }
};
exports.DEFAULT_SERVER = 'EU';
const getServerConfig = (region) => {
    return exports.SERVER_CONFIGS[region] || exports.SERVER_CONFIGS[exports.DEFAULT_SERVER];
};
exports.getServerConfig = getServerConfig;
const getAvailableServers = () => {
    return Object.values(exports.SERVER_CONFIGS);
};
exports.getAvailableServers = getAvailableServers;
//# sourceMappingURL=servers.js.map