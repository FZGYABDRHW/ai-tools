import BaseService from '../../../BaseServiceV1';
import { BaseResponse } from '../../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class PerformerProfileService extends BaseService {
    serviceUrl: string = `${this.baseUrl}/curator/performer/profile`;

    public readonly getPerformerInfo = (params: { id: number }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<any>>(`${this.serviceUrl}/tabs`, { params, ...options })
            .then(resp => resp.data);
}

export default new PerformerProfileService();
