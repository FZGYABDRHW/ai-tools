"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatedRegionService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class CalculatedRegionService extends BaseServiceV2_1.default {
    async getRegions(options) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/site/calculator-regions`, options);
        return response;
    }
    async getCalculatorPrice(options) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/site/calculator`, options);
        return response;
    }
}
exports.CalculatedRegionService = CalculatedRegionService;
exports.default = new CalculatedRegionService();
//# sourceMappingURL=index.js.map