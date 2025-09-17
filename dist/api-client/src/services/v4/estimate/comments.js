"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class CommentsService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/estimate`;
        this.getComments = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/comment`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.postComment = (taskId, params, options) => this.http
            .post(`${this.url}/${taskId}/comment`, params, options)
            .then(resp => resp.data.response);
        this.deleteComment = (taskId, params, options) => this.http
            .delete(`${this.url}/${taskId}/comment`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.CommentsService = CommentsService;
exports.default = new CommentsService();
//# sourceMappingURL=comments.js.map