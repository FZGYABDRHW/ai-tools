import { Dictionary } from 'lodash';
import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';

import {
    OrganizationPriceParams,
    OrganizatonEmployees,
    TaskList,
    TaskListParams,
} from './interfaces';
import { Price } from '../curator/task/interfaces';

export class OrganisationService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organisation`;

    public readonly getOrganizationPrice = (
        params?: Partial<OrganizationPriceParams>,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Price>>(`${this.url}/price`, { params, ...options })
            .then(({ data: { response } }) => response);

    public readonly getTaskListCounts = (
        params?: Partial<TaskListParams>,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Dictionary<number>>>(`${this.url}/task-list/info`, {
                params,
                ...options,
            })
            .then(({ data: { response } }) => response);

    public readonly getTaskList = (params: Partial<TaskListParams>, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<TaskList>>(`${this.url}/task-list`, { params, ...options })
            .then(({ data: { response } }) => response);

    public readonly getOrganizationUsersList = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<OrganizatonEmployees>>(`${this.url}/employees`, options)
            .then(({ data: { response } }) => response);
}

export default new OrganisationService();
