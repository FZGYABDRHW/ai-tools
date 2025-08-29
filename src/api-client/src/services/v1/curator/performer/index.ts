import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { Transactions, PassportStatus, Annotations } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class PerformerInformationService extends BaseService {
    private url = `${this.baseUrl}/curator/performer`;

    async getPerformerTransactions(
        performerId: number,
        limit: number = 20,
        offset: number = 0,
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Transactions>>(
            `${this.url}/${performerId}/transaction`,
            {
                params: {
                    limit,
                    offset,
                },
                ...options,
            },
        );
        return response;
    }

    async postPerformerPassportCheck(
        params: { user_id: number; action: string; reason?: string },
        options?: AxiosRequestConfig,
    ) {
        const { data } = await this.http.post<BaseResponse<Transactions>>(
            `${this.url}/passport/check`,
            params,
            options,
        );
        return data;
    }

    getContractorPassportStatus = (params: { user_id: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<PassportStatus>>(`${this.url}/passport/status`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    async getPerformerAnnotations(
        performerId: number,
        params?: Annotations,
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<any>>(`${this.url}/${performerId}/annotations`, {
            params,
            ...options,
        });
        return response;
    }
}

export default new PerformerInformationService();
