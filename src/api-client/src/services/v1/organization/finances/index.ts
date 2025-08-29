import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV1';
import { TaskEvent, WalletHistory } from './interfaces';

export default class OrganizationFinances extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization/finances`;

    getTaskWalletHistory = async (
        params: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .get<BaseResponse<WalletHistory>>(`${this.url}/wallet/history`, { params, ...options })
            .then(resp => resp.data.response);

    getTaskOperations = async (
        taskId: number,
        relatedEntityName: string,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .get<BaseResponse<{ items: TaskEvent[] }>>(
                `${this.url}/wallet/history/task/${taskId}/operations`,
                {
                    params: { relatedEntityName },
                    ...options,
                },
            )
            .then(resp => resp.data.response);
}
