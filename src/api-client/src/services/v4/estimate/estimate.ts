import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Estimate, EstimateLog, EstimateVersions, ETA, TotalPrice } from './interfaces';
import { Price } from '../../v1/curator/task/interfaces';
import { CategoriesParam } from '../task/interfaces';

export class EstimateService extends BaseService {
    private readonly url: string = `${this.baseUrl}/estimate`;

    public readonly getEstimate = (
        taskId: number,
        params?: { version?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Estimate>>(`${this.url}/${taskId}`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly editEstimate = (taskId: number, params, options?: AxiosRequestConfig) =>
        this.http
            .patch<BaseResponse<Array<null>>>(`${this.url}/${taskId}/setEta`, params, options)
            .then(resp => resp.data.response);

    public readonly editEstimateTime = (
        taskId: number,
        params: { date: Date },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch<BaseResponse<Array<null>>>(`${this.url}/${taskId}/eta`, params, options)
            .then(resp => resp.data.response);

    public readonly getEstimateVersions = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<EstimateVersions>>(`${this.url}/${taskId}/versions`, options)
            .then(resp => resp.data.response);

    public readonly getEstimateLogs = (
        taskId: number,
        params?: { version?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ReadonlyArray<EstimateLog>>>(`${this.url}/${taskId}/logs`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getVersionCopy = (
        taskId: number,
        versionId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/${taskId}/version/${versionId}`, options)
            .then(resp => resp.data.response);

    public readonly sendEstimateToModeration = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Array<null>>>(`${this.url}/${taskId}/moderate`, {}, options)
            .then(resp => resp.data.response);

    public readonly rejectEstimate = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Array<null>>>(`${this.url}/${taskId}/reject`, {}, options)
            .then(resp => resp.data.response);

    public readonly approveEstimate = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Array<null>>>(`${this.url}/${taskId}/approve`, {}, options)
            .then(resp => resp.data.response);

    public readonly returnEstimateToWork = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/${taskId}/return-to-work`, {}, options)
            .then(resp => resp.data.response);

    public readonly getWorkPrices = (taskId: number, options) =>
        this.http
            .get<BaseResponse<Price>>(`${this.url}/${taskId}/work/price/tree`, options)
            .then(resp => resp.data.response);

    public readonly getExpendablePrice = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<TotalPrice>>(`${this.url}/${taskId}/expendable/price`, options)
            .then(resp => resp.data.response);

    public readonly getWorkPrice = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<TotalPrice>>(`${this.url}/${taskId}/work/price`, options)
            .then(resp => resp.data.response);

    calculateEta = (data: { categories: CategoriesParam[] }, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<{ eta: number }>>(`${this.url}/calculate-eta`, data, options)
            .then(resp => resp.data.response);

    getEtaDetails = (taskId: number, params?: { version?: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ETA>>(`${this.url}/${taskId}/eta-details`, { params, ...options })
            .then(resp => resp.data.response);
}

export default new EstimateService();
