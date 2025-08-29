import { AxiosRequestConfig } from 'axios';

import BaseService from '../BaseServiceV1';
import {
    ActComment,
    ActFiles,
    CleaningCalendar,
    EditCalendarParams,
    GetCalendarParams,
    ShopInfo,
} from './interfaces';
import { BaseResponse } from '../../interfaces';

export class CleaningShopService extends BaseService {
    private readonly url: string = `${this.baseUrl}/shop`;

    public getShopInfo = (key: string, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ShopInfo>>(`${this.url}/task/cleaning/${key}/info`, options)
            .then(response => response.data.response);

    public updateCalendar = (
        key: string,
        params: EditCalendarParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/cleaning/task/${key}/act`, params, options)
            .then(response => response.data.response);

    public getCalendar = (key: string, params?: GetCalendarParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<CleaningCalendar>>(`${this.url}/cleaning/task/${key}/calendar`, {
                params,
                ...options,
            })
            .then(response => response.data.response);

    public getActComment = (key: string, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ActComment>>(`${this.url}/cleaning/task/${key}/act-comment`, {
                ...options,
            })
            .then(response => response.data.response);

    public getActFiles = (key: string, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ActFiles>>(`${this.url}/cleaning/task/${key}/act-file-list`, {
                ...options,
            })
            .then(response => response.data.response);
}
