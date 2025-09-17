"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeviceService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class UserDeviceService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/device`;
        this.getUserAppInfo = (user_id, options) => this.http
            .get(`${this.url}/user-app-info`, options)
            .then(resp => resp.data);
    }
}
exports.UserDeviceService = UserDeviceService;
exports.default = new UserDeviceService();
//# sourceMappingURL=index.js.map