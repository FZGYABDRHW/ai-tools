import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { PaymentStatus } from './interfaces';

export class WalletPerformerService extends BaseService {
    private readonly url: string = `${this.baseUrl}/wallet-performer`;

    public readonly getPaymentStatus = (params: { id: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<PaymentStatus>>(`${this.url}/get-payment-status`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);
}

export default new WalletPerformerService();
