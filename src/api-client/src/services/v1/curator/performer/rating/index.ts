import BaseService from '../../../BaseServiceV1';
import { BaseResponse } from '../../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { PerformerMessage, Rating, RatingAggregated } from './interfaces';

export class CuratorRatingService extends BaseService {
    serviceUrl: string = `${this.baseUrl}/curator/performer`;

    public readonly sendReport = (params: PerformerMessage, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<PerformerMessage>>(`${this.serviceUrl}/report`, params, options)
            .then(resp => resp.data);

    public readonly getRating = (performerId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<RatingAggregated>>(
                `${this.serviceUrl}/${performerId}/rating`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getRatingHistory = (
        performerId: number,
        offset: number = 0,
        limit: number = 20,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Rating>>(`${this.serviceUrl}/${performerId}/rating/history`, {
                params: {
                    offset: offset,
                    limit: limit,
                },
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly deleteComplaint = (id: number, options?: AxiosRequestConfig): Promise<any> =>
        this.http
            .delete(`${this.serviceUrl}/rating/history/${id}`, options)
            .then(resp => resp.data);
}

export default new CuratorRatingService();
