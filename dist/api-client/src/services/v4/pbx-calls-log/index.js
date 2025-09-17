"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PbxCallsLogService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class PbxCallsLogService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/pbx-calls-log`;
        this.getInfo = (id) => this.http
            .get(`${this.url}/${id}`)
            .then(resp => resp.data.response);
    }
}
exports.PbxCallsLogService = PbxCallsLogService;
exports.default = new PbxCallsLogService();
//# sourceMappingURL=index.js.map