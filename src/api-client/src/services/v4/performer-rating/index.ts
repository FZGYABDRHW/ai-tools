import { AxiosRequestConfig } from 'axios';

import { BaseResponse } from '../../interfaces';
import BaseService from '../BaseServiceV4';
import { RatingHistory, RatingDashboard } from './interfaces';

export class PerformerRatingService extends BaseService {
    private readonly url: string = `${this.baseUrl}/performer-rating`;

    public readonly getRatingHistory = (type: string, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<RatingHistory>>(`${this.url}/history/${type}`, options)
            .then(resp => resp.data.response);

    public readonly getRatingStatus = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<RatingDashboard>>(`${this.url}/status`, options)
            .then(resp => resp.data.response);
}
