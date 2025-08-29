import BaseService from '../../BaseServiceV4';
import { AxiosRequestConfig } from 'axios';
import { BaseResponse } from '../../../interfaces';
import { ExecutionAddressInfo } from './interfaces';

export class CuratorToolsService extends BaseService {
    private readonly url: string = `${this.baseUrl}`;

    public readonly getExecutionAddressInfo = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ExecutionAddressInfo>>(`${this.url}/execution-address/${id}`, {
                ...options,
            })
            .then(response => response.data.response);
}
