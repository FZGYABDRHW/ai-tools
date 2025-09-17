"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletPerformerService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class WalletPerformerService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/wallet-performer`;
        this.getPaymentStatus = (params, options) => this.http
            .get(`${this.url}/get-payment-status`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.WalletPerformerService = WalletPerformerService;
exports.default = new WalletPerformerService();
//# sourceMappingURL=index.js.map