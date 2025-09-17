"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorCompanyService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class ContractorCompanyService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/contractor-company`;
        this.registration = (data, options) => this.http
            .post(`${this.url}`, data, options)
            .then(resp => resp.data.response);
        this.checkInvite = (id, options) => this.http
            .patch(`${this.url}/invitation/${id}/accept`, options)
            .then(resp => resp.data.response);
    }
}
exports.ContractorCompanyService = ContractorCompanyService;
exports.default = new ContractorCompanyService();
//# sourceMappingURL=index.js.map