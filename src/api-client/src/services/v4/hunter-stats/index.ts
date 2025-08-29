import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { HunterStatsCleaning, HunterTeamStatistics, HunterCleaningBonus } from './interfaces';
import { HunterStats } from '../../v2/curator/hunter/interfaces';

export class HunterTeamsStatisticsService extends BaseService {
    private readonly url: string = `${this.baseUrl}/hunter-stats`;

    public readonly getHunterTeamsStatistics = (
        year: number,
        month: number,
        team: number | string,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<HunterTeamStatistics[]>>(
                `${this.url}/teams/${year}/${month}/${team}`,
                options,
            )
            .then(response => response.data.response);

    public getHunterStatsCleaning = (year: number, month: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<HunterStatsCleaning[]>>(`${this.url}/cleaning/${year}/${month}`)
            .then(response => response.data.response);

    public getHunterCleaningBonus = (
        year: number,
        month: number,
        hunterId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<HunterCleaningBonus[]>>(
                `${this.url}/cleaning/detailed-bonus/${year}/${month}/${hunterId}`,
            )
            .then(response => response.data.response);
}
