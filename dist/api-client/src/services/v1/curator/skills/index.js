"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerSkillsService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class PerformerSkillsService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.serviceUrl = `${this.baseUrl}/curator/performer/skill`;
    }
    async getSkillsList(id, options) {
        const { data: { response }, } = await this.http.get(`${this.serviceUrl}/list`, {
            params: { userId: id },
            ...options,
        });
        return response;
    }
    async skillApprove(params, options) {
        const { data: { response }, } = await this.http.post(`${this.serviceUrl}/approve`, params, options);
        return response;
    }
    async skillReject(params, options) {
        const { data: { status }, } = await this.http.post(`${this.serviceUrl}/reject`, params, options);
        return status;
    }
    async getCalls(id, options) {
        const { data: { response }, } = await this.http.get(`${this.serviceUrl}/calls`, {
            params: { userId: id },
            ...options,
        });
        return response;
    }
    async missedCall(params, options) {
        const { data: { response }, } = await this.http.post(`${this.serviceUrl}/calls`, params, options);
        return response;
    }
}
exports.PerformerSkillsService = PerformerSkillsService;
exports.default = new PerformerSkillsService();
//# sourceMappingURL=index.js.map