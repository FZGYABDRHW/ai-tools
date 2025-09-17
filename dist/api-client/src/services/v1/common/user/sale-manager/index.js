"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleManagerService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class SaleManagerService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/user`;
        this.getSaleManager = async (userId, options) => await this.http
            .get(`${this.url}/${userId}/sale-manager`, options)
            .then(resp => resp.data.response);
    }
}
exports.SaleManagerService = SaleManagerService;
exports.default = new SaleManagerService();
//# sourceMappingURL=index.js.map