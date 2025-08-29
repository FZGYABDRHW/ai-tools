import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class TaskActionsService extends BaseService {
    private readonly url: string = `${this.baseUrl}/task`;

    public readonly sendTaskToPayment = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/send-payment`, {}, options)
            .then(({ data: response }) => response);

    public readonly rejectTask = (
        taskId: number,
        params?: { message: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/reject`, params, options)
            .then(({ data: response }) => response);

    public readonly publishTask = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/publish`, {}, options)
            .then(({ data: response }) => response);

    public readonly returnTask = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/return`, {}, options)
            .then(({ data: response }) => response);

    public readonly cancelTask = (
        taskId: number,
        params?: { reasonType?: number; reasonMessage: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/cancel`, params, options)
            .then(({ data: response }) => response);

    public readonly completeTask = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/complete`, {}, options)
            .then(({ data: response }) => response);

    public readonly confirmTask = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/confirm`, {}, options)
            .then(({ data: response }) => response);

    public readonly takeTask = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/take`, {}, options)
            .then(({ data: response }) => response);
}

export default new TaskActionsService();
