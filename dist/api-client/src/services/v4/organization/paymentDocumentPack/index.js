"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDocumentPackService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class PaymentDocumentPackService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization`;
        this.create = async (organizationId, walletId, sum, destination, options) => await this.http
            .post(`${this.url}/${organizationId}/payment-document-pack`, {
            walletId,
            sum,
            destination,
        })
            .then(resp => resp.data.response);
    }
}
exports.PaymentDocumentPackService = PaymentDocumentPackService;
exports.default = new PaymentDocumentPackService();
//# sourceMappingURL=index.js.map