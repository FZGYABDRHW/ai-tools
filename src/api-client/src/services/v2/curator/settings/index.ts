import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { Link, Telegram } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class CuratorSettings extends BaseService {
    private url = `${this.baseUrl}/curator/settings`;

    async getTelegramLink(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Link>>(
            `${this.url}/get-telegram-connect-link`,
            options,
        );
        return response;
    }

    async getTelegramId(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Telegram>>(`${this.url}/get-telegram-id`, options);
        return response;
    }
}

export default new CuratorSettings();
