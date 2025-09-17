"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContractService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class OrganizationContractService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/contract`;
        this.getMinimalPrice = async (id, params) => {
            return this.http
                .get(`${this.url}/${id}/minimal-price`, { params })
                .then(resp => resp.data.response);
        };
    }
}
exports.OrganizationContractService = OrganizationContractService;
exports.default = new OrganizationContractService();
//# sourceMappingURL=index.js.map