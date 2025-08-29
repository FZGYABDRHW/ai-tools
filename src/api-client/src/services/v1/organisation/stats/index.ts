import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    DynamicShopStats,
    DynamicStats,
    FinancesDynamicStats,
    IncidentsStatistics,
    IncidentsStatisticsQuery,
    NumbersStats,
    ShopStats,
} from './interfaces';

export interface Params {
    year: number;
    month?: number;
    quarter?: number;
    sub_org?: number;
    department?: number;
    shop_id?: number;
}

export class OrganisationStatsService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organisation/stats`;

    getDynamicTaskStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<DynamicStats[]>>(`${this.url}/tasks/dynamic`, { params, ...options })
            .then(resp => resp.data.response);

    getNumberTaskStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<NumbersStats>>(`${this.url}/tasks/numbers`, { params, ...options })
            .then(resp => resp.data.response);

    getXlsTaskStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/tasks/xls`, { params, ...options })
            .then(resp => resp.data.response);

    getDynamicFinancesStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<FinancesDynamicStats[]>>(`${this.url}/finances/dynamic`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    getNumberFinancesStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<NumbersStats>>(`${this.url}/finances/numbers`, { params, ...options })
            .then(resp => resp.data.response);

    getXlsFinancesStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/tasks/xls`, { params, ...options })
            .then(resp => resp.data.response);

    getDynamicShopsStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/shops/dynamic`, { params, ...options })
            .then(resp => resp.data.response);

    getNumberShopStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/shops/numbers`, { params, ...options })
            .then(resp => resp.data.response);

    getShopsStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<ShopStats[]>>(`${this.url}/shops/map`, { params, ...options })
            .then(resp => resp.data.response);

    getShopStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/shops/shop`, { params, ...options })
            .then(resp => resp.data.response);

    getDynamicVisitsShopStats = async (params: Params, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<DynamicShopStats[]>>(`${this.url}/shops/dynamic-visits`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    getIncidentStats = async (params: IncidentsStatisticsQuery, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<IncidentsStatistics>>(
                `${this.url}/contract-companies/incidents-statuses-count`,
                { params, ...options },
            )
            .then(resp => resp.data.response);
}

export default new OrganisationStatsService();
