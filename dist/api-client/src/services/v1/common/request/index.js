"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRegionService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class CommonRegionService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/request`;
        this.getRequest = (id, options) => this.http
            .get(`${this.url}/${id}`, options)
            .then(resp => resp.data.response);
        this.getUserRequest = (options) => this.http
            .get(`${this.url}/all`, options)
            .then(resp => resp.data.response);
        this.postRequestRate = (params, options) => this.http
            .post(`${this.url}/rate`, params, options)
            .then(resp => resp.data.response);
        this.postNewRequest = (params, options) => this.http
            .post(`${this.url}/new`, params, options)
            .then(resp => resp.data.response);
        this.closeRequest = (params, options) => this.http
            .post(`${this.url}/close`, params, options)
            .then(resp => resp.data.response);
        this.addNewMessage = (params, options) => this.http
            .post(`${this.url}/message`, params, options)
            .then(resp => resp.data.response);
    }
}
exports.CommonRegionService = CommonRegionService;
exports.default = new CommonRegionService();
//# sourceMappingURL=index.js.map