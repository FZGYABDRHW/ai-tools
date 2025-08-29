import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { RegisterPerformerParams } from './interfaces';

export class CleaningService extends BaseService {
    private readonly url: string = `${this.baseUrl}/cleaning`;

    public readonly registerPerformer = (
        params: RegisterPerformerParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/performer`, params, options)
            .then(resp => resp.data.response);
}

export default new CleaningService();
