"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class ValidatorService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.postValidatorPassport = (params, options) => this.http
            .post(`${this.baseUrl}/common/validator/passport`, params, options)
            .then(resp => resp.data);
    }
}
exports.ValidatorService = ValidatorService;
exports.default = new ValidatorService();
//# sourceMappingURL=index.js.map