"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class PerformerService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/user/performer`;
        this.performerWalletStats = async (year, params, options) => await this.http
            .get(`${this.url}/wallet/stat/${year}`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.walletPayout = async (params, options) => await this.http
            .post(`${this.url}/wallet/payout`, params, options)
            .then(resp => resp.data);
        this.createContractor = async (data, options) => await this.http.post(this.url, data, options).then(resp => resp.data);
        this.getBasePerformerStatistic = (id, params, options) => this.http
            .get(`${this.baseUrl}/user/${id}/performer/statistic/base`, { params, ...options })
            .then(resp => resp.data.response);
        this.getTerritorySkillEarnedPerformerStatistic = (id, params, options) => this.http
            .get(`${this.baseUrl}/user/${id}/performer/statistic/territory-skill`, { params, ...options })
            .then(resp => resp.data.response);
        this.getCommissionInfo = (params) => this.http
            .get(`${this.url}/wallet/payout/commission-info`, {
            params,
        })
            .then(resp => resp.data.response);
        this.getConstructionWorksStatistic = (id, params) => 
        // TODO: Тут бек возвращает snake_case, а для cbl нужен CamelCase
        // Временное решение - конвертировать
        // В будущем нужно от этой конвертации избавится, либо вынести ее на более низкий уровень
        this.http
            .get(`${this.baseUrl}/user/${id}/performer/statistic/construction-works`, {
            params,
        })
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
            };
        });
    }
}
exports.PerformerService = PerformerService;
exports.default = new PerformerService();
//# sourceMappingURL=index.js.map