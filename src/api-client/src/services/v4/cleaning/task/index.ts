import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import { CleaningPerformerTaskList, PerformerTaskListParams } from './interfaces';

export class CleaningTaskService extends BaseService {
    private readonly url: string = `${this.baseUrl}/cleaning/task`;

    public readonly getPerformerTaskList = (
        params: PerformerTaskListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<CleaningPerformerTaskList>>(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);
}
