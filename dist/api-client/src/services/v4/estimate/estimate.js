"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class EstimateService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/estimate`;
        this.getEstimate = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}`, { params, ...options })
            .then(resp => resp.data.response);
        this.editEstimate = (taskId, params, options) => this.http
            .patch(`${this.url}/${taskId}/setEta`, params, options)
            .then(resp => resp.data.response);
        this.editEstimateTime = (taskId, params, options) => this.http
            .patch(`${this.url}/${taskId}/eta`, params, options)
            .then(resp => resp.data.response);
        this.getEstimateVersions = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/versions`, options)
            .then(resp => resp.data.response);
        this.getEstimateLogs = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/logs`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getVersionCopy = (taskId, versionId, options) => this.http
            .get(`${this.url}/${taskId}/version/${versionId}`, options)
            .then(resp => resp.data.response);
        this.sendEstimateToModeration = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/moderate`, {}, options)
            .then(resp => resp.data.response);
        this.rejectEstimate = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/reject`, {}, options)
            .then(resp => resp.data.response);
        this.approveEstimate = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/approve`, {}, options)
            .then(resp => resp.data.response);
        this.returnEstimateToWork = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/return-to-work`, {}, options)
            .then(resp => resp.data.response);
        this.getWorkPrices = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/work/price/tree`, options)
            .then(resp => resp.data.response);
        this.getExpendablePrice = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/expendable/price`, options)
            .then(resp => resp.data.response);
        this.getWorkPrice = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/work/price`, options)
            .then(resp => resp.data.response);
        this.calculateEta = (data, options) => this.http
            .post(`${this.url}/calculate-eta`, data, options)
            .then(resp => resp.data.response);
        this.getEtaDetails = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/eta-details`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.EstimateService = EstimateService;
exports.default = new EstimateService();
//# sourceMappingURL=estimate.js.map