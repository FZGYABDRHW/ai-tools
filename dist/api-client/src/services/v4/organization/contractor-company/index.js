"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorCompanyService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class ContractorCompanyService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization`;
        this.invite = async (params) => {
            const { organizationId, email } = params;
            return await this.http
                .post(`${this.url}/${organizationId}/contractor-company/invitation`, {
                email,
            })
                .then(resp => resp.data.response);
        };
        this.getInvitedList = (organizationId, params, options) => this.http
            .get(`${this.url}/${organizationId}/contractor-company/invitations`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getRegisteredList = (organizationId, params) => this.http
            .get(`${this.url}/${organizationId}/contractor-companies`, {
            params,
        })
            .then(resp => resp.data.response);
        this.deleteInvitation = (id, options) => this.http
            .delete(`${this.url}/contractor-company/invitation/${id}`, options)
            .then(resp => resp.data.response);
    }
}
exports.ContractorCompanyService = ContractorCompanyService;
exports.default = new ContractorCompanyService();
//# sourceMappingURL=index.js.map