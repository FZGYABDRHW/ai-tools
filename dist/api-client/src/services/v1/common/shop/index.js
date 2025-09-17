"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopInfoService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class ShopInfoService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/shop`;
        this.getShopInfo = (params, options) => this.http
            .get(`${this.url}/info`, { params, ...options })
            .then(resp => resp.data.response);
        this.getShopBranches = (params, options) => this.http
            .get(`${this.url}/branch`, { params, ...options })
            .then(resp => resp.data.response);
        this.createSetting = (options) => this.http
            .get(`${this.url}/create-settings`, options)
            .then(resp => resp.data.response);
        this.getSuborganization = (params, options) => this.http
            .get(`${this.url}/suborganization`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.updateShopInfo = (shopInfo, options) => this.http
            .post(`${this.url}/update`, shopInfo, options)
            .then(resp => resp.data);
        this.shopLogin = (params, options) => this.http
            .post(`${this.url}/login`, params, options)
            .then(resp => resp.data.response);
    }
}
exports.ShopInfoService = ShopInfoService;
exports.default = new ShopInfoService();
//# sourceMappingURL=index.js.map