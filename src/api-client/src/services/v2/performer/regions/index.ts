import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { Response } from './interface';
import { AxiosRequestConfig } from 'axios';

export class PerformerRegion extends BaseService {
    private url = `${this.baseUrl}/performer/region`;

    async searchPerformerRegion(
        params: { address: string; limit?: number; offset?: number },
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Response>>(`${this.url}/search`, {
            params,
            ...options,
        });
        return response;
    }
}

export default new PerformerRegion();
