import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import {
    IRole,
    IUserProfile,
    IUserContacts,
    UserRole,
    SupportPhone,
    VirtualInfo,
} from './info.interfaces';
import { AxiosRequestConfig } from 'axios';

export class UserInfo extends BaseService {
    async getRole(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IRole>>(`${this.baseUrl}/common/user/role`, options);
        return response;
    }

    async getUserRole(userId, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<UserRole>>(
            `${this.baseUrl}/common/user/${userId}/role/primary`,
            options,
        );
        return response;
    }

    async getProfile(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IUserProfile>>(`${this.baseUrl}/common/user`, options);
        return response;
    }

    async getContacts(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IUserContacts>>(
            `${this.baseUrl}/user-contacts/contacts`,
            options,
        );
        return response;
    }

    async getSupportPhone(params: { country?: string }) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<SupportPhone>>(
            `${this.baseUrl}/common/support-phone`,
            { params },
        );
        return response;
    }

    async getVirtualPhoneNumber(userId: number) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<VirtualInfo>>(
            `${this.baseUrl}/common/user-contacts/${userId}/virtual-contact-info`,
        );
        return response;
    }
}

export default new UserInfo();
