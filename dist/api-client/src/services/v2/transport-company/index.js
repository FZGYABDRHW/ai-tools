"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportCompany = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class TransportCompany extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this._url = `${this.baseUrl}/transport-company`;
        this.getTransportCompaniesListForTracker = (options) => this.http
            .get(`${this._url}/tracker/list-transport-companies`)
            .then(resp => resp.data.response);
        this.getTrackerInfo = (params, options) => this.http
            .get(`${this._url}/tracker/tracking-status`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.TransportCompany = TransportCompany;
//# sourceMappingURL=index.js.map