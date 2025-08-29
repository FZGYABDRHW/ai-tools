import { BaseResponse } from '../../interfaces';
import { FilesResponse } from './interfaces';
import BaseService from '../BaseServiceV2';

export class SessionService extends BaseService {
    private url = `${this.baseUrl}/session`;

    public readonly getSessionFiles = (uuid: string) =>
        this.http
            .get<BaseResponse<FilesResponse>>(`${this.url}/${uuid}/files`)
            .then(r => r.data.response);
}

export default new SessionService();
