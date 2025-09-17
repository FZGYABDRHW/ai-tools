"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class UserService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/user`;
        this.postPhoneConfirm = (params, options) => this.http
            .post(`${this.url}/phone-confirm`, params, options)
            .then(resp => resp.data);
        this.postAdditionalPhoneConfirm = (params, options) => this.http
            .post(`${this.url}/additional-phone-confirm`, params, options)
            .then(resp => resp.data);
        this.changePhone = (params, options) => this.http
            .put(`${this.url}/phone`, params, options)
            .then(resp => resp.data.response);
    }
}
exports.UserService = UserService;
exports.default = new UserService();
//# sourceMappingURL=index.js.map