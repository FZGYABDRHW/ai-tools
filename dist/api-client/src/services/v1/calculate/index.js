"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatedService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class CalculatedService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.getCalculatedService = (region_id, options) => this.http
            .get(`${this.baseUrl}/site/calculator`, options)
            .then(resp => resp.data);
        this.postCompany = (params, options) => this.http
            .post(`${this.baseUrl}/landing/contact/company`, params, options)
            .then(resp => resp.data);
    }
}
exports.CalculatedService = CalculatedService;
exports.default = new CalculatedService();
//# sourceMappingURL=index.js.map