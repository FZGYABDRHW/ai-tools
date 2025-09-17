"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksListService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class TasksListService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator`;
        this.getOrganisationUserTaskList = (query, options) => this.http
            .get(`${this.url}/organisation/user-task-list`, {
            params: query,
            ...options,
        })
            .then(resp => resp.data);
        this.getCuratorTaskList = (query, options) => this.http
            .get(`${this.url}/task-list/list`, options)
            .then(resp => resp.data);
        this.getHelp = (id, options) => this.http
            .get(`${this.url}/task/task/appropriate`, {
            params: { id: id },
            ...options,
        })
            .then(resp => resp.data);
    }
    async getNotification(id, options) {
        const url = `${this.baseUrl}/curator/task/task/notifications`;
        const { data: { response }, } = await this.http.get(url, {
            params: { id: id },
            ...options,
        });
        return response;
    }
}
exports.TasksListService = TasksListService;
exports.default = new TasksListService();
//# sourceMappingURL=tasks-list.services.js.map