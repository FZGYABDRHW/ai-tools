import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV1';
import { Suborganization } from '../../common/shop/interface';
import { Resp, ShopTask, ShopQuery } from './interfaces';

export class OrganizationShopService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organisation/shop`;

    getPerformerQuestionnaire = async (shopId, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(
                `${this.baseUrl}/organization/shop/${shopId}/questionnaire`,
                options,
            )
            .then(resp => resp.data.response);

    searchShop = async (params?: Partial<ShopQuery>, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<Resp>>(`${this.url}/search`, { params, ...options })
            .then(resp => resp.data.response);

    allShopTasks = async (shopId: number, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<{ items: ShopTask[] }>>(
                `${this.baseUrl}/organization/shop/${shopId}/history`,
                options,
            )
            .then(resp => resp.data.response);

    deleteShop = async (shopId: number, options?: AxiosRequestConfig) =>
        await this.http
            .delete(`${this.baseUrl}/organization/shop/${shopId}`, options)
            .then(resp => resp.data.response);

    createShopSettings = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/create-settings`, options)
            .then(resp => resp.data.response);

    createShop = async (params, options?: AxiosRequestConfig) =>
        await this.http
            .post<BaseResponse<any>>(`${this.url}/create`, params, options)
            .then(resp => resp.data);

    updateShop = async (params, options?: AxiosRequestConfig) =>
        await this.http
            .post<BaseResponse<any>>(`${this.url}/update`, params, options)
            .then(resp => resp.data.response);

    getShopBranch = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<Suborganization[]>>(`${this.baseUrl}/organization/branch`, options)
            .then(resp => resp.data.response);

    /// TODO: Убрать метод
    createSHop = async (shopInfo, options?: AxiosRequestConfig) =>
        await this.http
            .post<BaseResponse<any>>(`${this.url}/create`, shopInfo, options)
            .then(resp => resp.data);

    getSuborganization = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<{ models: Suborganization[] }>>(
                `${this.baseUrl}/organization/suborganization`,
                options,
            )
            .then(resp => resp.data.response);
}

export default new OrganizationShopService();
