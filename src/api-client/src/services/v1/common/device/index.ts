import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class UserDeviceService extends BaseService {
    private readonly url = `${this.baseUrl}/common/device`;

    public readonly getUserAppInfo = (user_id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/user-app-info`, options)
            .then(resp => resp.data);
}

export default new UserDeviceService();
