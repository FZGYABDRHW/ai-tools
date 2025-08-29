import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { TaskList, TaskQuery } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class TaskService extends BaseService {
    readonly getList = (params: Partial<TaskQuery>, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<TaskList>>(`${this.baseUrl}/organisation/task-list`, {
                params,
                ...options,
            })
            .then(r => r.data.response);
}

export default new TaskService();
