import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders } from "axios";

export interface CustomAxiosInstance extends AxiosInstance {
  config?: AxiosRequestConfig;
  headers?: AxiosHeaders | { [index: string]: string };
}

let axiosInstance: CustomAxiosInstance;
let axiosInstanceConfig: AxiosRequestConfig;

// Initialize the global instance with a default config
axiosInstance = axios.create({});

declare module "axios" {
  export interface AxiosRequestConfig {
    silentMode?: boolean;
  }
}

const setInstance = (config: AxiosRequestConfig): CustomAxiosInstance => {
  axiosInstance = createInstance(config);
  return axiosInstance;
};

export const createInstance = (
  config: AxiosRequestConfig
): CustomAxiosInstance => {
  const instance: CustomAxiosInstance = axios.create(config);
  instance.config = config;
  return setHeadersForInstance(config.headers as any, instance);
};

export const setHeadersForInstance = (
  headers: AxiosHeaders | { [index: string]: string } = {},
  instance: CustomAxiosInstance
): CustomAxiosInstance => {
  // Convert headers to a plain object if they're AxiosHeaders
  const headersObj =
    headers instanceof AxiosHeaders ? headers.toJSON() : headers;
  const configHeadersObj =
    instance.config?.headers instanceof AxiosHeaders
      ? instance.config.headers.toJSON()
      : instance.config?.headers || {};

  const targetHeaders = { ...configHeadersObj, ...headersObj };
  instance.defaults.headers.common = {
    ...instance.defaults.headers.common,
    ...targetHeaders,
  };
  return instance;
};

export const setInterceptorForInstance = (
  resolveFn,
  rejectFn,
  instance: CustomAxiosInstance
): CustomAxiosInstance => {
  instance.interceptors.response.use(resolveFn, rejectFn);
  return instance;
};

export { axiosInstance, axiosInstanceConfig, setInstance };
