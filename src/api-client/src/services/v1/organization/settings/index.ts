import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV1';
import { OrganizationSettings } from './interfaces';

export class OrganizationSettingsService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization/settings`;

    getOrganizationSettings = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<{ organization: OrganizationSettings }>>(`${this.url}/show`, options)
            .then(resp => resp.data.response);

    updateSettings = async (params, options?: AxiosRequestConfig) =>
        await this.http
            .put<BaseResponse<{ organization: OrganizationSettings }>>(
                `${this.url}/update`,
                params,
                options,
            )
            .then(resp => resp.data.response);
}

export default new OrganizationSettingsService();
