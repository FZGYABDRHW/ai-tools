"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRateService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class TaskRateService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/shop/task`;
    }
    async shopLogin(params, options) {
        const { data } = await this.http.post(`${this.baseUrl}/common/shop/login`, { ...params }, options);
        return data.response;
    }
    async getTaskInfo(key, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${key}/rate/info`, options);
        return response;
    }
    async setTaskAsNotDone(key, comment, options) {
        const { data } = await this.http.post(`${this.url}/${key}/rate/not-done`, { comment }, options);
        return data;
    }
    async setTaskRate(key, politeness, quality, options) {
        const { data } = await this.http.post(`${this.url}/${key}/rate`, { politeness, quality }, options);
        return data;
    }
}
exports.TaskRateService = TaskRateService;
exports.default = new TaskRateService();
//# sourceMappingURL=task-rate.js.map