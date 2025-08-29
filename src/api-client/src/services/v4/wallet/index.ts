import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class WalletService extends BaseService {
    private readonly url: string = `${this.baseUrl}/wallet`;

    public readonly deleteCard = async (
        userId: number,
        cardNumber: number,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .delete(`${this.url}/card/${userId}/${cardNumber}`)
            .then(resp => resp.data.response);

    public readonly deletePlasticCard = async (
        userId: number,
        cardNumber: number,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .delete(`${this.url}/delete-card/${userId}/${cardNumber}`, options)
            .then(resp => resp.data.response);
}

export default new WalletService();
