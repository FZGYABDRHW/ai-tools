import { AxiosRequestConfig } from 'axios';

import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AdditionalWork, TotalPrices, WorkItem, WorkListParams } from './interfaces';
import { UpdateWorkParams } from './interfaces';
import { RequestWork, WorkType } from './interfaces';

export class WorksService extends BaseService {
    private readonly url: string = `${this.baseUrl}/estimate`;

    public readonly get = (
        taskId: number,
        params?: { version?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<WorkItem>>(`${this.url}/work/${taskId}`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getWorks = (
        taskId: number,
        params?: WorkListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<{ items: WorkItem[] }>>(`${this.url}/${taskId}/work`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getWorksTotalPrice = (
        taskId: number,
        params?: { version?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<TotalPrices>>(`${this.url}/${taskId}/work/price`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getRejectedWorks = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: WorkItem[] }>>(
                `${this.url}/${taskId}/work/rejected`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly addWork = (taskId: number, params: RequestWork, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Array<null>>>(`${this.url}/${taskId}/work`, params, options)
            .then(resp => resp.data.response);

    public readonly updateWork = (
        workId: number,
        params: UpdateWorkParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<Array<null>>>(`${this.url}/work/${workId}`, params, options)
            .then(resp => resp.data.response);

    public readonly changeWorkType = (
        workId: number,
        params: { type: WorkType },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch<BaseResponse<WorkItem>>(
                `${this.url}/work/${workId}/change-type`,
                params,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getAdditionalWorks = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<AdditionalWork>>(`${this.url}/${taskId}/additionalWorks`, options)
            .then(resp => resp.data.response);
}

export default new WorksService();
