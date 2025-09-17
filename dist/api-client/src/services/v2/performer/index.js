"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class PerformerService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this._url = `${this.baseUrl}/performer`;
        this.getRatingRefuseTask = () => this.http
            .get(`${this._url}/rating-changes/task-refused`)
            .then(resp => resp.data.response);
        this.getIeActs = (params, options) => this.http
            .get(`${this._url}/ie-acts/get-list`, { params, ...options })
            .then(resp => resp.data.response);
        this.downloadAct = (params, options) => this.http
            .get(`${this._url}/ie-acts/download`, {
            params,
            responseType: 'blob',
            ...options,
        })
            .then(resp => resp.data);
    }
}
exports.PerformerService = PerformerService;
exports.default = new PerformerService();
//# sourceMappingURL=index.js.map