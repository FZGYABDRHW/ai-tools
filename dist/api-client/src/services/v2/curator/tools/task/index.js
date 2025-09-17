"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeCuratorForTask = void 0;
const BaseServiceV2_1 = __importDefault(require("../../../BaseServiceV2"));
class ChangeCuratorForTask extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/tools/task`;
    }
    async changeTaskInfo(taskId, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${taskId}/edit/change-curator-task-info`, options);
        return response;
    }
    async getCuratorsList(taskId, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${taskId}/edit/curators/list`, options);
        return response;
    }
    async getHuntersList(taskId, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${taskId}/edit/hunters/list`, options);
        return response;
    }
    async changeCurator(taskId, curatorId, options) {
        const { data: { response }, } = await this.http.put(`${this.url}/${taskId}/edit/curator`, { curatorId }, options);
        return response;
    }
    async changeHunter(taskId, hunterId, options) {
        const { data: { response }, } = await this.http.put(`${this.url}/${taskId}/edit/hunter`, { hunterId }, options);
        return response;
    }
    async changeCuratorsList(limit = 20, offset = 0, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/edit/log/change-curator`, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }
    async changeSuborganization(taskId, suborganizationId, departmentId, options) {
        const { data: { response }, } = await this.http.put(`${this.url}/${taskId}/edit/suborganization`, {
            suborganizationId,
            departmentId,
        }, options);
        return response;
    }
}
exports.ChangeCuratorForTask = ChangeCuratorForTask;
exports.default = new ChangeCuratorForTask();
//# sourceMappingURL=index.js.map