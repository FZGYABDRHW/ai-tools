"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsServise = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class AlertsServise extends BaseServiceV1_1.default {
    async getList() {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/common/alerts-user/list`);
        return response;
    }
    async shows(id) {
        const { data: { response }, } = await this.http.post(`${this.baseUrl}/common/alerts-user/show`, {
            id: id,
        });
    }
    async closed(id) {
        const { data: { response }, } = await this.http.post(`${this.baseUrl}/common/alerts-user/close`, {
            id: id,
        });
    }
    async submit(id) {
        const { data: { response }, } = await this.http.post(`${this.baseUrl}/common/alerts-user/click`, {
            id: id,
        });
    }
}
exports.AlertsServise = AlertsServise;
exports.default = new AlertsServise();
//# sourceMappingURL=alerts.js.map