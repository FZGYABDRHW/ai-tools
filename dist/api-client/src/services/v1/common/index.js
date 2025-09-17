"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = exports.source = void 0;
const axios_1 = __importDefault(require("axios"));
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
exports.source = axios_1.default.CancelToken.source();
class CommonService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common`;
        this.getFile = (id, size, options) => this.http
            .get(`${this.url}/file/view`, {
            params: {
                id,
                size,
                responseType: 'blob',
            },
            ...options,
        })
            .then(resp => (window.URL ? URL : window.webkitURL).createObjectURL(resp.data));
        this.uploadFile = (file, type, model, shopId, options) => {
            const data = new FormData();
            data.append('file', file);
            data.append('type', type.toString());
            data.append('model', model ? model.toString() : null);
            return this.http
                .post(`${this.url}/file/upload`, data, {
                ...options,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                cancelToken: exports.source.token,
            })
                .then(resp => resp.data.response);
        };
        this.deleteFile = (params, options) => this.http
            .post(`${this.url}/file/delete`, {
            ...params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.renameFile = (id, name, options) => this.http
            .put(`${this.url}/file/rename`, {
            id,
            name,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getVirtualPhoneNumber = ({ entityName, entityId }) => this.http
            .get(`${this.url}/virtual-contact-info/${entityName}/${entityId}`)
            .then(resp => resp.data.response);
        this.getCommentTermsList = (taskId) => this.http
            .get(`${this.url}/task/${taskId}/comment-terms`)
            .then(resp => resp.data.response);
    }
}
exports.CommonService = CommonService;
exports.default = new CommonService();
//# sourceMappingURL=index.js.map