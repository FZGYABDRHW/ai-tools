import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { Task, ListQueryParams, Count } from './interfaces';
import { AxiosRequestConfig } from 'axios';


export interface ListResponse {
    /** Actual payload from the server. */
    response: Task[];
    /** Domain-level status code (0 = success). */
    status: number;
    /** Localised info / warnings from backend. */
    messages: string[];
    /** Structured errors when `status` ≠ 0. */
    errors: unknown[];
}


export class CuratorListService extends BaseService {
    private url = `${this.baseUrl}/curator/task`;

    public readonly getNewTasks = (params: ListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Task>>(`${this.url}/new`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getDoneTasks = (params: ListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Task>>(`${this.url}/done`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getCanceledTasks = (params: ListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Task>>(`${this.url}/canceled`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getInWorkTasks = (params: ListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Task[]>>(`${this.url}/in-work`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getOnModerationTasks = (
        params: ListQueryParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Task>>(`${this.url}/on-moderation`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getOnAwaitingApprove = (
        params: ListQueryParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Task>>(`${this.url}/awaiting-approve`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getOnPayment = (params: ListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Task>>(`${this.url}/on-payment`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getInQueueTasks = (params: ListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Task>>(`${this.url}/in-queue`, { params, ...options })
            .then(resp => resp.data.response);

    async getNewTabs(params, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Count>>(`${this.url}/count-new`, {
            params,
            ...options,
        });
        return response;
    }

    async inWorkTabs(params, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Count>>(`${this.url}/count-in-work`, {
            params,
            ...options,
        });
        return response;
    }

    async onModerationTabs(params, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Count>>(`${this.url}/count-on-moderation`, {
            params,
            ...options,
        });
        return response;
    }

    async awaitingApproveTabs(params, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Count>>(`${this.url}/count-awaiting-approve`, {
            params,
            ...options,
        });
        return response;
    }

    async onPayment(params, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Count>>(`${this.url}/count-on-payment`, {
            params,
            ...options,
        });
        return response;
    }

    async doneTabs(params, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Count>>(`${this.url}/count-done`, {
            params,
            ...options,
        });
        return response;
    }

    async canceledTabs(params, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Count>>(`${this.url}/count-canceled`, {
            params,
            ...options,
        });
        return response;
    }

    async inQueueTabs(params, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Count>>(`${this.url}/count-in-queue`, {
            params,
            ...options,
        });
        return response;
    }
}

export default new CuratorListService();
