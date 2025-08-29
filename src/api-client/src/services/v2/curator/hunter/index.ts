import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import {
    AllHunterStats,
    HunterBonusSettings,
    HunterBonusView,
    HunterFinesParams,
    HunterStats,
    HunterTotalStats,
    PerformerFineByType,
} from './interfaces';
import { SessionStatus } from '../interfaces';

export class HunterService extends BaseService {
    private readonly url = `${this.baseUrl}/curator/hunter`;

    public getUserStatus = (userId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<SessionStatus>>(
                `${this.url}/${userId}/session/profile/status`,
                options,
            )
            .then(resp => resp.data.response);

    public getHunterStats = (id: number, year: number, month: number) =>
        this.http
            .get<BaseResponse<{ items: HunterStats[] }>>(`${this.url}/${id}/stats/${year}/${month}`)
            .then(resp => resp.data.response);

    public getHunterTotalStats = (id: number, year: number, month: number) =>
        this.http
            .get<BaseResponse<HunterTotalStats>>(`${this.url}/${id}/stats/total/${year}/${month}`)
            .then(resp => resp.data.response);

    public getAllHunterStats = (month: number, year: number, group: string) =>
        this.http
            .get<BaseResponse<AllHunterStats[]>>(`${this.url}/stats/${year}/${month}/${group}`)
            .then(resp => resp.data.response);

    public readonly deleteFine = (hunterBonusId: number) =>
        this.http
            .delete(`${this.url}/stats/fine/${hunterBonusId}`)
            .then(resp => (resp.data as BaseResponse<any>).response);

    public readonly getHunterFines = ({ hunterId, type, year, month }: HunterFinesParams) =>
        this.http
            .get<BaseResponse<{ items: ReadonlyArray<PerformerFineByType> }>>(
                `${this.url}/${hunterId}/stats/fine/${type}/${year}/${month}`,
            )
            .then(resp => resp.data.response);

    public readonly getHunterBonusView = (hunterBonusId: number) =>
        this.http
            .get<BaseResponse<HunterBonusView>>(`${this.url}/stats/bonus/${hunterBonusId}/view`)
            .then(resp => resp.data.response);

    public readonly getHunterBonusSettings = () =>
        this.http
            .get<BaseResponse<HunterBonusSettings>>(`${this.url}/bonus/settings`)
            .then(resp => resp.data.response);
}

export default new HunterService();
