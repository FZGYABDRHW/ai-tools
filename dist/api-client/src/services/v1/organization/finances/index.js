"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class OrganizationFinances extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/finances`;
        this.getTaskWalletHistory = async (params, options) => await this.http
            .get(`${this.url}/wallet/history`, { params, ...options })
            .then(resp => resp.data.response);
        this.getTaskOperations = async (taskId, relatedEntityName, options) => await this.http
            .get(`${this.url}/wallet/history/task/${taskId}/operations`, {
            params: { relatedEntityName },
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.default = OrganizationFinances;
//# sourceMappingURL=index.js.map