import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface CustomAxiosInstance extends AxiosInstance {
    config?: AxiosRequestConfig;
    headers?: { [index: string]: string };
}

let axiosInstance: CustomAxiosInstance;
let axiosInstanceConfig: AxiosRequestConfig;

declare module 'axios' {
    export interface AxiosRequestConfig {
        silentMode?: boolean;
    }
}

const setInstance = (config: AxiosRequestConfig): CustomAxiosInstance => {
    axiosInstance = createInstance(config);
    return axiosInstance;
};

export const createInstance = (config: AxiosRequestConfig): CustomAxiosInstance => {
    const instance: CustomAxiosInstance = axios.create(config);
    instance.config = config;
    return setHeadersForInstance(config.headers, instance);
};

export const setHeadersForInstance = (
    headers: { [index: string]: string } = {},
    instance: CustomAxiosInstance,
): CustomAxiosInstance => {
    const targetHeaders = { ...instance.config.headers, ...headers };
    instance.defaults.headers.common = { ...instance.defaults.headers.common, ...targetHeaders };
    return instance;
};

export const setInterceptorForInstance = (
    resolveFn,
    rejectFn,
    instance: CustomAxiosInstance,
): CustomAxiosInstance => {
    instance.interceptors.response.use(resolveFn, rejectFn);
    return instance;
};

export { axiosInstance, axiosInstanceConfig, setInstance };
