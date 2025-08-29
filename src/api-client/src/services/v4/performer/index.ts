import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Report } from './interfaces';

export class PerformerService extends BaseService {
    private readonly url: string = `${this.baseUrl}/performer`;

    public readonly getTaskRatingReport = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Report>>(`${this.url}/task/${taskId}/report`, options)
            .then(response => response.data.response);
}
