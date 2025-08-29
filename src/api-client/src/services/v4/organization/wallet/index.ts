import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { GetWalletListParams, Wallet, Wallets } from './interfaces';

export class OrganizationWalletService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization`;

    readonly getList = (
        organizationId: number,
        params?: GetWalletListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Wallets>>(`${this.url}/${organizationId}/wallet`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    readonly getWallet = (organizationId: number, walletId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Wallet>>(`${this.url}/${organizationId}/wallet/${walletId}`, options)
            .then(resp => resp.data.response);
}

export default new OrganizationWalletService();
