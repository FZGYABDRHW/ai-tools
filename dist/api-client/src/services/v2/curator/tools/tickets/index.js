"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestedSupports = void 0;
const BaseServiceV2_1 = __importDefault(require("../../../BaseServiceV2"));
class RequestedSupports extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/tools/ticket`;
        this.getCategoryList = async (options) => await this.http
            .get(`${this.url}/category`, options)
            .then(resp => resp.data.response);
        this.getGroupsList = async (options) => await this.http
            .get(`${this.url}/user/group`, options)
            .then(resp => resp.data.response);
        this.addCategoryToTicket = async (requestId, categoryId, options) => this.http
            .put(`${this.url}/${requestId}/category/${categoryId}`, {}, options)
            .then(resp => resp.data.response);
    }
    async addMessage(requestId, params, options) {
        const { data: { response }, } = await this.http.post(`${this.url}/${requestId}/message`, params, options);
        return response;
    }
    async changeCurator(requestId, params, options) {
        const { data: { response }, } = await this.http.put(`${this.url}/${requestId}/curator`, params, options);
        return response;
    }
    async changeStatus(requestId, params, options) {
        const { data: { response }, } = await this.http.put(`${this.url}/${requestId}/status`, params, options);
        return response;
    }
    async deleteMessage(messageId, options) {
        const { data: { response }, } = await this.http.delete(`${this.url}/message/${messageId}`, options);
        return response;
    }
    async closeTicket(requestId, options) {
        const { data: { response }, } = await this.http.put(`${this.url}/${requestId}/finish`, {}, options);
        return response;
    }
    async getTickets(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/list`, {
            params,
            ...options,
        });
        return response;
    }
    async messagesList(requestId, params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${requestId}/messages`, {
            params,
            ...options,
        });
        return response;
    }
    async statsTickets(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/stats`, options);
        return response;
    }
    async viewTicket(requestId, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${requestId}`, options);
        return response;
    }
    async statusList(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/statuses-list`, options);
        return response;
    }
    async curatorsList(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/curators-list`, options);
        return response;
    }
    async performersList(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/performers-list`, options);
        return response;
    }
}
exports.RequestedSupports = RequestedSupports;
exports.default = new RequestedSupports();
//# sourceMappingURL=index.js.map