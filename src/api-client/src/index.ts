import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
    setInstance,
    axiosInstance,
    setHeadersForInstance,
    setInterceptorForInstance,
} from './axiosInstanceProxy';

export const init = (config: AxiosRequestConfig = {}): AxiosInstance => setInstance(config);

export const setHeaders = (headers: { [index: string]: string }): void => {
    setHeadersForInstance(headers, axiosInstance);
};

export const setInterceptor = (resolveFn, rejectFn) => {
    setInterceptorForInstance(resolveFn, rejectFn, axiosInstance);
};
