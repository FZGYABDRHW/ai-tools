"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerInfo = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class PerformerInfo extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/performer`;
        this.setLocation = async (params, options) => await this.http
            .put(`${this.url}/location`, { ...params }, options)
            .then(resp => resp.data.response);
        this.removePerformerLocation = async (params, options) => await this.http.delete(`${this.url}/location`, options).then(resp => resp.data.status);
    }
    async getPaymentStatus(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/wallet/get-payment-status`, {
            params,
            ...options,
        });
        return response;
    }
    async repaymentMoney(params, options) {
        const { data: { response }, } = await this.http.put(`${this.url}/wallet/moneyback`, params, options);
        return response;
    }
}
exports.PerformerInfo = PerformerInfo;
exports.default = new PerformerInfo();
//# sourceMappingURL=index.js.map