"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class PerformerService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/performer`;
    }
    async getPerformerInfo(performerID, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${performerID}`, options);
        return response;
    }
    async getPerformerTools(performerID, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${performerID}/tools`, options);
        return response;
    }
    async getPerformerSkills(performerID, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${performerID}/skills`, options);
        return response;
    }
    async getPerformerRegions(performerID, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${performerID}/regions`, options);
        return response;
    }
    async getPerformerPassport(performerID, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${performerID}/passport`, options);
        return response;
    }
    async getStatusFavorite(performerID, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${performerID}/favorite`, options);
        return response;
    }
    async setStatusFavorite(performerID, options) {
        const { data: { response }, } = await this.http.post(`${this.url}/${performerID}/favorite`, {}, options);
        return response;
    }
    async deleteStatusFavorite(performerID, options) {
        const { data: { response }, } = await this.http.delete(`${this.url}/${performerID}/favorite`, options);
        return response;
    }
}
exports.PerformerService = PerformerService;
exports.default = new PerformerService();
//# sourceMappingURL=index.js.map