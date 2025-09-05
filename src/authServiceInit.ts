import {
    createInstance,
    CustomAxiosInstance,
} from './api-client/src/axiosInstanceProxy';
import { ServerRegion } from './types';
import { getServerConfig } from './config/servers';

export const buildAuthServiceInitializer = (serverRegion: ServerRegion = 'EU') => {
    const serverConfig = getServerConfig(serverRegion);
    
    const config = {
        baseURL: serverConfig.baseURL,
    };

    const instance = createInstance(config);

    return <T>(Service: new (arg0: { instance: CustomAxiosInstance; }) => T): T => new Service({ instance }) as T;
}

export type AuthServiceInitializer = ReturnType<typeof buildAuthServiceInitializer>;
