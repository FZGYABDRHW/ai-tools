import { AxiosRequestConfig } from 'axios';

import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import {
    WalletStats,
    WalletPayoutParams,
    HunterRegistrationModalResult,
    BasePerformerStatisticParams,
    BasePerformerStatistic,
    StatisticEarnedMoneyBySkillAndTerritory,
    CommissionInfo,
    CommissionInfoParams,
    ConstructionWorksStatistic,
    ConstructionWorksStatisticParams,
} from './interfaces';

export class PerformerService extends BaseService {
    private readonly url: string = `${this.baseUrl}/user/performer`;

    public readonly performerWalletStats = async (
        year?: number,
        params?: { id?: number },
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .get<BaseResponse<WalletStats>>(`${this.url}/wallet/stat/${year}`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly walletPayout = async (
        params: WalletPayoutParams,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .post<BaseResponse<void>>(`${this.url}/wallet/payout`, params, options)
            .then(resp => resp.data);

    public readonly createContractor = async (
        data: HunterRegistrationModalResult,
        options?: AxiosRequestConfig,
    ) => await this.http.post<BaseResponse<void>>(this.url, data, options).then(resp => resp.data);

    public readonly getBasePerformerStatistic = (
        id: number,
        params: BasePerformerStatisticParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<BasePerformerStatistic>>(
                `${this.baseUrl}/user/${id}/performer/statistic/base`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getTerritorySkillEarnedPerformerStatistic = (
        id: number,
        params: BasePerformerStatisticParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<StatisticEarnedMoneyBySkillAndTerritory>>(
                `${this.baseUrl}/user/${id}/performer/statistic/territory-skill`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getCommissionInfo = (params: CommissionInfoParams) =>
        this.http
            .get<BaseResponse<CommissionInfo>>(`${this.url}/wallet/payout/commission-info`, {
                params,
            })
            .then(resp => resp.data.response);

    public readonly getConstructionWorksStatistic = (
        id: number,
        params?: ConstructionWorksStatisticParams,
    ) =>
        // TODO: Тут бек возвращает snake_case, а для cbl нужен CamelCase
        // Временное решение - конвертировать
        // В будущем нужно от этой конвертации избавится, либо вынести ее на более низкий уровень
        this.http
            .get<BaseResponse<any>>(
                `${this.baseUrl}/user/${id}/performer/statistic/construction-works`,
                {
                    params,
                },
            )
            .then(resp => {
                const baseStatistic = resp.data.response;

                return {
                    limit: {
                        moneyAmount: baseStatistic.limit.money_amount,
                        currency: baseStatistic.limit.currency,
                    },
                    totalSum: {
                        moneyAmount: baseStatistic.total_sum.money_amount,
                        currency: baseStatistic.total_sum.currency,
                    },
                    withholdingVatRate: baseStatistic.withholding_vat_rate,
                } as ConstructionWorksStatistic;
            });
}

export default new PerformerService();
