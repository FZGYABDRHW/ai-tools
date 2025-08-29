import BaseService from '../../../BaseServiceV2';
import { BaseResponse } from '../../../../interfaces';
import { ShopData, ShopTasksHistory, ShopList } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export default class ShopInfoForCurators extends BaseService {
    private url = `${this.baseUrl}/curator/tools/shop`;

    async getShopInfo(shopId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<ShopData>>(`${this.url}/${shopId}`, options);
        return response;
    }

    async getShopTasksHistory(
        shopId: number,
        limit: number = 20,
        offset: number = 0,
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<ShopTasksHistory>>(`${this.url}/${shopId}/history`, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }

    readonly getShopList = (
        params?: { organization_id?; limit?: number; offset?: number; is_deleted?: boolean },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ShopList>>(`${this.url}/list`, { params, ...options })
            .then(resp => resp.data.response);
}
