"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTask = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class OrganizationTask extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/task`;
    }
    async getRequirements(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/additional/requirement`, options);
        return response;
    }
    async getTaskInfo(taskId, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${taskId}/rate/info`, options);
        return response;
    }
    async confirmRatingTask(taskId, params, options) {
        const { data: { messages }, } = await this.http.post(`${this.url}/${taskId}/confirm`, params, options);
        return messages;
    }
    async updateRating(taskId, params, options) {
        const { data: { messages }, } = await this.http.put(`${this.url}/${taskId}/rating`, { params }, options);
        return messages;
    }
    async getPrice(params, options) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/organisation/price`, {
            params,
            ...options,
        });
        return response;
    }
    getConfirmationAct(taskId, options) {
        return this.http
            .get(`${this.url}/${taskId}/confirmation-act`, options)
            .then(response => response.data.response);
    }
}
exports.OrganizationTask = OrganizationTask;
exports.default = new OrganizationTask();
//# sourceMappingURL=index.js.map