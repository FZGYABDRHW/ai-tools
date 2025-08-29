import BaseService from '../../../BaseServiceV2';
import { Curator, OrganizationResponse } from './interfaces';
import { BaseResponse } from '../../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class CuratorOrganizations extends BaseService {
    private url = `${this.baseUrl}/curator/tools/curator-organization`;

    async getCuratorOrganization(
        params: {
            userId: number;
            organizationId: number;
            organizationName: string;
            limit: number;
            offset: number;
        },
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<OrganizationResponse>>(`${this.url}/list`, {
            params,
            ...options,
        });
        return response;
    }

    async getActiveCurators(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<{ items: Curator[] }>>(
            `${this.url}/get-active-curators`,
            options,
        );
        return response;
    }

    async getList(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<{ items: Curator[] }>>(
            `${this.baseUrl}/curator/active`,
            options,
        );
        return response;
    }
}

export default new CuratorOrganizations();
