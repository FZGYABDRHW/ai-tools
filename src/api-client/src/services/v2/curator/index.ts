import { AxiosRequestConfig } from 'axios';
import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { SessionStatus, Shops } from './interfaces';

export class CuratorService extends BaseService {
    private url = `${this.baseUrl}/curator`;

    public getNearbyCleaningContractors = async (shopId: number, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<Shops[]>>(
                `${this.url}/tools/nearby-cleaning-contractors/${shopId}`,
                options,
            )
            .then(resp => resp.data.response);

    public getUserStatus = async (userId: number, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<SessionStatus>>(
                `${this.url}/${userId}/session/profile/status`,
                options,
            )
            .then(resp => resp.data.response);

    public getUserSession = async (params: { userId?: number }, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<{ online: boolean }>>(`${this.url}/session`, { params, ...options })
            .then(resp => resp.data.response);

    public restoreUser = async (performerId: number, options?: AxiosRequestConfig) =>
        await this.http
            .put<BaseResponse<any>>(`${this.url}/user/restore-user/${performerId}`, {}, options)
            .then(resp => resp.data.response);

    public setTaskLimit = async (
        performerId: number,
        taskLimit: number,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .put<BaseResponse<null>>(
                `${this.url}/user/set-task-limit/${performerId}/${taskLimit}`,
                options,
            )
            .then(resp => resp.data.response);

    public dropTaskLimit = async (performerId: number, options?: AxiosRequestConfig) =>
        await this.http
            .put<BaseResponse<null>>(`${this.url}/user/set-task-limit/${performerId}`, options)
            .then(resp => resp.data.response);
}

export default new CuratorService();
