"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSettingsService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class OrganizationSettingsService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/settings`;
        this.getOrganizationSettings = async (options) => await this.http
            .get(`${this.url}/show`, options)
            .then(resp => resp.data.response);
        this.updateSettings = async (params, options) => await this.http
            .put(`${this.url}/update`, params, options)
            .then(resp => resp.data.response);
    }
}
exports.OrganizationSettingsService = OrganizationSettingsService;
exports.default = new OrganizationSettingsService();
//# sourceMappingURL=index.js.map