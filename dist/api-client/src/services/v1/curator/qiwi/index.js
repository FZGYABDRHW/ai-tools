"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiwiWallet = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class QiwiWallet extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/qiwi`;
        this.getBalance = (options) => this.http
            .get(`${this.url}/balance`, options)
            .then(resp => resp.data);
    }
}
exports.QiwiWallet = QiwiWallet;
exports.default = new QiwiWallet();
//# sourceMappingURL=index.js.map