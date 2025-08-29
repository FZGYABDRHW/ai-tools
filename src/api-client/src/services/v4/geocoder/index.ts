import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Address, PolygonInfo, PolygonCoordinates } from './interface';

export class GeoCoder extends BaseService {
    private readonly url: string = `${this.baseUrl}/geo-coder`;

    public readonly getPolygonInfo = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<PolygonInfo>>(`${this.baseUrl}/map-polygon/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getPolygonCoordinates = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<PolygonCoordinates>>(
                `${this.baseUrl}/map-polygon/${id}/coordinates`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getSuggestedAdresses = (
        params: { addressName: string; limit?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Address[]>>(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);
}
