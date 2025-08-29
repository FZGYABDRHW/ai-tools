import BaseService from '../../../BaseServiceV2';
import { OrganizationsList } from './interfaces';
import { BaseResponse } from '../../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class Organization extends BaseService {
    private url = `${this.baseUrl}/curator/tools/organization`;

    async getOrganizationsList(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<OrganizationsList>>(`${this.url}/list`, {
            params: { limit: -1 },
            ...options,
        });
        return response;
    }
}

export default new Organization();
