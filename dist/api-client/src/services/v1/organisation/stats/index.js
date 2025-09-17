"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganisationStatsService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class OrganisationStatsService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organisation/stats`;
        this.getDynamicTaskStats = async (params, options) => await this.http
            .get(`${this.url}/tasks/dynamic`, { params, ...options })
            .then(resp => resp.data.response);
        this.getNumberTaskStats = async (params, options) => await this.http
            .get(`${this.url}/tasks/numbers`, { params, ...options })
            .then(resp => resp.data.response);
        this.getXlsTaskStats = async (params, options) => await this.http
            .get(`${this.url}/tasks/xls`, { params, ...options })
            .then(resp => resp.data.response);
        this.getDynamicFinancesStats = async (params, options) => await this.http
            .get(`${this.url}/finances/dynamic`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getNumberFinancesStats = async (params, options) => await this.http
            .get(`${this.url}/finances/numbers`, { params, ...options })
            .then(resp => resp.data.response);
        this.getXlsFinancesStats = async (params, options) => await this.http
            .get(`${this.url}/tasks/xls`, { params, ...options })
            .then(resp => resp.data.response);
        this.getDynamicShopsStats = async (params, options) => await this.http
            .get(`${this.url}/shops/dynamic`, { params, ...options })
            .then(resp => resp.data.response);
        this.getNumberShopStats = async (params, options) => await this.http
            .get(`${this.url}/shops/numbers`, { params, ...options })
            .then(resp => resp.data.response);
        this.getShopsStats = async (params, options) => await this.http
            .get(`${this.url}/shops/map`, { params, ...options })
            .then(resp => resp.data.response);
        this.getShopStats = async (params, options) => await this.http
            .get(`${this.url}/shops/shop`, { params, ...options })
            .then(resp => resp.data.response);
        this.getDynamicVisitsShopStats = async (params, options) => await this.http
            .get(`${this.url}/shops/dynamic-visits`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getIncidentStats = async (params, options) => await this.http
            .get(`${this.url}/contract-companies/incidents-statuses-count`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.OrganisationStatsService = OrganisationStatsService;
exports.default = new OrganisationStatsService();
//# sourceMappingURL=index.js.map