import BaseService from '../../../../BaseServiceV4';
import { BaseResponse } from '../../../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { UserPerformerAddCardParams, UserPerformerCard, EditCardParams } from './interfaces';

export class PerformerCardService extends BaseService {
    private readonly url = (performerId: number) =>
        `${this.baseUrl}/user/${performerId}/performer/wallet`;

    public readonly getPerformerCards = (performerId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<UserPerformerCard[]>>(
                `${this.baseUrl}/user/${performerId}/performer/card`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly addCard = (
        performerId: number,
        params: UserPerformerAddCardParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(`${this.url(performerId)}/card/add`, params)
            .then(resp => resp.data.response);

    public readonly deleteCard = (
        performerId: number,
        cardId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this.url(performerId)}/card/delete/${cardId}`, options)
            .then(resp => resp.data.response);

    public readonly editCard = (
        performerId: number,
        cardId: number,
        params: EditCardParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<void>>(`${this.url(performerId)}/card/${cardId}`, params)
            .then(resp => resp.data.response);
}

export default new PerformerCardService();
