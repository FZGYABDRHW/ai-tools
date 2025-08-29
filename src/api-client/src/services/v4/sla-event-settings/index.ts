import BaseService from '../BaseServiceV4';
import { List } from '../interfaces';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { SLAEventSettings } from './interfaces';

export class SLAEventSettingsService extends BaseService {
    private readonly url: string = `${this.baseUrl}/group-event-settings`;

    public readonly getEventSettings = (group: string, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List<SLAEventSettings>>>(`${this.url}/${group}`, options)
            .then(response => response.data.response);
}
