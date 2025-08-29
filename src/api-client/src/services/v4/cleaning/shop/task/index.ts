import BaseService from '../../../BaseServiceV4';
import { AxiosRequestConfig } from 'axios';
import { BaseResponse } from '../../../../interfaces';
import { CleaningReportInfo } from './interfaces';

export class CleaningShopTaskService extends BaseService {
    private readonly url: string = `${this.baseUrl}/cleaning/shop/task`;

    public readonly setReportInfo = (key: string, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/${key}/report`, options)
            .then(resp => resp.data.response);

    public readonly getTaskInfo = (key: string, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<CleaningReportInfo>>(`${this.url}/${key}/info`, options)
            .then(resp => resp.data.response);
}
