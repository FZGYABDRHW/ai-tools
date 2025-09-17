"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformersPasses = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class PerformersPasses extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/performer`;
    }
    async getListWithoutPasses(offset = 0, limit = 10, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/pass/list/without`, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }
    async getListWithPasses(offset = 0, limit = 10, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/pass/list/with`, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }
    async addPass(performerID, options) {
        const { data: { response }, } = await this.http.post(`${this.url}/${performerID}/pass`, {}, options);
        return response;
    }
    async deletePass(performerID, options) {
        const { data: { response }, } = await this.http.delete(`${this.url}/${performerID}/pass`, options);
        return response;
    }
}
exports.PerformersPasses = PerformersPasses;
exports.default = new PerformersPasses();
//# sourceMappingURL=index.js.map