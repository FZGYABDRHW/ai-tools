import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';

export interface LoginCredentials {
    phone: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    token: string;
}

export interface LoginApiResponse {
    id: number;
    token: string;
}

export interface LogoutResponse {
    success: boolean;
}

export class AuthService extends BaseService {
    private readonly url: string = `${this.baseUrl}/user`;

    readonly login = (credentials: LoginCredentials): Promise<LoginApiResponse> =>
        this.http
            .post<BaseResponse<LoginResponse>>(`${this.url}/login`, credentials)
            .then(r => r.data.response);

    readonly logout = () =>
        this.http
            .post<BaseResponse<LogoutResponse>>(`${this.url}/logout`)
            .then(r => r.data)
            .catch(r => r.response?.data || { success: false });

    readonly getUserProfile = (userId: number): Promise<any> =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/${userId}`)
            .then(r => r.data.response)
            .catch(r => r.response?.data);
}
