"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class ManagerService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/manager`;
    }
    async getApprovalTasks(options) {
        const { data: { response: { models }, }, } = await this.http.get(`${this.url}/task/approval`, options);
        return models;
    }
    async getApprovedTasks(options) {
        const { data: { response: { models }, }, } = await this.http.get(`${this.url}/task/approved`, options);
        return models;
    }
    async getAwaitingDeliveryTasks(options) {
        const { data: { response: { models }, }, } = await this.http.get(`${this.url}/task/awaiting-delivery`, options);
        return models;
    }
    async getDeliveredTasks(options) {
        const { data: { response: { models }, }, } = await this.http.get(`${this.url}/task/delivered`, options);
        return models;
    }
    async getNewTasks(options) {
        const { data: { response: { models }, }, } = await this.http.get(`${this.url}/task/new`, options);
        return models;
    }
    async getNewTasksCount(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/task/count-new`, options);
        return response;
    }
    async getDeliveredTasksCount(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/task/count-delivered`, options);
        return response;
    }
    async getAwaitingDeliveryTasksCount(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/task/count-awaiting-delivery`, options);
        return response;
    }
    async getApprovedTasksCount(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/task/count-approved`, options);
        return response;
    }
    async getApprovalTasksCount(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/task/count-approval`, options);
        return response;
    }
}
exports.ManagerService = ManagerService;
exports.default = new ManagerService();
//# sourceMappingURL=index.js.map