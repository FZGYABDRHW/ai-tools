"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerSkillsService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class PerformerSkillsService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/skills`;
        this.getSkills = (options) => this.http
            .get(this.url, options)
            .then(({ data: { response, status } }) => ({ response, status }));
        this.remove = (params, options) => this.http
            .delete(this.url, { params, ...options })
            .then(({ data: { response, status } }) => ({ response, status }));
        this.request = (params, options) => this.http
            .post(this.url, params, options)
            .then(({ data: { response, status } }) => ({ response, status }));
    }
}
exports.PerformerSkillsService = PerformerSkillsService;
exports.default = new PerformerSkillsService();
//# sourceMappingURL=skills.js.map