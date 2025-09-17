"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonUserService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class CommonUserService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/user`;
        this.get = async (params, options) => await this.http
            .get(this.url, {
            params,
            headers: {
                'Cache-control': 'no-cache',
            },
            ...options,
        })
            .then(resp => resp.data);
        this.getPermission = async (options) => await this.http
            .get(`${this.url}/permissions`)
            .then(resp => resp.data.response);
        this.changeLanguage = (language, options) => this.http
            .post(`${this.url}/change-language`, { language, ...options })
            .then(resp => resp.data.response);
        this.changeUserPassport = (oldPassword, newPassword, options) => this.http
            .post(`${this.url}/change-password`, {
            old: oldPassword,
            new: newPassword,
        }, options)
            .then(resp => resp.data);
    }
}
exports.CommonUserService = CommonUserService;
exports.default = new CommonUserService();
//# sourceMappingURL=index.js.map