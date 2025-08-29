import BaseService from '../../BaseServiceCurator';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    Passport,
    Balance,
    Transaction,
    Region,
    TaskList,
    Event,
    ISkillHistory,
    RegionsResponse,
} from './interface';

export class PerformerTransaction extends BaseService {
    private url = `${this.baseUrl}/user/performer`;

    public readonly getPerformerTransaction = (userId: number, options?: AxiosRequestConfig) => {
        this.http
            .get<Transaction>(`${this.url}/transactions?userId=${userId}`)
            .then(resp => resp.data);
    };

    public readonly getPerformerBalance = (userId: number, options?: AxiosRequestConfig) => {
        this.http.get<Balance>(`${this.url}/balance?userId=${userId}`).then(resp => resp.data);
    };

    public readonly getPerformerPassport = (
        params: { userId: number },
        options?: AxiosRequestConfig,
    ) => {
        this.http.get<Passport>(`${this.url}/passport`, { params }).then(resp => resp.data);
    };

    public readonly getPerformerRegion = (
        params: { userId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<RegionsResponse>>(`${this.url}/regions`, { params })
            .then(resp => resp.data.response);

    public readonly getTaskList = (params: { userId: number }, options?: AxiosRequestConfig) => {
        this.http.get<TaskList>(`${this.url}/task-list`, { params }).then(resp => resp.data);
    };

    public readonly getTaskListDone = (
        params: { userId: number },
        options?: AxiosRequestConfig,
    ) => {
        this.http.get<TaskList>(`${this.url}/task-list-done`, { params }).then(resp => resp.data);
    };

    public readonly getProfileHistory = (
        params: { userId: number },
        options?: AxiosRequestConfig,
    ) => {
        this.http.get<Event[]>(`${this.url}/profile-history`, { params }).then(resp => resp.data);
    };

    public readonly getSkillsHistory = (
        params: { userId: number },
        options?: AxiosRequestConfig,
    ) => {
        this.http
            .get<ISkillHistory[]>(`${this.url}/skills-history`, { params })
            .then(resp => resp.data);
    };

    public readonly getIndividualEntrepreneur = (
        params: { userId: number },
        options?: AxiosRequestConfig,
    ) => this.http.get<any>(`${this.url}/individual-entrepreneur`, { params });

    public readonly approveIEData = (params: { userId: number }, options?: AxiosRequestConfig) => {
        this.http
            .put<any>(`${this.url}/approve-individual-entrepreneur-data`, params)
            .then(resp => resp.data);
    };

    public readonly refuseIE = (
        params: { userId: number; reason?: string },
        options?: AxiosRequestConfig,
    ) => {
        this.http
            .post<any>(`${this.url}/refuse-individual-entrepreneur-data`, params)
            .then(resp => resp.data.response);
    };
}

export default new PerformerTransaction();
