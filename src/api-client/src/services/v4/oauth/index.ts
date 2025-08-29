import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { OAuth } from './interfaces';

export class OAuthService extends BaseService {
    private readonly url: string = `${this.baseUrl}/oauth`;

    readonly getList = (params: { userId: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<OAuth>>(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);

    readonly createOAuthApplication = (
        params: { redirectUri: string; name: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}`, params, options)
            .then(resp => resp.data.response);

    readonly deleteOAuthApplication = (clientId: string, options?: AxiosRequestConfig) =>
        this.http.delete(`${this.url}/${clientId}`, options).then(resp => resp.data.response);

    readonly updateOAuthApplication = (
        clientId: string,
        params: { name: string; redirectUri: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch(`${this.url}/${clientId}`, params, options)
            .then(resp => resp.data.response);
}
