"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseServiceV2_1 = __importDefault(require("../../../BaseServiceV2"));
class ShopInfoForCurators extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/tools/shop`;
        this.getShopList = (params, options) => this.http
            .get(`${this.url}/list`, { params, ...options })
            .then(resp => resp.data.response);
    }
    async getShopInfo(shopId, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${shopId}`, options);
        return response;
    }
    async getShopTasksHistory(shopId, limit = 20, offset = 0, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/${shopId}/history`, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }
}
exports.default = ShopInfoForCurators;
//# sourceMappingURL=index.js.map