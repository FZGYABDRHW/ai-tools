import { ServerConfig } from '../types';

export const SERVER_CONFIGS: Record<string, ServerConfig> = {
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

export const DEFAULT_SERVER = 'EU';

export const getServerConfig = (region: string): ServerConfig => {
    return SERVER_CONFIGS[region] || SERVER_CONFIGS[DEFAULT_SERVER];
};

export const getAvailableServers = (): ServerConfig[] => {
    return Object.values(SERVER_CONFIGS);
};
