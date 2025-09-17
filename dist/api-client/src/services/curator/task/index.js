"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorTaskService = void 0;
const BaseServiceCurator_1 = __importDefault(require("../BaseServiceCurator"));
class CuratorTaskService extends BaseServiceCurator_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/task`;
        this.getTaskInfo = async (id, options) => await this.http
            .get(`${this.url}`, { params: { id }, ...options })
            .then(response => response.data);
        this.sendAnnotation = async (data, options) => this.http
            .post(`${this.url}/task/annotation`, data, options)
            .then(resp => resp.data.response);
    }
}
exports.CuratorTaskService = CuratorTaskService;
//# sourceMappingURL=index.js.map