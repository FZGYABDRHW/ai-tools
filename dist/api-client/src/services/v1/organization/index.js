"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class OrganizationService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization`;
        this.getEmploeeProfile = async (options) => await this.http
            .get(`${this.url}/employee/profile`, options)
            .then(resp => resp.data.response);
        this.updateEmployeeProfile = async (params, options) => await this.http
            .post(`${this.url}/employee/profile/update`, params, options)
            .then(resp => resp.data.messages);
        this.getDepartmentsList = async (options) => await this.http
            .get(`${this.url}/department`, options)
            .then(resp => resp.data.response);
        this.getOrganizationBranch = (options) => this.http
            .get(`${this.url}/branch`, options)
            .then(({ data: { response } }) => response);
        this.getSuborganizationList = (params, options) => this.http
            .get(`${this.url}/suborganization`, {
            params,
            ...options,
        })
            .then(({ data: { response } }) => response);
    }
}
exports.default = OrganizationService;
//# sourceMappingURL=index.js.map