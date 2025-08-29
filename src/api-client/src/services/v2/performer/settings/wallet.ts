import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { Wallet } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class PerformerWalletInfo extends BaseService {
    private url = `${this.baseUrl}/curator/tools/wallet`;

    async putPerformerWallet(
        performerId: number,
        walletInfo: Wallet,
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<Wallet>>(
            `${this.url}/${performerId}`,
            walletInfo,
            options,
        );
        return response;
    }
}

export default new PerformerWalletInfo();
