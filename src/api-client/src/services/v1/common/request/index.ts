import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Request, RequestModel, RequestInfo } from './interfaces';

export class CommonRegionService extends BaseService {
    url: string = `${this.baseUrl}/common/request`;

    public readonly getRequest = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<RequestInfo>>(`${this.url}/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getUserRequest = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<RequestModel>>(`${this.url}/all`, options)
            .then(resp => resp.data.response);

    public readonly postRequestRate = (
        params: { id: number; rate: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<Request>>(`${this.url}/rate`, params, options)
            .then(resp => resp.data.response);

    public readonly postNewRequest = (
        params: { name: string; description: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<RequestInfo>>(`${this.url}/new`, params, options)
            .then(resp => resp.data.response);

    public readonly closeRequest = (params: { id: number }, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Request>>(`${this.url}/close`, params, options)
            .then(resp => resp.data.response);

    public readonly addNewMessage = (
        params: { id: number; message: string; type?: number; file_id?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<Request>>(`${this.url}/message`, params, options)
            .then(resp => resp.data.response);
}

export default new CommonRegionService();
