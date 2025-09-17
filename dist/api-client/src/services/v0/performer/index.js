"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerService = void 0;
const BaseServiceV0_1 = __importDefault(require("../BaseServiceV0"));
class PerformerService extends BaseServiceV0_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer`;
        this.getTaskInfo = async (id, options) => await this.http
            .get(`${this.url}/task`, { ...options, params: { id } })
            .then(response => response.data);
    }
}
exports.PerformerService = PerformerService;
//# sourceMappingURL=index.js.map