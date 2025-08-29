import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class CuratorProfile extends BaseService {
    private readonly url: string = `${this.baseUrl}/curator/profile`;

    public readonly getCuratorProfile = (curatorId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/profile?id=${curatorId}`, options)
            .then(resp => resp.data);
}

export default new CuratorProfile();
