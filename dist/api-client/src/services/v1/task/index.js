"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class TaskService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.getList = (params, options) => this.http
            .get(`${this.baseUrl}/organisation/task-list`, {
            params,
            ...options,
        })
            .then(r => r.data.response);
    }
}
exports.TaskService = TaskService;
exports.default = new TaskService();
//# sourceMappingURL=index.js.map