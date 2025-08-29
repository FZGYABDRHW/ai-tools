import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { List } from '../interfaces';
import { AdditionalRequirement } from './interfaces';

export class TaskAdditionalRequirement extends BaseService {
    get = (params?: { limit: number; offset: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List<AdditionalRequirement>>>(
                `${this.baseUrl}/task-additional-requirement`,
                options,
            )
            .then(resp => resp.data.response);
}
