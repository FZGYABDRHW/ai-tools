"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorListService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class CuratorListService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/task`;
        this.getNewTasks = (params, options) => this.http
            .get(`${this.url}/new`, { params, ...options })
            .then(resp => resp.data.response);
        this.getDoneTasks = (params, options) => this.http
            .get(`${this.url}/done`, { params, ...options })
            .then(resp => resp.data.response);
        this.getCanceledTasks = (params, options) => this.http
            .get(`${this.url}/canceled`, { params, ...options })
            .then(resp => resp.data.response);
        this.getInWorkTasks = (params, options) => this.http
            .get(`${this.url}/in-work`, { params, ...options })
            .then(resp => resp.data.response);
        this.getOnModerationTasks = (params, options) => this.http
            .get(`${this.url}/on-moderation`, { params, ...options })
            .then(resp => resp.data.response);
        this.getOnAwaitingApprove = (params, options) => this.http
            .get(`${this.url}/awaiting-approve`, { params, ...options })
            .then(resp => resp.data.response);
        this.getOnPayment = (params, options) => this.http
            .get(`${this.url}/on-payment`, { params, ...options })
            .then(resp => resp.data.response);
        this.getInQueueTasks = (params, options) => this.http
            .get(`${this.url}/in-queue`, { params, ...options })
            .then(resp => resp.data.response);
    }
    async getNewTabs(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/count-new`, {
            params,
            ...options,
        });
        return response;
    }
    async inWorkTabs(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/count-in-work`, {
            params,
            ...options,
        });
        return response;
    }
    async onModerationTabs(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/count-on-moderation`, {
            params,
            ...options,
        });
        return response;
    }
    async awaitingApproveTabs(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/count-awaiting-approve`, {
            params,
            ...options,
        });
        return response;
    }
    async onPayment(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/count-on-payment`, {
            params,
            ...options,
        });
        return response;
    }
    async doneTabs(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/count-done`, {
            params,
            ...options,
        });
        return response;
    }
    async canceledTabs(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/count-canceled`, {
            params,
            ...options,
        });
        return response;
    }
    async inQueueTabs(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/count-in-queue`, {
            params,
            ...options,
        });
        return response;
    }
}
exports.CuratorListService = CuratorListService;
exports.default = new CuratorListService();
//# sourceMappingURL=index.js.map