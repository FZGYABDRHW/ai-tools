import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';

export interface LegalEntityBase {
    main_identifier: string;
    additional_identifier?: string | null;
}

export interface LegalEntityFull extends LegalEntityBase {
    legal_address: string;
    name: string;
}

export class LegalEntityService extends BaseService {
    private url: string = `${this.baseUrl}/legal-entity`;

    public getExternalLegalData = (params: LegalEntityBase, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<LegalEntityFull>>(`${this.url}/external-legal-data`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);
}
