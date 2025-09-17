"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerSkillsService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class PerformerSkillsService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.serviceUrl = `${this.baseUrl}/curator/performer/skill`;
        this.getSkillsList = (id, options) => this.http
            .get(`${this.serviceUrl}/list`, {
            params: { user: id },
            ...options,
        })
            .then(resp => resp.data);
        this.skillApprove = (params, options) => this.http
            .post(`${this.serviceUrl}/approve`, params, options)
            .then(resp => resp.data);
        this.skillReject = (params, options) => this.http
            .post(`${this.serviceUrl}/reject`, params, options)
            .then(resp => resp.data);
        this.getCalls = (id, options) => this.http
            .get(`${this.serviceUrl}/calls`, { params: { userId: id } })
            .then(resp => resp.data);
        this.missedCall = (params, options) => this.http
            .post(`${this.serviceUrl}/calls`, params, options)
            .then(resp => resp.data);
    }
}
exports.PerformerSkillsService = PerformerSkillsService;
exports.default = new PerformerSkillsService();
//# sourceMappingURL=index.js.map