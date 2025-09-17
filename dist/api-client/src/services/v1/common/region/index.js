"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRegionService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class CommonRegionService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/region`;
        this.getRegion = (id, options) => this.http.get(`${this.url}/${id}`, options).then(resp => resp.data);
    }
}
exports.CommonRegionService = CommonRegionService;
exports.default = new CommonRegionService();
//# sourceMappingURL=index.js.map