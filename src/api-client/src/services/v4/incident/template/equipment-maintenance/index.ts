import { AxiosRequestConfig } from 'axios';
import BaseService from '../../../BaseServiceV4';
import { BaseResponse } from '../../../../interfaces';
import {
    ScheduleListQuery,
    ScheduleList,
    Schedule,
    ScheduleTemplate,
    CreateScheduleTemplateQuery,
    CreateScheduleQuery,
} from './interfaces';

export class EquipmentMaintenanceService extends BaseService {
    private readonly url: string = `${this.baseUrl}/incident/template/equipment-maintenance`;

    readonly getScheduleList = (params: Partial<ScheduleListQuery>, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ScheduleList>>(`${this.url}/schedule`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    readonly getSchedule = (scheduleId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Schedule>>(`${this.url}/schedule/${scheduleId}`, {
                ...options,
            })
            .then(resp => resp.data.response);

    readonly getScheduleTemplate = (templateId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ScheduleTemplate>>(`${this.url}/${templateId}`, {
                ...options,
            })
            .then(resp => resp.data.response);

    readonly createScheduleTemplate = (
        params: CreateScheduleTemplateQuery,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<{ id: number }>>(this.url, params, {
                ...options,
            })
            .then(resp => resp.data.response);

    readonly createSchedule = (params: CreateScheduleQuery, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/schedule`, params, {
                ...options,
            })
            .then(resp => resp.data.response);
}
