import BaseService from '../../../BaseServiceV2';
import { BaseResponse } from '../../../../interfaces';
import { Favorites, PerformerModel } from './interface';
import { AxiosRequestConfig } from 'axios';

export class PerformerFavorites extends BaseService {
    private readonly url = `${this.baseUrl}/organization/performer/favorites`;

    public readonly getFavorites = async (
        limit: number,
        offset: number,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .get<BaseResponse<PerformerModel>>(this.url, { params: { limit, offset }, ...options })
            .then<PerformerModel>(resp => resp.data.response);
}

export default new PerformerFavorites();
