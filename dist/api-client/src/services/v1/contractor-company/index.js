"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorCompanyService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class ContractorCompanyService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/contractor-company`;
        this.getShopList = (params) => this.http
            .get(`${this.url}/shops`, {
            params,
        })
            .then(r => r.data.response);
    }
}
exports.ContractorCompanyService = ContractorCompanyService;
exports.default = new ContractorCompanyService();
//# sourceMappingURL=index.js.map