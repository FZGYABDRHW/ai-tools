import BaseService from '../../BaseServiceV0';
import { CuratorRoles, TeamInfo, UserInformation } from './interfaces';

// I dont believe this api version returns such response, tested only on setReceipts method and obviously it was wrong.
// just copy-pasted service from frontend repository
import { IResponseModel } from '../../interfaces';

export class RatingService extends BaseService {
    private url = `${this.baseUrl}/curator/rating`;

    getTeamsList = async () =>
        await this.http.get<TeamInfo[]>(`${this.url}/stats/teams-info`).then(resp => resp.data);

    getYears = async () =>
        await this.http
            .get<IResponseModel<null>>(`${this.url}/stats/available-years`)
            .then(resp => resp.data);

    setReceipt = async params =>
        await this.http
            .put<boolean>(`${this.url}/settings/receive-task`, params)
            .then(resp => resp.data);

    setReceiveTaskAsHunter = async (params: { hunter_id: number; value: number }) =>
        await this.http
            .put<boolean>(`${this.url}/settings/receive-task-as-hunter`, params)
            .then(resp => resp.data);

    getUserInfo = async (params: { userId: number }) =>
        await this.http
            .get<UserInformation>(`${this.url}/settings/user-info`, { params })
            .then(resp => resp.data);

    getCuratorDashboard = async (params: { month: number; year: number }) =>
        await this.http
            .get<UserInformation>(`${this.url}/dashboard/curator`, { params })
            .then(resp => resp.data);

    getHunterDashboard = async (params: { month: number; year: number }) =>
        await this.http
            .get<UserInformation>(`${this.url}/dashboard/hunter`, { params })
            .then(resp => resp.data);

    getTeamMembersDashboard = async (params: {
        month?: number;
        year: number;
        period?: string;
        curator_id?: number;
    }) =>
        await this.http
            .get<any>(`${this.url}/dashboard/team-members-data`, { params })
            .then(resp => resp.data);

    getTeamHeadDashboard = async (params: { month: number; year: number; period: string }) =>
        await this.http
            .get<any>(`${this.url}/stats/team-heads`, { params })
            .then(resp => resp.data);

    getCuratorsRoles = async () =>
        await this.http
            .get<CuratorRoles[]>(`${this.url}/stats/curator-roles`)
            .then(resp => resp.data);
}
