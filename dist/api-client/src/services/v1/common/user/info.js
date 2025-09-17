"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class UserInfo extends BaseServiceV1_1.default {
    async getRole(options) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/common/user/role`, options);
        return response;
    }
    async getUserRole(userId, options) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/common/user/${userId}/role/primary`, options);
        return response;
    }
    async getProfile(options) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/common/user`, options);
        return response;
    }
    async getContacts(options) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/user-contacts/contacts`, options);
        return response;
    }
    async getSupportPhone(params) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/common/support-phone`, { params });
        return response;
    }
    async getVirtualPhoneNumber(userId) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/common/user-contacts/${userId}/virtual-contact-info`);
        return response;
    }
}
exports.UserInfo = UserInfo;
exports.default = new UserInfo();
//# sourceMappingURL=info.js.map