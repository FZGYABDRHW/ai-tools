import {
    createInstance,
    CustomAxiosInstance,
} from './api-client/src/axiosInstanceProxy';

export const buildAuthServiceInitializer = () => {
    const config = {
        baseURL: 'https://api.eu.wowworks.org',
    };

    const instance = createInstance(config);

    return <T>(Service: new (arg0: { instance: CustomAxiosInstance; }) => T): T => new Service({ instance }) as T;
}

export type AuthServiceInitializer = ReturnType<typeof buildAuthServiceInitializer>;
