import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Params, BonusInfo } from './interfaces';

export class CuratorRating extends BaseService {
    private readonly url: string = `${this.baseUrl}/curator/rating`;

    public readonly getCuratorBonuses = (params: Params, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<BonusInfo>>(`${this.url}/bonus`, { params, ...options })
            .then(resp => resp.data);

    public readonly getuserInfo = (params: { userId: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/settings/user-info`, { params, ...options })
            .then(resp => resp.data);
}

export default new CuratorRating();
