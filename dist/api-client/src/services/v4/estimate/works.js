"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorksService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class WorksService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/estimate`;
        this.get = (taskId, params, options) => this.http
            .get(`${this.url}/work/${taskId}`, { params, ...options })
            .then(resp => resp.data.response);
        this.getWorks = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/work`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getWorksTotalPrice = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/work/price`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getRejectedWorks = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/work/rejected`, options)
            .then(resp => resp.data.response);
        this.addWork = (taskId, params, options) => this.http
            .post(`${this.url}/${taskId}/work`, params, options)
            .then(resp => resp.data.response);
        this.updateWork = (workId, params, options) => this.http
            .put(`${this.url}/work/${workId}`, params, options)
            .then(resp => resp.data.response);
        this.changeWorkType = (workId, params, options) => this.http
            .patch(`${this.url}/work/${workId}/change-type`, params, options)
            .then(resp => resp.data.response);
        this.getAdditionalWorks = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/additionalWorks`, options)
            .then(resp => resp.data.response);
    }
}
exports.WorksService = WorksService;
exports.default = new WorksService();
//# sourceMappingURL=works.js.map