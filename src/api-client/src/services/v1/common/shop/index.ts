import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { ShopBranch } from '../../../v2/curator/tools/shop/interfaces';
import {
    CreateSettings,
    ShopInfo,
    ShopInfoRequest,
    ShopLoginToken,
    ShopLoginParams,
    Suborganization,
} from './interface';
import { AxiosRequestConfig } from 'axios';

export class ShopInfoService extends BaseService {
    private readonly url: string = `${this.baseUrl}/common/shop`;

    public readonly getShopInfo = (params: { id: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ShopInfo>>(`${this.url}/info`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getShopBranches = (params: { shopId: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ShopBranch[]>>(`${this.url}/branch`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly createSetting = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<CreateSettings>>(`${this.url}/create-settings`, options)
            .then(resp => resp.data.response);

    public readonly getSuborganization = (
        params: { shop_id: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<{ models: Suborganization[] }>>(`${this.url}/suborganization`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly updateShopInfo = (shopInfo: ShopInfoRequest, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<{ shop_id: number }>>(`${this.url}/update`, shopInfo, options)
            .then(resp => resp.data);

    public readonly shopLogin = (params: ShopLoginParams, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<ShopLoginToken>>(`${this.url}/login`, params, options)
            .then(resp => resp.data.response);
}

export default new ShopInfoService();
