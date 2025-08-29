import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { IResponseGetUserPassportInfo } from './interfaces';
import { AxiosRequestConfig } from 'axios';

class PassportService extends BaseService {
    private url: string = `${this.baseUrl}/performer/settings/passport`;

    async getUserPassportInfo(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetUserPassportInfo>>(this.url, options);
        return response;
    }

    async setUserPassportInfo(
        params: { numberAndSeries: string; whenIssued: string; issuedBy: string },
        options?: AxiosRequestConfig,
    ) {
        await this.http.post<BaseResponse<null>>(this.url, params, options);
    }
}

export { PassportService };

export default new PassportService();
