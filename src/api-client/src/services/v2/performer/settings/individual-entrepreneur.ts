import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { IResponseGetIEData, IRequestSetIEData } from './interfaces';
import { AxiosRequestConfig } from 'axios';

class IndividualEntrepreneurService extends BaseService {
    private url = `${this.baseUrl}/performer/settings/individual-entrepreneur`;

    async getIEData(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetIEData>>(this.url, options);
        return response;
    }

    async setIEData(params: IRequestSetIEData, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<IResponseGetIEData>>(this.url, params, options);
        return response;
    }

    async getBankName(bik: string, options?: AxiosRequestConfig) {
        const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank';
        const { data } = await this.http.post<any>(
            url,
            { query: bik },
            {
                headers: { Authorization: 'Token c9b0dd6416a31e2598b957d5a9bf6249e8ac21cc' },
                ...options,
            },
        );
        if (data.suggestions && data.suggestions.length !== 0) {
            return data.suggestions[0].value;
        } else {
            return null;
        }
    }
}
export { IndividualEntrepreneurService };

export default new IndividualEntrepreneurService();
