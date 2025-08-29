import { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
    axiosInstance as globalaxiosInstance,
    axiosInstanceConfig,
    createInstance,
    CustomAxiosInstance,
} from '../axiosInstanceProxy';

export interface BaseEnvironment {
    config?: AxiosRequestConfig;
    instance?: CustomAxiosInstance;
}

export interface BaseServiceEnvironment extends BaseEnvironment {
    version?: string;
}

export default class BaseService {
    protected APIVersion: string;
    protected baseUrl: string;
    protected http: CustomAxiosInstance;

    constructor({ version, config, instance }: BaseServiceEnvironment) {
        if (instance) {
            this.http = instance;
        } else if (config) {
            this.http = createInstance(config);
        } else {
            this.http = globalaxiosInstance;
        }
        this.APIVersion = version;
        if (version) {
            this.baseUrl = `/${this.APIVersion}`;
        } else {
            this.baseUrl = ``;
        }
    }
}
