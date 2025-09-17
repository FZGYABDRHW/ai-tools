"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class SessionService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/session`;
        this.getSessionFiles = (uuid) => this.http
            .get(`${this.url}/${uuid}/files`)
            .then(r => r.data.response);
    }
}
exports.SessionService = SessionService;
exports.default = new SessionService();
//# sourceMappingURL=index.js.map