import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV1';
import { DepartmentBalance, Model } from './interafces';

export class OrganizationBalanceService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization/balance`;

    getBalance = async (
        params: { shopId?: number; suborganizationId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<DepartmentBalance>>(`${this.url}/departments`, { params, ...options })
            .then(resp => resp.data.response);

    getOrganizationBalance = async (
        params: { departmentId: number },
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .get<BaseResponse<{ models: Model[] }>>(this.url, { params, ...options })
            .then(resp => resp.data.response);

    departmentDeposite = async (
        suborganizationId: number,
        departmentId: number,
        sum: number,
        destination?: string,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .put<BaseResponse<void>>(
                `${this.url}/suborganization/${suborganizationId}/department/${departmentId}`,
                { sum, destination },
                options,
            )
            .then(resp => resp.data.response);

    getDepartmentVat = async (suborganizationId: number, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/suborganization/${suborganizationId}/vat`, options)
            .then(resp => resp.data.response);
}

export default new OrganizationBalanceService();
