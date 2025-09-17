"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTaskService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class UserTaskService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/user-task`;
        this.getCurrentUserTask = (relatedEntity, relatedEntityId, options) => this.http
            .get(`${this.url}/current?relatedEntity=${relatedEntity}&relatedEntityId=${relatedEntityId}`, options)
            .then(response => response.data.response);
    }
}
exports.UserTaskService = UserTaskService;
//# sourceMappingURL=index.js.map