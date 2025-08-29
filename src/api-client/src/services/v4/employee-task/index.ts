import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { EmployeeTask, ListParams, Action, FullListParams, Statisctic } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class EmployeeTaskService extends BaseService {
    private readonly url: string = `${this.baseUrl}/employee-task`;

    public readonly getFullList = (params: FullListParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: EmployeeTask[]; totalCount: number }>>(this.url, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getActiveList = (params: ListParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: EmployeeTask[]; totalCount: number }>>(
                `${this.url}/active`,
                { params, ...options },
            )
            .then(serviceData => serviceData.data.response);

    public readonly getDeferredList = (params: ListParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: EmployeeTask[]; totalCount: number }>>(
                `${this.url}/deferred`,
                { params, ...options },
            )
            .then(serviceData => serviceData.data.response);

    public readonly getCurrent = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<EmployeeTask>>(`${this.url}/current`, options)
            .then(serviceData => serviceData.data.response);

    public readonly getEmployeeTask = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<EmployeeTask>>(`${this.url}/${taskId}`, options)
            .then(resp => resp.data.response);

    public readonly sendAction = (id: number, data: Action, options?: AxiosRequestConfig) => {
        return this.http
            .put<BaseResponse<null>>(`${this.url}/${id}`, data, options)
            .then(serviceData => serviceData.data.messages);
    };

    public readonly getStatistic = (
        params?: { userId?: number; teamId?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Statisctic>>(`${this.url}/statistic`, { params, ...options })
            .then(resp => resp.data.response);
}

export default new EmployeeTaskService();
