"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerProfileService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class PerformerProfileService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.serviceUrl = `${this.baseUrl}/curator/performer/profile`;
        this.getPerformerInfo = (params, options) => this.http
            .get(`${this.serviceUrl}/tabs`, { params, ...options })
            .then(resp => resp.data);
    }
}
exports.PerformerProfileService = PerformerProfileService;
exports.default = new PerformerProfileService();
//# sourceMappingURL=index.js.map