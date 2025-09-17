"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class PassportService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/passport`;
    }
    async getUserPassportInfo(options) {
        const { data: { response }, } = await this.http.get(this.url, options);
        return response;
    }
    async setUserPassportInfo(params, options) {
        await this.http.post(this.url, params, options);
    }
}
exports.PassportService = PassportService;
exports.default = new PassportService();
//# sourceMappingURL=passport.js.map