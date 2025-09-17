"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorRatingService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class CuratorRatingService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.serviceUrl = `${this.baseUrl}/curator/performer`;
        this.sendReport = (params, options) => this.http
            .post(`${this.serviceUrl}/report`, params, options)
            .then(resp => resp.data);
        this.getRating = (performerId, options) => this.http
            .get(`${this.serviceUrl}/${performerId}/rating`, options)
            .then(resp => resp.data.response);
        this.getRatingHistory = (performerId, offset = 0, limit = 20, options) => this.http
            .get(`${this.serviceUrl}/${performerId}/rating/history`, {
            params: {
                offset: offset,
                limit: limit,
            },
            ...options,
        })
            .then(resp => resp.data.response);
        this.deleteComplaint = (id, options) => this.http
            .delete(`${this.serviceUrl}/rating/history/${id}`, options)
            .then(resp => resp.data);
    }
}
exports.CuratorRatingService = CuratorRatingService;
exports.default = new CuratorRatingService();
//# sourceMappingURL=index.js.map