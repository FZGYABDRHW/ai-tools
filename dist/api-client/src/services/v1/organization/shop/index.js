"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationShopService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class OrganizationShopService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organisation/shop`;
        this.getPerformerQuestionnaire = async (shopId, options) => await this.http
            .get(`${this.baseUrl}/organization/shop/${shopId}/questionnaire`, options)
            .then(resp => resp.data.response);
        this.searchShop = async (params, options) => await this.http
            .get(`${this.url}/search`, { params, ...options })
            .then(resp => resp.data.response);
        this.allShopTasks = async (shopId, options) => await this.http
            .get(`${this.baseUrl}/organization/shop/${shopId}/history`, options)
            .then(resp => resp.data.response);
        this.deleteShop = async (shopId, options) => await this.http
            .delete(`${this.baseUrl}/organization/shop/${shopId}`, options)
            .then(resp => resp.data.response);
        this.createShopSettings = async (options) => await this.http
            .get(`${this.url}/create-settings`, options)
            .then(resp => resp.data.response);
        this.createShop = async (params, options) => await this.http
            .post(`${this.url}/create`, params, options)
            .then(resp => resp.data);
        this.updateShop = async (params, options) => await this.http
            .post(`${this.url}/update`, params, options)
            .then(resp => resp.data.response);
        this.getShopBranch = async (options) => await this.http
            .get(`${this.baseUrl}/organization/branch`, options)
            .then(resp => resp.data.response);
        /// TODO: Убрать метод
        this.createSHop = async (shopInfo, options) => await this.http
            .post(`${this.url}/create`, shopInfo, options)
            .then(resp => resp.data);
        this.getSuborganization = async (options) => await this.http
            .get(`${this.baseUrl}/organization/suborganization`, options)
            .then(resp => resp.data.response);
    }
}
exports.OrganizationShopService = OrganizationShopService;
exports.default = new OrganizationShopService();
//# sourceMappingURL=index.js.map