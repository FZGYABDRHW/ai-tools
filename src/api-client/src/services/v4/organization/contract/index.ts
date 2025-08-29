import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Contract, ListParams, PriceTreeParams, Branch, Vat } from './interfaces';
import { Price } from '../../../v1/organization/task/interfaces';
import { Franchise } from '../suborganization/interfaces';

export class ContractService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization`;

    readonly get = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Contract>>(`${this.url}/contract/${id}`)
            .then(resp => resp.data.response);

    readonly getVat = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Vat>>(`${this.url}/contract/${id}/vat`)
            .then(resp => resp.data.response);

    readonly getList = (
        organizationId: number,
        params: ListParams = {},
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<{ items: Contract[] }>>(`${this.url}/${organizationId}/contract`, {
                params: {
                    ids: params.ids !== void 0 ? params.ids.join(',') : null,
                    suborganizationId: params.suborganizationId,
                    departmentId: params.departmentId,
                    limit: params.limit,
                },
            })
            .then(resp => resp.data.response);

    readonly getBranch = (organizationId: number, ids: number[], options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: Branch[] }>>(`${this.url}/${organizationId}/branch`, {
                params: {
                    ids: ids.join(','),
                },
            })
            .then(resp => resp.data.response);

    readonly getPriceTree = (
        contractId: number,
        params: PriceTreeParams = {},
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Price>>(`${this.url}/contract/${contractId}/price`, {
                params: {
                    shopId: params.shopId,
                    lat: params.lat,
                    lng: params.lng,
                    polygonId: params.polygonId,
                },
            })
            .then(resp => resp.data.response);

    readonly getFranchise = (contractId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Franchise>>(`${this.url}/contract/${contractId}/franchise`, options)
            .then(resp => resp.data.response);
}

export default new ContractService();
