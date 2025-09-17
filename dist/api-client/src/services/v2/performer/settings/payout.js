"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerPayout = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class PerformerPayout extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/payout`;
        this.getPerformerPayoutConfig = (options) => this.http
            .get(`${this.url}/config`, options)
            .then(resp => resp.data.response);
    }
}
exports.PerformerPayout = PerformerPayout;
exports.default = new PerformerPayout();
//# sourceMappingURL=payout.js.map