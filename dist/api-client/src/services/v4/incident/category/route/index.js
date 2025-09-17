"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../../BaseServiceV4"));
class RouteService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/incident/category/route`;
        this.createEquipmentRoute = (params, options) => this.http
            .put(`${this.url}/equipment`, params, {
            ...options,
        })
            .then(resp => resp.data.response);
        this.getEquipmentRoute = (equipmentId, options) => this.http
            .get(`${this.url}/equipment/${equipmentId}`, options)
            .then(resp => resp.data.response);
        this.createShopRoute = (params, options) => this.http
            .post(`${this.url}/shop`, params, {
            ...options,
        })
            .then(resp => resp.data.response);
        this.remove = (params, options) => this.http
            .delete(`${this.url}/${params.routeId}/shop/${params.shopId}`, options)
            .then(resp => resp.data.response);
    }
}
exports.RouteService = RouteService;
//# sourceMappingURL=index.js.map