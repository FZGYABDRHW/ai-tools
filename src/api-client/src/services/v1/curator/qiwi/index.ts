import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export interface QiwiWalletBalance {
    balance: number;
}

export class QiwiWallet extends BaseService {
    private readonly url: string = `${this.baseUrl}/curator/qiwi`;

    public readonly getBalance = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<QiwiWalletBalance>>(`${this.url}/balance`, options)
            .then(resp => resp.data);
}

export default new QiwiWallet();
