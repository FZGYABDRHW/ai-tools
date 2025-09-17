"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTaskInfo = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class OrganizationTaskInfo extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/task`;
    }
    async getTabs(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/tabs`, options);
        return response;
    }
    async getRejectedTasks(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/rejected`, options);
        return response;
    }
    async getOnModerationTasks(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/on-moderation`, options);
        return response;
    }
    async getInWorkTasks(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/in-work`, options);
        return response;
    }
    async getDoneTasks(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/done`, options);
        return response;
    }
    async getCanceledTasks(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/canceled`, options);
        return response;
    }
    async getAwaitingApproveTasks(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/awaiting-approve`, options);
        return response;
    }
    async getOraganizationTasks(id, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${id}`, options);
        return response;
    }
    async getNewTasks(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/new`, options);
        return response;
    }
}
exports.OrganizationTaskInfo = OrganizationTaskInfo;
exports.default = new OrganizationTaskInfo();
//# sourceMappingURL=index.js.map