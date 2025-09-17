"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskActionsService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class TaskActionsService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/task`;
        this.sendTaskToPayment = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/send-payment`, {}, options)
            .then(({ data: response }) => response);
        this.rejectTask = (taskId, params, options) => this.http
            .post(`${this.url}/${taskId}/reject`, params, options)
            .then(({ data: response }) => response);
        this.publishTask = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/publish`, {}, options)
            .then(({ data: response }) => response);
        this.returnTask = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/return`, {}, options)
            .then(({ data: response }) => response);
        this.cancelTask = (taskId, params, options) => this.http
            .post(`${this.url}/${taskId}/cancel`, params, options)
            .then(({ data: response }) => response);
        this.completeTask = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/complete`, {}, options)
            .then(({ data: response }) => response);
        this.confirmTask = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/confirm`, {}, options)
            .then(({ data: response }) => response);
        this.takeTask = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/take`, {}, options)
            .then(({ data: response }) => response);
    }
}
exports.TaskActionsService = TaskActionsService;
exports.default = new TaskActionsService();
//# sourceMappingURL=taskActions.js.map