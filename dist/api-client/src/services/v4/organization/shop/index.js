"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationShopService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class OrganizationShopService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/shop`;
        this.get = (id, options) => this.http
            .get(`${this.url}/${id}`, options)
            .then(resp => resp.data.response);
        this.getList = (ids, options) => this.http
            .get(`${this.url}`, {
            params: { ids: ids.join(',') },
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.OrganizationShopService = OrganizationShopService;
exports.default = new OrganizationShopService();
//# sourceMappingURL=index.js.map