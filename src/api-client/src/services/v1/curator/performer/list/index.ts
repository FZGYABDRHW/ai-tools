import BaseService from '../../../BaseServiceV1';
import { BaseResponse } from '../../../../interfaces';

import {
    IUserListQueryParams,
    IListItem,
    IListInvitedItem,
    IListOnModerationItem,
    ITabsCounts,
    IPerformer,
    ElectricianPerformers,
    ElectricianPerformerParams,
} from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class PerformerList extends BaseService {
    serviceUrl: string = `${this.baseUrl}/curator/performer/list`;

    public readonly getActiveIE = (params: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IListItem[]>>(`${this.serviceUrl}/active-ie`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getActive = (params: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IListItem[]>>(`${this.serviceUrl}/active`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getInactive = (params: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IListItem[]>>(`${this.serviceUrl}/inactive`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getZombie = (params: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IListItem[]>>(`${this.serviceUrl}/zombie`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getBlocked = (params: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IListItem[]>>(`${this.serviceUrl}/blocked`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getDeleted = (params: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IListItem[]>>(`${this.serviceUrl}/deleted`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getInvited = (params: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IListInvitedItem[]>>(`${this.serviceUrl}/invited`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getModerationIE = (
        params: IUserListQueryParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<IListItem[]>>(`${this.serviceUrl}/moderation-ie`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getModeration = (params: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IListOnModerationItem[]>>(`${this.serviceUrl}/moderation`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getTabsCounts = (params?: IUserListQueryParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ITabsCounts>>(`${this.serviceUrl}/tabs`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getModerationPerformerInfo = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IPerformer>>(`${this.serviceUrl}/moderation/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getElectricianPerformers = (
        params?: ElectricianPerformerParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ElectricianPerformers>>(`${this.serviceUrl}/electrician`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);
}

export default new PerformerList();
