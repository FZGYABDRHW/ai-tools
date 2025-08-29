import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { LandingTask } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class LandingTaskService extends BaseService {
    public readonly get = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<LandingTask[]>>(`${this.baseUrl}/landing/task`, options)
            .then(r => r.data);
}

export default new LandingTaskService();
