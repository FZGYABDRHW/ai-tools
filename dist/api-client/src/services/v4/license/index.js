"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class LicenseService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}`;
        this.get = (id) => this.http
            .get(`${this.url}/license/${id}`)
            .then(resp => resp.data.response);
        this.getList = (params) => this.http
            .get(`${this.url}/license/list`, { params })
            .then(resp => resp.data.response);
        this.getFiles = (id) => this.http
            .get(`${this.url}/license/${id}/files`)
            .then(resp => resp.data.response);
        this.createAndPinToTask = (taskId, params) => this.http
            .post(`${this.url}/task/${taskId}/construction-work/license`, params)
            .then(resp => resp.data.response);
        this.remove = (id) => this.http.delete(`${this.url}/${id}`).then(resp => resp.data.response);
        this.removeAndUnpinFromTask = (taskId, licenseId) => this.http
            .delete(`${this.url}/task/${taskId}/construction-work/license/${licenseId}`)
            .then(resp => resp.data.response);
        this.enableConstructionWork = (taskId) => this.http
            .patch(`${this.url}/task/${taskId}/construction-work/enable`)
            .then(resp => resp.data.response);
        this.disableConstructionWork = (taskId) => this.http
            .patch(`${this.url}/task/${taskId}/construction-work/disable`)
            .then(resp => resp.data.response);
    }
}
exports.LicenseService = LicenseService;
//# sourceMappingURL=index.js.map