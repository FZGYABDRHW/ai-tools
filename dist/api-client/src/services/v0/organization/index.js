"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const BaseServiceV0_1 = __importDefault(require("../BaseServiceV0"));
class OrganizationService extends BaseServiceV0_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization`;
        this.getTaskInfo = async (id, options) => await this.http
            .get(`${this.url}/task`, { ...options, params: { id } })
            .then(response => response.data);
        this.refuseContractor = async (taskId, options) => await this.http
            .put(`${this.url}/task/refuse`, { id: taskId }, options)
            .then(response => response.data);
    }
}
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=index.js.map