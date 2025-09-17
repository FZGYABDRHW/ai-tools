"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportCompany = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class TransportCompany extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this._url = `${this.baseUrl}/transport-company`;
        this.createTracking = (data, options) => this.http
            .post(`${this._url}/tracking`, data, options)
            .then(resp => resp.data.response);
        this.updateTracking = (id, data, options) => this.http
            .put(`${this._url}/tracking/${id}`, data, options)
            .then(resp => resp.data.response);
        this.getTrackingInfo = (params, options) => this.http
            .get(`${this._url}/tracking`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.TransportCompany = TransportCompany;
//# sourceMappingURL=index.js.map