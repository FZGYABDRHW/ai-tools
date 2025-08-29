import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { ITelegram } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export default class TelegramService extends BaseService {
    private url: string = `${this.baseUrl}/performer/settings/notifications/telegram`;

    async getTelegram(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<ITelegram>>(this.url, options);
        return response;
    }

    async deleteTelegram(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.delete(this.url, options);
        return response;
    }
}
export { TelegramService };
