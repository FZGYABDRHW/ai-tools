import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';

interface IOrganizationListItem {
    id: number;
    logo_id: number;
    name: string;
    url: string;
}

export interface IOrganizationList {
    items: IOrganizationListItem[];
    totalCount: number;
}

class LogoService extends BaseService {
    private readonly url: string = `${this.baseUrl}/admin`;

    public readonly deleteOrganizationLogo = (
        organizationId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this.url}/organisation/${organizationId}/logo`, options)
            .then(resp => resp.data);

    public readonly getOrganizationLogo = (organizationId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IOrganizationListItem>>(
                `${this.url}/organisation/${organizationId}/logo`,
                options,
            )
            .then(resp => resp.data);

    async getOrganizationList(
        offset: number = 0,
        limit: number = 10,
        options?: AxiosRequestConfig,
    ) {
        const url = `${this.baseUrl}/admin/organisation/logo/list`;
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IOrganizationList>>(url, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }
}

export { LogoService, IOrganizationListItem };

export default new LogoService();
