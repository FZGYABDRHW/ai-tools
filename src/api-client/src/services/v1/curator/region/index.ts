import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Region } from './interfaces';

class CuratorRegionService extends BaseService {
    private readonly url: string = `${this.baseUrl}/curator/region`;

    public readonly getCuratorRegion = (params, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Region[]>>(`${this.url}/search`, { params, ...options })
            .then(resp => resp.data);
}

export { CuratorRegionService };

export default new CuratorRegionService();
