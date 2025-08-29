import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { TransportCompanies, Tracker } from './interfaces';

export class TransportCompany extends BaseService {
    private readonly _url = `${this.baseUrl}/transport-company`;

    public readonly getTransportCompaniesListForTracker = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<TransportCompanies>>(`${this._url}/tracker/list-transport-companies`)
            .then(resp => resp.data.response);

    public readonly getTrackerInfo = (
        params: { trackNumber?: string; transportCompany?: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Tracker>>(`${this._url}/tracker/tracking-status`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);
}
