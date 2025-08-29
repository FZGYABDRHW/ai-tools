import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    ExpendableItem,
    ExpendablesParams,
    TotalPrice,
    UpdateExpendable,
    NewExpendable,
    Estimate,
    ExpendableInfo,
    TransportCompanies,
    ExpendableType,
} from './interfaces';

export class ExpendablesService extends BaseService {
    private readonly url: string = `${this.baseUrl}/estimate`;

    public readonly getExpendableInfoById = (expendablesId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ExpendableInfo>>(`${this.url}/expendable/${expendablesId}`, options)
            .then(resp => resp.data.response);

    public readonly getExpendables = (
        taskId: number,
        params?: ExpendablesParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<{ items: Array<ExpendableItem> }>>(
                `${this.url}/${taskId}/expendable`,
                {
                    params,
                    ...options,
                },
            )
            .then(resp => resp.data.response);

    public readonly getExpendablesTotalPrice = (
        taskId: number,
        params?: { version?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<TotalPrice>>(`${this.url}/${taskId}/expendable/price`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getRejectedExpendables = (
        taskId: number,
        params?: ExpendablesParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<{ items: Array<ExpendableItem> }>>(
                `${this.url}/${taskId}/expendable/rejected`,
                {
                    params,
                    ...options,
                },
            )
            .then(resp => resp.data.response);

    public readonly addExpendable = (
        taskId: number,
        params: NewExpendable,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<Array<null>>>(`${this.url}/${taskId}/expendable`, params, options)
            .then(resp => resp.data.response);

    public readonly updateExpendable = (
        expendableId: number,
        params: UpdateExpendable,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<Array<null>>>(
                `${this.url}/expendable/${expendableId}`,
                params,
                options,
            )
            .then(resp => resp.data.response);

    public readonly changeExpendablesType = (
        expendableId: number,
        params: { type: ExpendableType },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch(`${this.url}/expendable/${expendableId}/change-type`, params, options)
            .then(resp => resp.data.response);

    public readonly toggleCashless = (expendableId: number, options?: AxiosRequestConfig) =>
        this.http
            .patch<BaseResponse<Array<null>>>(
                `${this.url}/expendable/${expendableId}/cashless`,
                {},
                options,
            )
            .then(resp => resp.data.response);
}

export default new ExpendablesService();
