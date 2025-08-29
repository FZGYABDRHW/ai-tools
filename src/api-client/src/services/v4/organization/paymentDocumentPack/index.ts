import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class PaymentDocumentPackService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization`;

    readonly create = async (
        organizationId: number,
        walletId: number,
        sum: number,
        destination: string,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .post<BaseResponse<void>>(`${this.url}/${organizationId}/payment-document-pack`, {
                walletId,
                sum,
                destination,
            })
            .then(resp => resp.data.response);
}

export default new PaymentDocumentPackService();
