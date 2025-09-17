"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const BaseServiceV2_1 = __importDefault(require("../../../BaseServiceV2"));
class Organization extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/tools/organization`;
    }
    async getOrganizationsList(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/list`, {
            params: { limit: -1 },
            ...options,
        });
        return response;
    }
}
exports.Organization = Organization;
exports.default = new Organization();
//# sourceMappingURL=index.js.map