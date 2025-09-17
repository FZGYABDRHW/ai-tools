"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerQuestionnaireService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class PerformerQuestionnaireService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/shop`;
        this.getPerformerQuestionnaire = (shopId, options) => this.http
            .get(`${this.url}/${shopId}/questionnaire`, options)
            .then(resp => resp.data);
    }
}
exports.PerformerQuestionnaireService = PerformerQuestionnaireService;
exports.default = new PerformerQuestionnaireService();
//# sourceMappingURL=index.js.map