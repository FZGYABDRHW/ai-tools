"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorOrganizations = void 0;
const BaseServiceV2_1 = __importDefault(require("../../../BaseServiceV2"));
class CuratorOrganizations extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/tools/curator-organization`;
    }
    async getCuratorOrganization(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/list`, {
            params,
            ...options,
        });
        return response;
    }
    async getActiveCurators(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/get-active-curators`, options);
        return response;
    }
    async getList(options) {
        const { data: { response }, } = await this.http.get(`${this.baseUrl}/curator/active`, options);
        return response;
    }
}
exports.CuratorOrganizations = CuratorOrganizations;
exports.default = new CuratorOrganizations();
//# sourceMappingURL=index.js.map