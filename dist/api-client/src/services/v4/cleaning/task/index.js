"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleaningTaskService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class CleaningTaskService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/cleaning/task`;
        this.getPerformerTaskList = (params, options) => this.http
            .get(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.CleaningTaskService = CleaningTaskService;
//# sourceMappingURL=index.js.map