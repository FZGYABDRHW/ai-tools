"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorRegionService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class CuratorRegionService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/region`;
        this.getCuratorRegion = (params, options) => this.http
            .get(`${this.url}/search`, { params, ...options })
            .then(resp => resp.data);
    }
}
exports.CuratorRegionService = CuratorRegionService;
exports.default = new CuratorRegionService();
//# sourceMappingURL=index.js.map