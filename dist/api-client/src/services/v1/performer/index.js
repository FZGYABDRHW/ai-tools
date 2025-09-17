"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class PerformerService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer`;
        this.getTasksLimit = (options) => this.http
            .get(`${this.url}/settings/tasks-limit`, options)
            .then(resp => resp.data.response.limit);
        this.getTaskListInfo = (options) => this.http
            .get(`${this.url}/task-list/info`, options)
            .then(({ data: { response } }) => response);
        this.getTaskList = (params, options) => this.http
            .get(`${this.url}/task-list`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getNewTask = (params, options) => this.http
            .get(`${this.url}/task-list/new`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getRating = (options) => this.http
            .get(`${this.url}/rating`, options)
            .then(resp => resp.data.response);
        this.getRatingHistory = (offset = 0, limit = 20, options) => this.http
            .get(`${this.url}/rating/history`, {
            params: {
                offset: offset,
                limit: limit,
            },
            ...options,
        })
            .then(resp => resp.data.response);
        this.getPerformerPopups = (options) => this.http
            .get(`${this.url}/popup/rating`, options)
            .then(resp => resp.data.response);
        this.deletePerformerCard = (params, options) => this.http
            .delete(`${this.url}/wallet/card`, { params, ...options })
            .then(resp => resp.data.response);
        this.getPerformerWalletList = (options) => this.http
            .get(`${this.url}/wallet/list`, options)
            .then(resp => resp.data.response);
        this.getPerformerQuestionnaire = (shopId, options) => this.http
            .get(`${this.url}/${shopId}/questionnaire`, options)
            .then(resp => resp.data.response);
        this.sendPerformerQuestionnaire = (shopId, answers, options) => this.http
            .post(`${this.url}/${shopId}/shop/questionnaire`, { answers }, options)
            .then(resp => resp.data.status);
        this.getPerformerQuestionnaireFormatted = (shopId, options) => this.http
            .get(`${this.url}/${shopId}/shop/questionnaire/formatted`, options)
            .then(resp => resp.data.response);
    }
}
exports.PerformerService = PerformerService;
exports.default = new PerformerService();
//# sourceMappingURL=index.js.map