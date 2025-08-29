import { AxiosRequestConfig } from 'axios';

import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { RegionType, Status, StatusPay } from './interfaces';

export class PerformerInfo extends BaseService {
    private url = `${this.baseUrl}/curator/performer`;

    public setLocation = async (
        params: { userId: number; regionId: number; type: RegionType },
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .put<BaseResponse<Array<null>>>(`${this.url}/location`, { ...params }, options)
            .then(resp => resp.data.response);

    public removePerformerLocation = async (
        params: { userId: number; regionId: number },
        options?: AxiosRequestConfig,
    ) => await this.http.delete(`${this.url}/location`, options).then(resp => resp.data.status);

    async getPaymentStatus(params?: Status, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<StatusPay>>(`${this.url}/wallet/get-payment-status`, {
            params,
            ...options,
        });
        return response;
    }

    async repaymentMoney(params?: Status, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.put<BaseResponse<Status>>(
            `${this.url}/wallet/moneyback`,
            params,
            options,
        );
        return response;
    }
}

export default new PerformerInfo();
