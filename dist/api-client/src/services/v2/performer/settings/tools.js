"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerToolsService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class PerformerToolsService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/tool`;
        this.getTools = (options) => this.http
            .get(this.url, options)
            .then(({ data: { response } }) => response);
        this.removeTool = (toolId, options) => this.http
            .delete(this.url, { params: { toolId }, ...options })
            .then(({ data: { response } }) => response);
        this.requestTool = (toolId, options) => this.http
            .post(this.url, { toolId }, options)
            .then(({ data: { response } }) => response);
    }
}
exports.PerformerToolsService = PerformerToolsService;
exports.default = new PerformerToolsService();
//# sourceMappingURL=tools.js.map