"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegalEntityService = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
class LegalEntityService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/legal-entity`;
        this.getExternalLegalData = (params, options) => this.http
            .get(`${this.url}/external-legal-data`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.LegalEntityService = LegalEntityService;
//# sourceMappingURL=index.js.map