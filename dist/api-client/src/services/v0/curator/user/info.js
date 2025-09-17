"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerInfo = void 0;
const BaseServiceV0_1 = __importDefault(require("../../BaseServiceV0"));
class PerformerInfo extends BaseServiceV0_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/user`;
        this.getPerformerInfo = (performerId) => this.http
            .get(`${this.url}/profile/summary?userId=${performerId}`)
            .then(res => res.data);
        this.postAnnotations = (params) => this.http
            .post(`${this.url}/user-action/annotation`, params)
            .then(res => res.data);
    }
}
exports.PerformerInfo = PerformerInfo;
//# sourceMappingURL=info.js.map