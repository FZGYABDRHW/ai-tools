"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HunterTaskInfo = void 0;
const BaseServiceV2_1 = __importDefault(require("../../../BaseServiceV2"));
class HunterTaskInfo extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/hunter/task`;
        this.getHunterSearchTaskInfo = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/search-info`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.HunterTaskInfo = HunterTaskInfo;
exports.default = new HunterTaskInfo();
//# sourceMappingURL=index.js.map