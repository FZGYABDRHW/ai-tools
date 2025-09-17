"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorTools = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class CuratorTools extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/tools`;
        this.sendCode = (phone, options) => this.http
            .post(`${this.url}/sms/send-code`, { phone }, options)
            .then(resp => resp.data.response);
        this.getShopInfo = (shopId, options) => this.http
            .get(`${this.url}/shop/${shopId}`, { ...options })
            .then(resp => resp.data.response);
        this.getShopTasksHistory = (shopId, limit = 20, offset = 0, options) => this.http
            .get(`${this.url}/shop/${shopId}/history`, {
            params: { limit, offset },
            ...options,
        })
            .then(resp => resp.data.response);
        this.getShopList = (params, options) => this.http
            .get(`${this.url}/shop/list`, { params, ...options })
            .then(resp => resp.data.response);
        this.updateClientPosition = async (params, options) => this.http
            .post(`${this.url}/execution-address/address-point`, params)
            .then(resp => resp.data.response);
        this.getCommentsList = async (params, options) => this.http
            .get(`${this.url}/comment/list`, { params, ...options })
            .then(resp => resp.data.response);
        this.getCuratorList = async (options) => this.http
            .get(`${this.url}/user/curators-list`, options)
            .then(resp => resp.data.response);
    }
}
exports.CuratorTools = CuratorTools;
exports.default = new CuratorTools();
//# sourceMappingURL=index.js.map