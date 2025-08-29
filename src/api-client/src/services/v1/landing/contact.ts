import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class ContactService extends BaseService {
    public readonly post = (
        data: { name: string; phone: number; lng?: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.baseUrl}/landing/contact/company`, data, options)
            .then(r => r.data);
}

export default new ContactService();
