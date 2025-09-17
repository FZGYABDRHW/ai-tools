"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorRefuseReasonService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class CuratorRefuseReasonService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator-refuse-reason`;
    }
    getCuratorRefuseReason(userId, reasonType, options) {
        return this.http
            .get(this.url, {
            ...options,
            params: { userId, type: reasonType },
        })
            .then(response => response.data.response);
    }
}
exports.CuratorRefuseReasonService = CuratorRefuseReasonService;
//# sourceMappingURL=index.js.map