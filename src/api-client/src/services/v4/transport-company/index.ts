import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Tracking } from './interface';
import { Omit } from '../cleaning/interfaces';

export class TransportCompany extends BaseService {
    private _url = `${this.baseUrl}/transport-company`;

    public createTracking = (data: Omit<Tracking, 'id'>, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Tracking>>(`${this._url}/tracking`, data, options)
            .then(resp => resp.data.response);

    public updateTracking = (
        id: number,
        data: Omit<Tracking, 'id'>,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<Tracking>>(`${this._url}/tracking/${id}`, data, options)
            .then(resp => resp.data.response);

    public getTrackingInfo = (
        params: Pick<Tracking, 'relatedEntityId' | 'relatedEntityName'>,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Tracking>>(`${this._url}/tracking`, { params, ...options })
            .then(resp => resp.data.response);
}
