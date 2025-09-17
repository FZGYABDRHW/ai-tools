"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class Session extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/session`;
    }
    status(options) {
        return this.http
            .get(this.url, options)
            .then(res => res.data);
    }
    start(options) {
        return this.http.post(this.url, null, options).then(res => res.data);
    }
    stop(options) {
        return this.http.delete(this.url, options).then(res => res.data);
    }
}
exports.Session = Session;
exports.default = new Session();
//# sourceMappingURL=session.js.map