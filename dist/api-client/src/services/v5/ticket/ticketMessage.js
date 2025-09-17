"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMessageService = void 0;
const BaseServiceV5_1 = __importDefault(require("../BaseServiceV5"));
class TicketMessageService extends BaseServiceV5_1.default {
    constructor() {
        super(...arguments);
        this._url = `${this.baseUrl}/ticket`;
        this.getTicketMessages = (ticketId, params, options) => this.http
            .get(`${this._url}/${ticketId}/message`, {
            params,
            ...options,
        })
            .then(({ data }) => data);
        this.getTicketMessageFiles = (ticketId, messageId, params, options) => this.http
            .get(`${this._url}/${ticketId}/message/${messageId}/file`, {
            params,
            ...options,
        })
            .then(({ data }) => data);
        this.addTicketMessage = (ticketId, params, options) => this.http
            .post(`${this._url}/${ticketId}/message/add`, params, options)
            .then(({ data }) => data);
        this.deleteTicketMessage = (ticketId, messageId, options) => this.http
            .delete(`${this._url}/${ticketId}/message/${messageId}/delete`)
            .then(({ data }) => data);
    }
}
exports.TicketMessageService = TicketMessageService;
exports.default = new TicketMessageService();
//# sourceMappingURL=ticketMessage.js.map