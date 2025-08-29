import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import { List } from '../../interfaces';
import {
    InviteParams,
    BaseListParams,
    Invited,
    RegisteredListParams,
    ContractorCompanyList,
} from './interfaces';

export class ContractorCompanyService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization`;

    readonly invite = async (params: InviteParams) => {
        const { organizationId, email } = params;
        return await this.http
            .post<BaseResponse<void>>(
                `${this.url}/${organizationId}/contractor-company/invitation`,
                {
                    email,
                },
            )
            .then(resp => resp.data.response);
    };

    public readonly getInvitedList = (
        organizationId: number,
        params?: BaseListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<Invited>>>(
                `${this.url}/${organizationId}/contractor-company/invitations`,
                {
                    params,
                    ...options,
                },
            )
            .then(resp => resp.data.response);

    public readonly getRegisteredList = (organizationId: number, params?: RegisteredListParams) =>
        this.http
            .get<BaseResponse<ContractorCompanyList>>(
                `${this.url}/${organizationId}/contractor-companies`,
                {
                    params,
                },
            )
            .then(resp => resp.data.response);

    readonly deleteInvitation = (id: string, options?: AxiosRequestConfig) =>
        this.http
            .delete(`${this.url}/contractor-company/invitation/${id}`, options)
            .then(resp => resp.data.response);
}

export default new ContractorCompanyService();
