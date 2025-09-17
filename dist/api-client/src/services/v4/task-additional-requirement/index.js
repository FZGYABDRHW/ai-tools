"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAdditionalRequirement = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class TaskAdditionalRequirement extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.get = (params, options) => this.http
            .get(`${this.baseUrl}/task-additional-requirement`, options)
            .then(resp => resp.data.response);
    }
}
exports.TaskAdditionalRequirement = TaskAdditionalRequirement;
//# sourceMappingURL=index.js.map