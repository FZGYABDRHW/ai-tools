"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class OAuthService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/oauth`;
        this.getList = (params, options) => this.http
            .get(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);
        this.createOAuthApplication = (params, options) => this.http
            .post(`${this.url}`, params, options)
            .then(resp => resp.data.response);
        this.deleteOAuthApplication = (clientId, options) => this.http.delete(`${this.url}/${clientId}`, options).then(resp => resp.data.response);
        this.updateOAuthApplication = (clientId, params, options) => this.http
            .patch(`${this.url}/${clientId}`, params, options)
            .then(resp => resp.data.response);
    }
}
exports.OAuthService = OAuthService;
//# sourceMappingURL=index.js.map