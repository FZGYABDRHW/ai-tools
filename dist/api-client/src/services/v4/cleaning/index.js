"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleaningService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class CleaningService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/cleaning`;
        this.registerPerformer = (params, options) => this.http
            .post(`${this.url}/performer`, params, options)
            .then(resp => resp.data.response);
    }
}
exports.CleaningService = CleaningService;
exports.default = new CleaningService();
//# sourceMappingURL=index.js.map