"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class AuthService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/user`;
        this.login = (credentials) => this.http
            .post(`${this.url}/login`, credentials)
            .then(r => r.data.response);
        this.logout = () => this.http
            .post(`${this.url}/logout`)
            .then(r => r.data)
            .catch(r => r.response?.data || { success: false });
        this.getUserProfile = (userId) => this.http
            .get(`${this.url}/${userId}`)
            .then(r => r.data.response)
            .catch(r => r.response?.data);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.js.map