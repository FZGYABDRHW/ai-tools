import { AxiosRequestConfig } from 'axios';

import { BaseResponse } from '../../interfaces';
import BaseService from '../BaseServiceV4';
import { IdentityDocument, IdentityDocumentValidity } from './interfaces';

export class IdentityDocumentService extends BaseService {
    private url: string = `${this.baseUrl}/identity-document`;

    public getIdentityDocumentList(userId: number, options?: AxiosRequestConfig) {
        return this.http
            .get<BaseResponse<IdentityDocument[]>>(this.url, { ...options, params: { userId } })
            .then(response => response.data.response);
    }

    public getIndentityDocumentValidity(identityDocumentId: number, options?: AxiosRequestConfig) {
        return this.http
            .get<BaseResponse<IdentityDocumentValidity>>(`${this.url}/validity`, {
                ...options,
                params: { identityDocumentId },
            })
            .then(response => response.data.response);
    }
}
