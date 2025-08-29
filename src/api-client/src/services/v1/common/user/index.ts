import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { User } from './interfaces';
import { IPerformerProfile, Permission } from './info.interfaces';

export class CommonUserService extends BaseService {
    private readonly url = `${this.baseUrl}/common/user`;

    public get = async (params?: { portal: string }, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<User>>(this.url, {
                params,
                headers: {
                    'Cache-control': 'no-cache',
                },
                ...options,
            })
            .then(resp => resp.data);

    public getPermission = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<Permission>>(`${this.url}/permissions`)
            .then(resp => resp.data.response);

    public changeLanguage = (language: string, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<any>>(`${this.url}/change-language`, { language, ...options })
            .then(resp => resp.data.response);

    changeUserPassport = (oldPassword: string, newPassword: string, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<any>>(
                `${this.url}/change-password`,
                {
                    old: oldPassword,
                    new: newPassword,
                },
                options,
            )
            .then(resp => resp.data);
}

export default new CommonUserService();
