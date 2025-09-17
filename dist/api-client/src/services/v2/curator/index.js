"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class CuratorService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator`;
        this.getNearbyCleaningContractors = async (shopId, options) => await this.http
            .get(`${this.url}/tools/nearby-cleaning-contractors/${shopId}`, options)
            .then(resp => resp.data.response);
        this.getUserStatus = async (userId, options) => await this.http
            .get(`${this.url}/${userId}/session/profile/status`, options)
            .then(resp => resp.data.response);
        this.getUserSession = async (params, options) => await this.http
            .get(`${this.url}/session`, { params, ...options })
            .then(resp => resp.data.response);
        this.restoreUser = async (performerId, options) => await this.http
            .put(`${this.url}/user/restore-user/${performerId}`, {}, options)
            .then(resp => resp.data.response);
        this.setTaskLimit = async (performerId, taskLimit, options) => await this.http
            .put(`${this.url}/user/set-task-limit/${performerId}/${taskLimit}`, options)
            .then(resp => resp.data.response);
        this.dropTaskLimit = async (performerId, options) => await this.http
            .put(`${this.url}/user/set-task-limit/${performerId}`, options)
            .then(resp => resp.data.response);
    }
}
exports.CuratorService = CuratorService;
exports.default = new CuratorService();
//# sourceMappingURL=index.js.map