"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityDocumentService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class IdentityDocumentService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/identity-document`;
    }
    submitIdentityDocument(userId, data, options) {
        return this.http
            .post(this.url, data, options)
            .then(response => response.data.response);
    }
    getAvailableCitizenshipList(options) {
        return this.http
            .get(`${this.url}/available-country-list`)
            .then(response => response.data.response);
    }
}
exports.IdentityDocumentService = IdentityDocumentService;
//# sourceMappingURL=index.js.map