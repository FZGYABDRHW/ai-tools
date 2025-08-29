import BaseService from '../BaseServiceV4';
import { AxiosRequestConfig } from 'axios';
import { BaseResponse } from '../../interfaces';
import { RegistrationRequest, RegistrationResponse } from './interfaces';

export class ContractorCompanyService extends BaseService {
    private readonly url: string = `${this.baseUrl}/contractor-company`;

    public readonly registration = (data: RegistrationRequest, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<RegistrationResponse>>(`${this.url}`, data, options)
            .then(resp => resp.data.response);

    public readonly checkInvite = (id: string, options?: AxiosRequestConfig) =>
        this.http
            .patch<BaseResponse<RegistrationResponse>>(
                `${this.url}/invitation/${id}/accept`,
                options,
            )
            .then(resp => resp.data.response);
}

export default new ContractorCompanyService();
