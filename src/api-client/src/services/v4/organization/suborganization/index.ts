import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    Suborganization,
    ListParams,
    Franchise,
    LegalIdentifier,
    SuborganizationList,
    BankAccountFull,
    BankAccount,
    UpdateSuborganization,
} from './interfaces';

export class SuborganizationService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization`;

    readonly get = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Suborganization>>(`${this.url}/suborganization/${id}`)
            .then(resp => resp.data.response);

    readonly updateDescription = (
        id: number,
        params: UpdateSuborganization,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch<BaseResponse<Suborganization>>(
                `${this.url}/suborganization/${id}`,
                params,
                options,
            )
            .then(resp => resp.data.response);

    readonly getList = (
        organizationId: number,
        params: ListParams = {},
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<SuborganizationList>>(
                `${this.url}/${organizationId}/suborganization`,
                {
                    params: {
                        ids: params.ids.join(','),
                        limit: params.limit,
                    },
                },
            )
            .then(resp => resp.data.response);

    readonly getLegalIdentifier = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<LegalIdentifier>>(
                `${this.url}/suborganization/${id}/legal-identifier`,
                options,
            )
            .then(resp => resp.data.response);

    readonly getFranchise = (suborganizationId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Franchise>>(
                `${this.url}/suborganization/${suborganizationId}/franchise`,
                options,
            )
            .then(resp => resp.data.response);

    readonly addBankAccount = (
        suborganizationId: number,
        params: BankAccount,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(
                `${this.url}/suborganization/${suborganizationId}/bank-account`,
                params,
                options,
            )
            .then(resp => resp.data.response);

    readonly getBankAccountList = (suborganizationId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<BankAccountFull[]>>(
                `${this.url}/suborganization/${suborganizationId}/bank-account`,
                options,
            )
            .then(resp => resp.data.response);

    readonly deleteBankAccount = (accountId: number, options?: AxiosRequestConfig) =>
        this.http
            .delete(`${this.url}/suborganization/bank-account/${accountId}`, options)
            .then(resp => resp.data.response);

    readonly getVatRates = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<number[]>>(`${this.url}/suborganization/vat-rates`, options)
            .then(resp => resp.data.response);
}

export default new SuborganizationService();
