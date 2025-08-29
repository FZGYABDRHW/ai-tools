import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { PbxCallInfo } from './interfaces';

export class PbxCallsLogService extends BaseService {
    private readonly url: string = `${this.baseUrl}/pbx-calls-log`;

    public readonly getInfo = (id: number) =>
        this.http
            .get<BaseResponse<PbxCallInfo>>(`${this.url}/${id}`)
            .then(resp => resp.data.response);
}

export default new PbxCallsLogService();
