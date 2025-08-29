import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class WebSocketGateway extends BaseService {
    public readonly getRoomKey = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ room: string }>>(`${this.baseUrl}/gateway/web-socket/room`, options)
            .then(resp => resp.data);
}

export default new WebSocketGateway();
