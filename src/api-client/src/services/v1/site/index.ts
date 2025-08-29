import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { Md5 } from 'ts-md5/dist/md5';
import { AxiosRequestConfig } from 'axios';

export class SiteService extends BaseService {
    public readonly login = (phone: string, password: string, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<{ authToken: string; userId: number }>>(
                `${this.baseUrl}/site/login`,
                {
                    phone: parseInt(phone),
                    password: Md5.hashStr(password),
                },
                options,
            )
            .then(r => r.data);

    public readonly getImages = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ author: string; file_url: string; name: string }>>(
                `${this.baseUrl}/site/bg-image`,
                options,
            )
            .then(r => r.data);
}

export default new SiteService();
