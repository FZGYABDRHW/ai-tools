"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerWalletInfo = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class PerformerWalletInfo extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/tools/wallet`;
    }
    async putPerformerWallet(performerId, walletInfo, options) {
        const { data: { response }, } = await this.http.post(`${this.url}/${performerId}`, walletInfo, options);
        return response;
    }
}
exports.PerformerWalletInfo = PerformerWalletInfo;
exports.default = new PerformerWalletInfo();
//# sourceMappingURL=wallet.js.map