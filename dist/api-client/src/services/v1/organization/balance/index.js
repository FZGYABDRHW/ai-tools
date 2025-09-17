"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationBalanceService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class OrganizationBalanceService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/balance`;
        this.getBalance = async (params, options) => this.http
            .get(`${this.url}/departments`, { params, ...options })
            .then(resp => resp.data.response);
        this.getOrganizationBalance = async (params, options) => await this.http
            .get(this.url, { params, ...options })
            .then(resp => resp.data.response);
        this.departmentDeposite = async (suborganizationId, departmentId, sum, destination, options) => await this.http
            .put(`${this.url}/suborganization/${suborganizationId}/department/${departmentId}`, { sum, destination }, options)
            .then(resp => resp.data.response);
        this.getDepartmentVat = async (suborganizationId, options) => await this.http
            .get(`${this.url}/suborganization/${suborganizationId}/vat`, options)
            .then(resp => resp.data.response);
    }
}
exports.OrganizationBalanceService = OrganizationBalanceService;
exports.default = new OrganizationBalanceService();
//# sourceMappingURL=index.js.map