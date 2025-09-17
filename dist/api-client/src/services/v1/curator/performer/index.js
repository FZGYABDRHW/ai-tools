"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerInformationService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class PerformerInformationService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/performer`;
        this.getContractorPassportStatus = (params, options) => this.http
            .get(`${this.url}/passport/status`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
    }
    async getPerformerTransactions(performerId, limit = 20, offset = 0, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${performerId}/transaction`, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }
    async postPerformerPassportCheck(params, options) {
        const { data } = await this.http.post(`${this.url}/passport/check`, params, options);
        return data;
    }
    async getPerformerAnnotations(performerId, params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${performerId}/annotations`, {
            params,
            ...options,
        });
        return response;
    }
}
exports.PerformerInformationService = PerformerInformationService;
exports.default = new PerformerInformationService();
//# sourceMappingURL=index.js.map