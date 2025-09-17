"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class WalletService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/wallet`;
        this.deleteCard = async (userId, cardNumber, options) => await this.http
            .delete(`${this.url}/card/${userId}/${cardNumber}`)
            .then(resp => resp.data.response);
        this.deletePlasticCard = async (userId, cardNumber, options) => await this.http
            .delete(`${this.url}/delete-card/${userId}/${cardNumber}`, options)
            .then(resp => resp.data.response);
    }
}
exports.WalletService = WalletService;
exports.default = new WalletService();
//# sourceMappingURL=index.js.map