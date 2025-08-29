import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { INotifications } from './interfaces';
import { AxiosRequestConfig } from 'axios';

class NotificationsService extends BaseService {
    private url = `${this.baseUrl}/performer/settings/notifications`;

    async setNotification(params, options?: AxiosRequestConfig) {
        const {
            data: { messages },
        } = await this.http.post<BaseResponse<null>>(this.url, params, options);
        return messages;
    }

    async getNotification(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<INotifications>>(this.url, options);
        return response;
    }
}

export { NotificationsService };

export default new NotificationsService();
