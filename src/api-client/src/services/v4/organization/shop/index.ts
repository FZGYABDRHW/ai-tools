import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import { Shop } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class OrganizationShopService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization/shop`;

    readonly get = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Shop>>(`${this.url}/${id}`, options)
            .then(resp => resp.data.response);

    readonly getList = (ids: number[], options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: Shop[] }>>(`${this.url}`, {
                params: { ids: ids.join(',') },
                ...options,
            })
            .then(resp => resp.data.response);
}

export default new OrganizationShopService();
