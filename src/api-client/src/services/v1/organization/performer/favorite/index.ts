import { BaseResponse } from '../../../../interfaces';
import BaseService from '../../../BaseServiceV1';
import { AxiosRequestConfig } from 'axios';

export class PerformerFavorite extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization/performer`;

    public readonly deletePerformer = (performerId: number, options?: AxiosRequestConfig) =>
        this.http
            .delete(`${this.url}/${performerId}/favorite`, options)
            .then(resp => resp.data.response);
}

export default new PerformerFavorite();
