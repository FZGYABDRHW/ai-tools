import BaseService from '../../../BaseServiceV4';
import { BaseResponse } from '../../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { UserPerformerWallets, UserPerformerWalletStatus } from './interfaces';

export class PerformerWalletService extends BaseService {
    private readonly url = (performerId: number) =>
        `${this.baseUrl}/user/${performerId}/performer/wallet`;

    public readonly getPerformerWallet = (performerId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<UserPerformerWallets>>(`${this.url(performerId)}`, options)
            .then(resp => resp.data.response);

    public readonly getWalletStatus = (
        { performerId, paymentId }: { performerId: number; paymentId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<UserPerformerWalletStatus>>(
                `${this.url(performerId)}/payment/${paymentId}/status`,
                options,
            )
            .then(resp => resp.data.response);
}

export default new PerformerWalletService();
