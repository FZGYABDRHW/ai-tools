import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Region } from './interfaces';

export class CommonRegionService extends BaseService {
    private url: string = `${this.baseUrl}/common/region`;

    public readonly getRegion = (id: number, options?: AxiosRequestConfig) =>
        this.http.get<BaseResponse<Region>>(`${this.url}/${id}`, options).then(resp => resp.data);
}

export default new CommonRegionService();
