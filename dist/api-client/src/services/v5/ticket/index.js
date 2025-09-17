"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const BaseServiceV5_1 = __importDefault(require("../BaseServiceV5"));
class TicketService extends BaseServiceV5_1.default {
    constructor() {
        super(...arguments);
        this._url = `${this.baseUrl}/ticket`;
        this.addTicket = (params, options) => this.http.post(`${this._url}/add`, params, options).then(({ data }) => data);
        this.closeTicket = (ticketId, options) => this.http
            .put(`${this._url}/${ticketId}/close`, {}, options)
            .then(({ data }) => data);
        this.setTask = (ticketId, taskId, options) => this.http
            .put(`${this._url}/${ticketId}/set-task`, { taskId }, options)
            .then(({ data }) => data);
        this.rateTicket = (ticketId, params, options) => this.http
            .put(`${this._url}/${ticketId}/rate`, params, options)
            .then(({ data }) => data);
        this.getTickets = (params, options) => this.http
            .get(`${this._url}`, { params, ...options })
            .then(({ data }) => data);
        this.getTicket = (ticketId, options) => this.http.get(`${this._url}/${ticketId}`, options).then(({ data }) => data);
        this.changeTicketCategory = (ticketId, params, options) => this.http
            .put(`${this._url}/${ticketId}/category/set`, params, options)
            .then(({ data }) => data);
        this.changeTicketCurator = (ticketId, params, options) => this.http
            .put(`${this._url}/${ticketId}/user/curator/set`, params, options)
            .then(({ data }) => data);
        this.getTicketsCategories = (params, options) => this.http
            .get(`${this._url}/category`, options)
            .then(({ data }) => data);
        this.getTicketCuratorsList = (params, options) => this.http
            .get(`${this._url}/user/curator`, { params, ...options })
            .then(({ data }) => data);
        this.getTicketCuratorsForwardingList = (params, options) => this.http
            .get(`${this._url}/user/curator/forwarding`, { params, ...options })
            .then(({ data }) => data);
        this.getTicketPerformersList = (params, options) => this.http
            .get(`${this._url}/user/performer`, { params, ...options })
            .then(({ data }) => data);
        this.getTicketStatuses = (options) => this.http
            .get(`${this._url}/status`, options)
            .then(({ data }) => data);
        this.getAvailableTicketStatuses = (ticketId, options) => this.http
            .get(`${this._url}/${ticketId}/status/next`, options)
            .then(({ data }) => data);
        this.changeTicketStatus = (ticketId, statusId, options) => this.http
            .put(`${this._url}/${ticketId}/status/set`, { statusId }, options)
            .then(({ data }) => data);
        this.getTicketStatistics = (options) => this.http
            .get(`${this._url}/statistics`, options)
            .then(({ data }) => data);
        this.changeFirstLinFieldOfCurator = (curatorId, params, options) => this.http
            .put(`${this._url}/user/curator/${curatorId}/first-line/set`, params, options)
            .then(({ data }) => data);
        this.getTicketCuratorFirstLineList = (params, options) => this.http
            .get(`${this._url}/user/curator/first-line`, { params, ...options })
            .then(({ data }) => data);
        this.getUserGroupList = (options) => this.http
            .get(`${this._url}/user/group`, options)
            .then(({ data }) => data);
    }
}
exports.TicketService = TicketService;
exports.default = new TicketService();
//# sourceMappingURL=index.js.map