"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerRegion = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class PerformerRegion extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/region`;
    }
    async searchPerformerRegion(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/search`, {
            params,
            ...options,
        });
        return response;
    }
}
exports.PerformerRegion = PerformerRegion;
exports.default = new PerformerRegion();
//# sourceMappingURL=index.js.map