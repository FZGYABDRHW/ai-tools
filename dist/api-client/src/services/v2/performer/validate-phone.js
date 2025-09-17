"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePhoneService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class ValidatePhoneService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.urlSend = `${this.baseUrl}/site/send-code`;
        this.urlCheck = `${this.baseUrl}/performer/settings/contacts/phone`;
    }
    async validatePhone(phone, type, options) {
        const params = {
            phone: phone,
            type: type,
        };
        const { data: { response }, } = await this.http.post(this.urlSend, params, options);
        return response;
    }
    async validateCode(code, type, options) {
        const params = {
            code: code,
            type: type,
        };
        const { data: { status }, } = await this.http.post(this.urlCheck, params, options);
        return status;
    }
}
exports.ValidatePhoneService = ValidatePhoneService;
exports.default = new ValidatePhoneService();
//# sourceMappingURL=validate-phone.js.map