"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoCoder = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class GeoCoder extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/geo-coder`;
        this.getPolygonInfo = (id, options) => this.http
            .get(`${this.baseUrl}/map-polygon/${id}`, options)
            .then(resp => resp.data.response);
        this.getPolygonCoordinates = (id, options) => this.http
            .get(`${this.baseUrl}/map-polygon/${id}/coordinates`, options)
            .then(resp => resp.data.response);
        this.getSuggestedAdresses = (params, options) => this.http
            .get(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.GeoCoder = GeoCoder;
//# sourceMappingURL=index.js.map