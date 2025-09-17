"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class FileService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/file`;
        this.upload = (params, options) => this.http
            .post(`${this.url}/alerts-user/list`, params, options)
            .then(resp => resp.data.response);
        this.deleteFile = (params, options) => this.http
            .post(`${this.url}/delete`, params, options)
            .then(resp => resp.data.response);
        this.renameFile = (params, options) => this.http
            .put(`${this.url}/rename`, params, options)
            .then(resp => resp.data.response);
        this.fileView = async (params, options) => await this.http
            .get(`${this.url}/view`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getFileList = (userId, type, options) => this.http
            .get(this.url, { ...options, params: { userId, type } })
            .then(response => response.data.response);
    }
}
exports.FileService = FileService;
exports.default = new FileService();
//# sourceMappingURL=index.js.map