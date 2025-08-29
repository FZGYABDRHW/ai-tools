import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { PayoutConfig } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class PerformerPayout extends BaseService {
    private url = `${this.baseUrl}/performer/settings/payout`;

    public readonly getPerformerPayoutConfig = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<PayoutConfig>>(`${this.url}/config`, options)
            .then(resp => resp.data.response);
}

export default new PerformerPayout();
