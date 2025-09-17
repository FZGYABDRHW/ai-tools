"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingTaskService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class LandingTaskService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.get = (options) => this.http
            .get(`${this.baseUrl}/landing/task`, options)
            .then(r => r.data);
    }
}
exports.LandingTaskService = LandingTaskService;
exports.default = new LandingTaskService();
//# sourceMappingURL=task.js.map