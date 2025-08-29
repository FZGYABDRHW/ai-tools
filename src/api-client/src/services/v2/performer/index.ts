import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { Acts, ActsParams, DownloadParams, Rating } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class PerformerService extends BaseService {
    private readonly _url = `${this.baseUrl}/performer`;

    public readonly getRatingRefuseTask = () =>
        this.http
            .get<BaseResponse<Rating>>(`${this._url}/rating-changes/task-refused`)
            .then(resp => resp.data.response);

    public readonly getIeActs = (params?: Partial<ActsParams>, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Acts>>(`${this._url}/ie-acts/get-list`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly downloadAct = (params: DownloadParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Blob>>(`${this._url}/ie-acts/download`, {
                params,
                responseType: 'blob',
                ...options,
            })
            .then(resp => resp.data);
}

export default new PerformerService();
