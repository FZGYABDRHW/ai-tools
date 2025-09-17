"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class SkillService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/skill`;
        this.getList = (params) => this.http
            .get(`${this.url}`, { params })
            .then(resp => resp.data.response);
    }
}
exports.SkillService = SkillService;
exports.default = new SkillService();
//# sourceMappingURL=index.js.map