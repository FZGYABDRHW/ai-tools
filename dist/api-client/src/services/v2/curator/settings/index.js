"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorSettings = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class CuratorSettings extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/settings`;
    }
    async getTelegramLink(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/get-telegram-connect-link`, options);
        return response;
    }
    async getTelegramId(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/get-telegram-id`, options);
        return response;
    }
}
exports.CuratorSettings = CuratorSettings;
exports.default = new CuratorSettings();
//# sourceMappingURL=index.js.map