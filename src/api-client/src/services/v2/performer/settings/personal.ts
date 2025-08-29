import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { UserInfoStore } from './interfaces';
import { AxiosRequestConfig } from 'axios';

class PersonalService extends BaseService {
    private url = `${this.baseUrl}/performer/settings/personal`;

    async setUserInfo(userInfo, options?: AxiosRequestConfig) {
        const {
            data: { messages },
        } = await this.http.post<BaseResponse<null>>(this.url, userInfo, options);
        return messages;
    }

    async getUserInfo(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<UserInfoStore>>(this.url, options);
        return response;
    }
}
export { PersonalService };

export default new PersonalService();
