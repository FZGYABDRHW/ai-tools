"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionaryService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class DictionaryService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/dictionary`;
        this.getList = (key) => this.http
            .get(`${this.url}/${key}`)
            .then(resp => resp.data.response);
    }
}
exports.DictionaryService = DictionaryService;
exports.default = new DictionaryService();
//# sourceMappingURL=index.js.map