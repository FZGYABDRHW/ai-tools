"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationWalletService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class OrganizationWalletService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization`;
        this.getList = (organizationId, params, options) => this.http
            .get(`${this.url}/${organizationId}/wallet`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getWallet = (organizationId, walletId, options) => this.http
            .get(`${this.url}/${organizationId}/wallet/${walletId}`, options)
            .then(resp => resp.data.response);
    }
}
exports.OrganizationWalletService = OrganizationWalletService;
exports.default = new OrganizationWalletService();
//# sourceMappingURL=index.js.map