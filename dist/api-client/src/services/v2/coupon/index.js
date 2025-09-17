"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class CouponService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/coupon`;
        this.activateService = (data, options) => this.http
            .post(`${this.url}/activate`, data, options)
            .then(response => response.data.response);
    }
}
exports.CouponService = CouponService;
//# sourceMappingURL=index.js.map