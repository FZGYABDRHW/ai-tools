"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerWalletService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../../BaseServiceV4"));
class PerformerWalletService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = (performerId) => `${this.baseUrl}/user/${performerId}/performer/wallet`;
        this.getPerformerWallet = (performerId, options) => this.http
            .get(`${this.url(performerId)}`, options)
            .then(resp => resp.data.response);
        this.getWalletStatus = ({ performerId, paymentId }, options) => this.http
            .get(`${this.url(performerId)}/payment/${paymentId}/status`, options)
            .then(resp => resp.data.response);
    }
}
exports.PerformerWalletService = PerformerWalletService;
exports.default = new PerformerWalletService();
//# sourceMappingURL=index.js.map