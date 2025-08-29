import { AxiosRequestConfig } from 'axios';

import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { CountryPermission } from './interface';
import { IdentityDocument } from '../../v4/identity-document/interfaces';

export class IdentityDocumentService extends BaseService {
    private url: string = `${this.baseUrl}/identity-document`;

    public submitIdentityDocument(
        userId: number,
        data: IdentityDocument,
        options?: AxiosRequestConfig,
    ) {
        return this.http
            .post<BaseResponse<null>>(this.url, data, options)
            .then(response => response.data.response);
    }

    public getAvailableCitizenshipList(options?: AxiosRequestConfig) {
        return this.http
            .get<BaseResponse<CountryPermission[]>>(`${this.url}/available-country-list`)
            .then(response => response.data.response);
    }
}
