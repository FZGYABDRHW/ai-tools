"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActionService = void 0;
const BaseServiceV0_1 = __importDefault(require("../../BaseServiceV0"));
class UserActionService extends BaseServiceV0_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/user/user-action`;
        this.performerBlock = (params) => this.http.post(`${this.url}/block`, params).then(res => res.data);
        this.performerUnblock = (params) => this.http.post(`${this.url}/unblock`, params).then(res => res.data);
    }
}
exports.UserActionService = UserActionService;
//# sourceMappingURL=user-action.js.map