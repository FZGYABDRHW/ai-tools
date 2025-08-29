import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AuthResponse, SignInParams, SignUpParams } from './interfaces';

export class B2CTaskService extends BaseService {
    private url = `${this.baseUrl}/b2c/task`;

    readonly signIn = (taskId: number, params: SignInParams) =>
        this.http
            .post<BaseResponse<AuthResponse>>(`${this.url}/${taskId}/sign-in/invitation`, params)
            .then(r => r.data.response);

    readonly signUp = (taskId: number, params: SignUpParams) =>
        this.http
            .post<BaseResponse<AuthResponse>>(`${this.url}/${taskId}/sign-up/invitation`, params)
            .then(r => r.data.response);
}

export default new B2CTaskService();
