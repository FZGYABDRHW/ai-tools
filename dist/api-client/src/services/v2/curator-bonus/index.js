"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorBonusService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class CuratorBonusService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator-bonus`;
        this.getCurators = (params, options) => this.http
            .get(`${this.url}/curator-stats`, { params, ...options })
            .then(response => response.data.response);
        this.getTeams = (params, options) => this.http
            .get(`${this.url}/team-stats`, { params, ...options })
            .then(response => response.data.response);
        this.getTaskStatsList = (curatorId, params, options) => this.http
            .get(`${this.url}/task-list/${curatorId}`, {
            params,
            ...options,
        })
            .then(response => response.data.response);
    }
}
exports.CuratorBonusService = CuratorBonusService;
//# sourceMappingURL=index.js.map