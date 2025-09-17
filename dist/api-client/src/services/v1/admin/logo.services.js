"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class LogoService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/admin`;
        this.deleteOrganizationLogo = (organizationId, options) => this.http
            .delete(`${this.url}/organisation/${organizationId}/logo`, options)
            .then(resp => resp.data);
        this.getOrganizationLogo = (organizationId, options) => this.http
            .get(`${this.url}/organisation/${organizationId}/logo`, options)
            .then(resp => resp.data);
    }
    async getOrganizationList(offset = 0, limit = 10, options) {
        const url = `${this.baseUrl}/admin/organisation/logo/list`;
        const { data: { response }, } = await this.http.get(url, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }
}
exports.LogoService = LogoService;
exports.default = new LogoService();
//# sourceMappingURL=logo.services.js.map