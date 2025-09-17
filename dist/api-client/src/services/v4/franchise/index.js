"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FranchiseService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class FranchiseService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/franchise`;
        this.getFranchiseList = (options) => this.http
            .get(`${this.url}`, { ...options })
            .then(resp => resp.data.response);
        this.getFranchiseBankAccountList = (franchiseId, params, options) => this.http
            .get(`${this.url}/${franchiseId}/bank-accounts`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.FranchiseService = FranchiseService;
//# sourceMappingURL=index.js.map