"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEntity = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class TaskEntity extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/task`;
        this.getTaskDepartments = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/department/available`, options)
            .then(resp => resp.data);
        this.getTaskSuborganizations = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/suborganization/available`, options)
            .then(resp => resp.data);
        this.getPerformerTaskPrice = (params, options) => this.http
            .get(`${this.url}/price`, { params, ...options })
            .then(resp => resp.data);
        this.changeTaskTitle = (params, options) => this.http
            .put(`${this.url}/task/name`, { ...params }, options)
            .then(resp => resp.data.response);
        this.changeTaskDescription = (params, options) => this.http
            .put(`${this.url}/task/description`, { ...params }, options)
            .then(resp => resp.data.response);
        this.toggleNight = (taskId, options) => this.http
            .put(`${this.url}/${taskId}/edit/night`, {}, options)
            .then(resp => resp.data.response);
        this.toggleUrgent = (taskId, options) => this.http
            .put(`${this.url}/${taskId}/edit/urgent`, {}, options)
            .then(resp => resp.data.response);
        this.toggleAltitude = (taskId) => this.http
            .put(`${this.url}/${taskId}/edit/altitude-work`, {})
            .then(resp => resp.data.response);
    }
}
exports.TaskEntity = TaskEntity;
exports.default = new TaskEntity();
//# sourceMappingURL=index.js.map