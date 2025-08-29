import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { IContacts, SaveAdditionalPhone } from './interfaces';
import { AxiosRequestConfig } from 'axios';

class ContactsService extends BaseService {
    private url = `${this.baseUrl}/performer/settings/contacts`;

    async getContacts(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IContacts>>(this.url, options);
        return response;
    }

    public readonly deleteAdditionalPhone = (options?: AxiosRequestConfig) =>
        this.http
            .delete(`${this.url}/phone/additional`, options)
            .then(result => result.data.response);

    public readonly saveAdditionalPhone = (
        params: SaveAdditionalPhone,
        options?: AxiosRequestConfig,
    ) =>
        this.http.post(`${this.url}/phone/additional`, params, options).then(result => result.data);

    public readonly deleteEmail = (options?: AxiosRequestConfig) =>
        this.http.delete(`${this.url}/email`, options).then(result => result.data.response);
}

export { ContactsService };

export default new ContactsService();
