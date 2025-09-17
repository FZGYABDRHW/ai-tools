"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.B2CTaskService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class B2CTaskService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/b2c/task`;
        this.signIn = (taskId, params) => this.http
            .post(`${this.url}/${taskId}/sign-in/invitation`, params)
            .then(r => r.data.response);
        this.signUp = (taskId, params) => this.http
            .post(`${this.url}/${taskId}/sign-up/invitation`, params)
            .then(r => r.data.response);
    }
}
exports.B2CTaskService = B2CTaskService;
exports.default = new B2CTaskService();
//# sourceMappingURL=index.js.map