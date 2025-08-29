import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { ChangePhoneParams, ChangePhoneResponse } from './interface';

export class UserService extends BaseService {
    private readonly url = `${this.baseUrl}/curator/user`;

    public readonly postPhoneConfirm = (
        params: { user_id: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<any>>(`${this.url}/phone-confirm`, params, options)
            .then(resp => resp.data);

    public readonly postAdditionalPhoneConfirm = (
        params: { user_id: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<any>>(`${this.url}/additional-phone-confirm`, params, options)
            .then(resp => resp.data);

    public readonly changePhone = (params: ChangePhoneParams, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<ChangePhoneResponse>>(`${this.url}/phone`, params, options)
            .then(resp => resp.data.response);
}

export default new UserService();
