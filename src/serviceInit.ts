import {
    createInstance,
    CustomAxiosInstance,
    setHeadersForInstance,
} from './api-client/src/axiosInstanceProxy';

export const buildServiceInitializer = (token: string) => {
    const config = {
        baseURL: 'https://api.eu.wowworks.org',
    };

    const instance = setHeadersForInstance(
        {
            Authorization: `Bearer ${token}`,
            'Content-Security-Policy': `default-src 'self' 'unsafe-inline' data:; connect-src 'self' https://api.wowworks.ru;`
        },
        createInstance(config),
    );

    return <T>(Service: new (arg0: { instance: CustomAxiosInstance; }) => T): T => new Service({ instance }) as T;
}

export type ServiceInitializer =  ReturnType<typeof buildServiceInitializer>;
