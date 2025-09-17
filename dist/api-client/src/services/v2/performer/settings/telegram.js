"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class TelegramService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/notifications/telegram`;
    }
    async getTelegram(options) {
        const { data: { response }, } = await this.http.get(this.url, options);
        return response;
    }
    async deleteTelegram(options) {
        const { data: { response }, } = await this.http.delete(this.url, options);
        return response;
    }
}
exports.default = TelegramService;
exports.TelegramService = TelegramService;
//# sourceMappingURL=telegram.js.map