import BaseService from '../../../BaseServiceV4';
import {
    CreateRouteEquipmentParams,
    CreateRouteShopParams,
    EquipmentRoute,
    RemoveRouteParams,
} from './interfaces';
import { AxiosRequestConfig } from 'axios';
import { BaseResponse } from '../../../../interfaces';

export class RouteService extends BaseService {
    private readonly url: string = `${this.baseUrl}/incident/category/route`;

    public readonly createEquipmentRoute = (
        params: CreateRouteEquipmentParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put(`${this.url}/equipment`, params, {
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getEquipmentRoute = (equipmentId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<EquipmentRoute>>(`${this.url}/equipment/${equipmentId}`, options)
            .then(resp => resp.data.response);

    public readonly createShopRoute = (
        params: CreateRouteShopParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post(`${this.url}/shop`, params, {
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly remove = (params: RemoveRouteParams, options?: AxiosRequestConfig) =>
        this.http
            .delete(`${this.url}/${params.routeId}/shop/${params.shopId}`, options)
            .then(resp => resp.data.response);
}
