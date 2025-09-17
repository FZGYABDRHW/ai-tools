"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class TaskService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this._url = `${this.baseUrl}/task`;
        this.getExpendableReceipt = (taskId, options) => this.http
            .get(`${this._url}/${taskId}/expendable-receipt`, options)
            .then(resp => resp.data.response);
        this.deleteQr = (taskId, receiptId, params, options) => this.http
            .delete(`${this._url}/${taskId}/expendable-receipt/${receiptId}`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.TaskService = TaskService;
exports.default = new TaskService();
//# sourceMappingURL=index.js.map