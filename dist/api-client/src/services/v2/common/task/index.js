"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class TaskService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/task`;
        this.getReceiptsList = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/expendable-receipt`, options)
            .then(resp => resp.data);
        this.getReceipt = (taskId, receiptId, options) => this.http
            .get(`${this.url}/${taskId}/expendable-receipt/${receiptId}`, options)
            .then(resp => resp.data);
        this.sendReceipt = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/expendable-receipt`, options)
            .then(resp => resp.data);
    }
}
exports.TaskService = TaskService;
exports.default = new TaskService();
//# sourceMappingURL=index.js.map