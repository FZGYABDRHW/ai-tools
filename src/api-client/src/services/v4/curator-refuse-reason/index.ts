import { AxiosRequestConfig } from 'axios';

import { BaseResponse } from '../../interfaces';
import BaseService from '../BaseServiceV4';
import { RefuseReason } from './interfaces';

export class CuratorRefuseReasonService extends BaseService {
    private url: string = `${this.baseUrl}/curator-refuse-reason`;

    public getCuratorRefuseReason(
        userId: number,
        reasonType: number,
        options?: AxiosRequestConfig,
    ) {
        return this.http
            .get<BaseResponse<RefuseReason[]>>(this.url, {
                ...options,
                params: { userId, type: reasonType },
            })
            .then(response => response.data.response);
    }
}
