"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityDocumentService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class IdentityDocumentService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/identity-document`;
    }
    getIdentityDocumentList(userId, options) {
        return this.http
            .get(this.url, { ...options, params: { userId } })
            .then(response => response.data.response);
    }
    getIndentityDocumentValidity(identityDocumentId, options) {
        return this.http
            .get(`${this.url}/validity`, {
            ...options,
            params: { identityDocumentId },
        })
            .then(response => response.data.response);
    }
}
exports.IdentityDocumentService = IdentityDocumentService;
//# sourceMappingURL=index.js.map