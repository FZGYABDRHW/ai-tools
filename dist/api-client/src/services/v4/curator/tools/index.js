"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorToolsService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class CuratorToolsService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}`;
        this.getExecutionAddressInfo = (id, options) => this.http
            .get(`${this.url}/execution-address/${id}`, {
            ...options,
        })
            .then(response => response.data.response);
    }
}
exports.CuratorToolsService = CuratorToolsService;
//# sourceMappingURL=index.js.map