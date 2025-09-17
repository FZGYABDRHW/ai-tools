"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpendablesService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class ExpendablesService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/estimate`;
        this.getExpendableInfoById = (expendablesId, options) => this.http
            .get(`${this.url}/expendable/${expendablesId}`, options)
            .then(resp => resp.data.response);
        this.getExpendables = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/expendable`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getExpendablesTotalPrice = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/expendable/price`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getRejectedExpendables = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/expendable/rejected`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.addExpendable = (taskId, params, options) => this.http
            .post(`${this.url}/${taskId}/expendable`, params, options)
            .then(resp => resp.data.response);
        this.updateExpendable = (expendableId, params, options) => this.http
            .put(`${this.url}/expendable/${expendableId}`, params, options)
            .then(resp => resp.data.response);
        this.changeExpendablesType = (expendableId, params, options) => this.http
            .patch(`${this.url}/expendable/${expendableId}/change-type`, params, options)
            .then(resp => resp.data.response);
        this.toggleCashless = (expendableId, options) => this.http
            .patch(`${this.url}/expendable/${expendableId}/cashless`, {}, options)
            .then(resp => resp.data.response);
    }
}
exports.ExpendablesService = ExpendablesService;
exports.default = new ExpendablesService();
//# sourceMappingURL=expendable.js.map