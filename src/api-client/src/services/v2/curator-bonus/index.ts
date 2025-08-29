import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { CuratorStats, TaskStats, TeamStats } from './interfaces';
import { Params } from './interfaces';

export class CuratorBonusService extends BaseService {
    private readonly url: string = `${this.baseUrl}/curator-bonus`;

    public readonly getCurators = (params?: Params, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<CuratorStats[]>>(`${this.url}/curator-stats`, { params, ...options })
            .then(response => response.data.response);

    public readonly getTeams = (params?: Params, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<TeamStats[]>>(`${this.url}/team-stats`, { params, ...options })
            .then(response => response.data.response);

    public readonly getTaskStatsList = (
        curatorId: number,
        params?: Params,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<TaskStats[]>>(`${this.url}/task-list/${curatorId}`, {
                params,
                ...options,
            })
            .then(response => response.data.response);
}
