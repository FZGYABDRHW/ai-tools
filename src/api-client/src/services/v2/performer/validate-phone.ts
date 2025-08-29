import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { Acts, ActsParams, DownloadParams } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export interface IPhone {
    phone: number;
    type: number;
}

interface IValidatePhone {
    code: number;
    type: number;
}

class ValidatePhoneService extends BaseService {
    private urlSend = `${this.baseUrl}/site/send-code`;
    private urlCheck = `${this.baseUrl}/performer/settings/contacts/phone`;

    async validatePhone(phone: number, type: number, options?: AxiosRequestConfig) {
        const params = {
            phone: phone,
            type: type,
        };
        const {
            data: { response },
        } = await this.http.post<BaseResponse<IPhone>>(this.urlSend, params, options);
        return response;
    }

    async validateCode(code: number, type: number, options?: AxiosRequestConfig) {
        const params = {
            code: code,
            type: type,
        };
        const {
            data: { status },
        } = await this.http.post<BaseResponse<IValidatePhone>>(this.urlCheck, params, options);
        return status;
    }
}

export { ValidatePhoneService };

export default new ValidatePhoneService();
