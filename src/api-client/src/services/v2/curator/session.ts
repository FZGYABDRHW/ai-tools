import { AxiosRequestConfig } from 'axios';
import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';

export class Session extends BaseService {
    private url = `${this.baseUrl}/curator/session`;

    status(options?: AxiosRequestConfig) {
        return this.http
            .get<BaseResponse<{ online: boolean }>>(this.url, options)
            .then(res => res.data);
    }

    start(options?: AxiosRequestConfig) {
        return this.http.post<BaseResponse<{}>>(this.url, null, options).then(res => res.data);
    }

    stop(options?: AxiosRequestConfig) {
        return this.http.delete(this.url, options).then(res => res.data);
    }
}

export default new Session();
