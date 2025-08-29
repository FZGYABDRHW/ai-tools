import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    PerformerInfoAboutTask,
    SuitablePerformers,
    List,
    Task,
    AssignPerformerToTaskData,
} from './interfaces';

export class TaskPerformersService extends BaseService {
    private readonly url: string = `${this.baseUrl}/task`;

    public readonly getInactivePerformers = (
        taskId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<SuitablePerformers>>(
                `${this.url}/${taskId}/performer/suitable/inactive`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getInactivePassportOnModerationPerformers = (
        taskId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<SuitablePerformers>>(
                `${this.url}/${taskId}/performer/suitable/inactive/passport-on-moderation`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getInactiveSpecOnModerationPerformers = (
        taskId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<SuitablePerformers>>(
                `${this.url}/${taskId}/performer/suitable/inactive/specializations-on-moderation`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getInactiveWithoutPassportPerformers = (
        taskId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<SuitablePerformers>>(
                `${this.url}/${taskId}/performer/suitable/inactive/without-passport`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getInactiveWithoutSpecPerformers = (
        taskId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<SuitablePerformers>>(
                `${this.url}/${taskId}/performer/suitable/inactive/without-specializations`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getPerformerInfoAboutTask = (
        taskId: number,
        performerId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<PerformerInfoAboutTask>>(
                `${this.url}/${taskId}/performer/${performerId}`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getPerformerAvailableTaskList = (
        performerId: number,
        params?: { limit?: number; offset?: number; taskId?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<Task>>>(`${this.url}/performer/${performerId}/available`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly assignPerformerToTask = (
        taskId: number,
        performerId: number,
        data: AssignPerformerToTaskData,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch<BaseResponse<void>>(
                `${this.url}/${taskId}/performer/${performerId}/assign`,
                data,
                options,
            )
            .then(resp => resp.data);
}

export default new TaskPerformersService();
