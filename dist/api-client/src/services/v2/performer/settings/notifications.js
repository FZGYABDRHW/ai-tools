"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class NotificationsService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/notifications`;
    }
    async setNotification(params, options) {
        const { data: { messages }, } = await this.http.post(this.url, params, options);
        return messages;
    }
    async getNotification(options) {
        const { data: { response }, } = await this.http.get(this.url, options);
        return response;
    }
}
exports.NotificationsService = NotificationsService;
exports.default = new NotificationsService();
//# sourceMappingURL=notifications.js.map