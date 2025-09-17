"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class PersonalService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/personal`;
    }
    async setUserInfo(userInfo, options) {
        const { data: { messages }, } = await this.http.post(this.url, userInfo, options);
        return messages;
    }
    async getUserInfo(options) {
        const { data: { response }, } = await this.http.get(this.url, options);
        return response;
    }
}
exports.PersonalService = PersonalService;
exports.default = new PersonalService();
//# sourceMappingURL=personal.js.map