"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuitablePerformers = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class SuitablePerformers extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/task`;
    }
    async getSuitablePerformersActive(task, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${task}/suitable-performers/active`, options);
        return response;
    }
    async getSuitablePerformersModeration(task, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${task}/suitable-performers/on-moderation`, options);
        return response;
    }
    async getSuitablePerformersPassport(task, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${task}/suitable-performers/without-passport`, options);
        return response;
    }
    async getSuitablePerformersNotActive(task, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${task}/suitable-performers/inactive`, options);
        return response;
    }
    async getSuitablePerformersNotActiveWithoutPass(task, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${task}/suitable-performers/inactive/without-passport`, options);
        return response;
    }
}
exports.SuitablePerformers = SuitablePerformers;
exports.default = new SuitablePerformers();
//# sourceMappingURL=index.js.map