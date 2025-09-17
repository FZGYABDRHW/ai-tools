"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerToolsService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class PerformerToolsService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/performer/tool`;
        this.getToolsList = (userId, options) => this.http
            .get(this.url, { params: { userId: userId }, ...options })
            .then(resp => resp.data);
        this.addPerformerTool = (params, options) => this.http.post(this.url, params, options).then(resp => resp.data);
        this.deletePerformerTool = (userId, toolId, options) => this.http
            .delete(this.url, { params: { userId: userId, toolId: toolId }, ...options })
            .then(resp => resp.data);
    }
}
exports.PerformerToolsService = PerformerToolsService;
exports.default = new PerformerToolsService();
//# sourceMappingURL=index.js.map