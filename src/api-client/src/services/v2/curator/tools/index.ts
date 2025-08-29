import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    ShopData,
    ShopTasksHistory,
    ShopList,
    GetShopListParams,
    UpdateClientPosition,
    CommentsParams,
    CuratorInfo,
    Comment,
} from './interfaces';
import { List } from '../../../v4/interfaces';
import { ExecutionAddress } from '../../../v4/task/interfaces';

export class CuratorTools extends BaseService {
    private readonly url = `${this.baseUrl}/curator/tools`;

    public readonly sendCode = (phone: string, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/sms/send-code`, { phone }, options)
            .then(resp => resp.data.response);

    public readonly getShopInfo = (shopId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ShopData>>(`${this.url}/shop/${shopId}`, { ...options })
            .then(resp => resp.data.response);

    public readonly getShopTasksHistory = (
        shopId: number,
        limit: number = 20,
        offset: number = 0,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ShopTasksHistory>>(`${this.url}/shop/${shopId}/history`, {
                params: { limit, offset },
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getShopList = (
        params?: Partial<GetShopListParams>,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ShopList>>(`${this.url}/shop/list`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly updateClientPosition = async (
        params: UpdateClientPosition,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<ExecutionAddress>>(
                `${this.url}/execution-address/address-point`,
                params,
            )
            .then(resp => resp.data.response);

    public readonly getCommentsList = async (
        params: CommentsParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<Comment>>>(`${this.url}/comment/list`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getCuratorList = async (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List<CuratorInfo>>>(`${this.url}/user/curators-list`, options)
            .then(resp => resp.data.response);
}

export default new CuratorTools();
