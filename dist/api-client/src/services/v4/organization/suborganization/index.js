"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuborganizationService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class SuborganizationService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization`;
        this.get = (id, options) => this.http
            .get(`${this.url}/suborganization/${id}`)
            .then(resp => resp.data.response);
        this.updateDescription = (id, params, options) => this.http
            .patch(`${this.url}/suborganization/${id}`, params, options)
            .then(resp => resp.data.response);
        this.getList = (organizationId, params = {}, options) => this.http
            .get(`${this.url}/${organizationId}/suborganization`, {
            params: {
                ids: params.ids.join(','),
                limit: params.limit,
            },
        })
            .then(resp => resp.data.response);
        this.getLegalIdentifier = (id, options) => this.http
            .get(`${this.url}/suborganization/${id}/legal-identifier`, options)
            .then(resp => resp.data.response);
        this.getFranchise = (suborganizationId, options) => this.http
            .get(`${this.url}/suborganization/${suborganizationId}/franchise`, options)
            .then(resp => resp.data.response);
        this.addBankAccount = (suborganizationId, params, options) => this.http
            .post(`${this.url}/suborganization/${suborganizationId}/bank-account`, params, options)
            .then(resp => resp.data.response);
        this.getBankAccountList = (suborganizationId, options) => this.http
            .get(`${this.url}/suborganization/${suborganizationId}/bank-account`, options)
            .then(resp => resp.data.response);
        this.deleteBankAccount = (accountId, options) => this.http
            .delete(`${this.url}/suborganization/bank-account/${accountId}`, options)
            .then(resp => resp.data.response);
        this.getVatRates = (options) => this.http
            .get(`${this.url}/suborganization/vat-rates`, options)
            .then(resp => resp.data.response);
    }
}
exports.SuborganizationService = SuborganizationService;
exports.default = new SuborganizationService();
//# sourceMappingURL=index.js.map