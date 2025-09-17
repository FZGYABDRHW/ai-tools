"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class PerformerService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer`;
        this.getTaskRatingReport = (taskId, options) => this.http
            .get(`${this.url}/task/${taskId}/report`, options)
            .then(response => response.data.response);
    }
}
exports.PerformerService = PerformerService;
//# sourceMappingURL=index.js.map