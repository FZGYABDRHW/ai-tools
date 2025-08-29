import BaseService from '../BaseServiceV4';
import { List } from '../interfaces';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Settings } from './interfaces';

export class CuratorPenaltySettingsService extends BaseService {
    private readonly url: string = `${this.baseUrl}/curator-penalty-settings`;

    public readonly getListOfSettings = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List<Settings>>>(this.url, { ...options })
            .then(response => response.data.response);
}
