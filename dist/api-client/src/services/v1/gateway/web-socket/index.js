"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketGateway = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class WebSocketGateway extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.getRoomKey = (options) => this.http
            .get(`${this.baseUrl}/gateway/web-socket/room`, options)
            .then(resp => resp.data);
    }
}
exports.WebSocketGateway = WebSocketGateway;
exports.default = new WebSocketGateway();
//# sourceMappingURL=index.js.map