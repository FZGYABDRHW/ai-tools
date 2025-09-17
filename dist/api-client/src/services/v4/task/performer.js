"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPerformersService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class TaskPerformersService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/task`;
        this.getInactivePerformers = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/performer/suitable/inactive`, { params, ...options })
            .then(resp => resp.data.response);
        this.getInactivePassportOnModerationPerformers = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/performer/suitable/inactive/passport-on-moderation`, { params, ...options })
            .then(resp => resp.data.response);
        this.getInactiveSpecOnModerationPerformers = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/performer/suitable/inactive/specializations-on-moderation`, { params, ...options })
            .then(resp => resp.data.response);
        this.getInactiveWithoutPassportPerformers = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/performer/suitable/inactive/without-passport`, { params, ...options })
            .then(resp => resp.data.response);
        this.getInactiveWithoutSpecPerformers = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/performer/suitable/inactive/without-specializations`, { params, ...options })
            .then(resp => resp.data.response);
        this.getPerformerInfoAboutTask = (taskId, performerId, options) => this.http
            .get(`${this.url}/${taskId}/performer/${performerId}`, options)
            .then(resp => resp.data.response);
        this.getPerformerAvailableTaskList = (performerId, params, options) => this.http
            .get(`${this.url}/performer/${performerId}/available`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.assignPerformerToTask = (taskId, performerId, data, options) => this.http
            .patch(`${this.url}/${taskId}/performer/${performerId}/assign`, data, options)
            .then(resp => resp.data);
    }
}
exports.TaskPerformersService = TaskPerformersService;
exports.default = new TaskPerformersService();
//# sourceMappingURL=performer.js.map