import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { List, Price, TaskDescriptions, TaskTitle } from './interfaces';

export class TaskEntity extends BaseService {
    private url = `${this.baseUrl}/curator/task`;

    public readonly getTaskDepartments = (taskId, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List[]>>(`${this.url}/${taskId}/department/available`, options)
            .then(resp => resp.data);

    public readonly getTaskSuborganizations = (taskId, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List[]>>(`${this.url}/${taskId}/suborganization/available`, options)
            .then(resp => resp.data);

    public readonly getPerformerTaskPrice = (
        params: { taskId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Price>>(`${this.url}/price`, { params, ...options })
            .then(resp => resp.data);

    public readonly changeTaskTitle = (params: TaskTitle, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<void>>(`${this.url}/task/name`, { ...params }, options)
            .then(resp => resp.data.response);

    public readonly changeTaskDescription = (
        params: TaskDescriptions,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<void>>(`${this.url}/task/description`, { ...params }, options)
            .then(resp => resp.data.response);

    public toggleNight = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<void>>(`${this.url}/${taskId}/edit/night`, {}, options)
            .then(resp => resp.data.response);

    public toggleUrgent = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<void>>(`${this.url}/${taskId}/edit/urgent`, {}, options)
            .then(resp => resp.data.response);

    public toggleAltitude = (taskId: number) =>
        this.http
            .put<BaseResponse<void>>(`${this.url}/${taskId}/edit/altitude-work`, {})
            .then(resp => resp.data.response);
}

export default new TaskEntity();
