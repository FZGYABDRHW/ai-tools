import {
    createInstance,
    CustomAxiosInstance,
    setHeadersForInstance,
} from './api-client/src/axiosInstanceProxy';
import { ServerRegion } from './types';
import { getServerConfig } from './config/servers';

export const buildServiceInitializer = (token: string, serverRegion: ServerRegion = 'EU') => {
    const serverConfig = getServerConfig(serverRegion);
    const config = {
        baseURL: serverConfig.baseURL,
    };

    const instance = setHeadersForInstance(
        {
            Authorization: `Bearer ${token}`,
            'Content-Security-Policy': `default-src 'self' 'unsafe-inline' data:; connect-src 'self' ${serverConfig.baseURL};`
        },
        createInstance(config),
    );

    return <T>(Service: new (arg0: { instance: CustomAxiosInstance; }) => T): T => new Service({ instance }) as T;
}

export type ServiceInitializer =  ReturnType<typeof buildServiceInitializer>;
