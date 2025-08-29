import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { Md5 } from 'ts-md5/dist/md5';
import { AxiosRequestConfig } from 'axios';
import { SendCodeParams } from './interfaces';

export interface SMSTypes {
    REGISTRATION_CODE: 2;
    RESTORE_CODE: 3;
    CONFIRM_MAIN_PHONE: 4;
    CONFIRM_ADDITIONAL_PHONE: 5;
    BY_HUNTER_REGISTRATION_CODE: 6;
}

export const SMS_TYPES: SMSTypes = {
    REGISTRATION_CODE: 2,
    RESTORE_CODE: 3,
    CONFIRM_MAIN_PHONE: 4,
    CONFIRM_ADDITIONAL_PHONE: 5,
    BY_HUNTER_REGISTRATION_CODE: 6,
};

export class SiteService extends BaseService {
    public readonly sendCode = (phone: string, type: SMSTypes[keyof SMSTypes], validKey?: string) =>
        this.http
            .post<BaseResponse<null>>(`${this.baseUrl}/site/send-code`, { phone, type, validKey })
            .then(r => r.data);

    public readonly checkCode = (type: SMSTypes[keyof SMSTypes], code: number, phone: string) =>
        this.http
            .get<BaseResponse<null>>(`${this.baseUrl}/site/check-code`, {
                params: { type, code, phone },
            })
            .then(r => r.data);

    public readonly sendRegistrationCode = (params: SendCodeParams, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(
                `${this.baseUrl}/site/send-code/web/registration`,
                params,
                options,
            )
            .then(r => r.data);

    public readonly sendRestoreCode = (params: SendCodeParams, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(
                `${this.baseUrl}/site/send-code/site/restore`,
                params,
                options,
            )
            .then(r => r.data);

    public readonly checkRegistrationCode = (phone: string, code: number) =>
        this.checkCode(SMS_TYPES.REGISTRATION_CODE, code, phone);

    public readonly checkRestoreCode = (phone: string, code: number) =>
        this.checkCode(SMS_TYPES.RESTORE_CODE, code, phone);

    public readonly registration = (phone: string, code: number, password: string) =>
        this.http
            .put<BaseResponse<{ phone: string; password: string }>>(
                `${this.baseUrl}/site/registration`,
                { code, password: Md5.hashStr(password), phone },
            )
            .then(r => r.data);

    public readonly restorePassword = (phone: string, code: number, password: string) =>
        this.http
            .put<BaseResponse<null>>(`${this.baseUrl}/site/restore-password`, {
                phone,
                code,
                password: Md5.hashStr(password),
            })
            .then(r => r.data);
}

export default new SiteService();
