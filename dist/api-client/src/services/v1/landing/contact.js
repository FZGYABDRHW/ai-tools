"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class ContactService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.post = (data, options) => this.http
            .post(`${this.baseUrl}/landing/contact/company`, data, options)
            .then(r => r.data);
    }
}
exports.ContactService = ContactService;
exports.default = new ContactService();
//# sourceMappingURL=contact.js.map