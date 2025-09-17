"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleaningShopTaskService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../../BaseServiceV4"));
class CleaningShopTaskService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/cleaning/shop/task`;
        this.setReportInfo = (key, options) => this.http
            .post(`${this.url}/${key}/report`, options)
            .then(resp => resp.data.response);
        this.getTaskInfo = (key, options) => this.http
            .get(`${this.url}/${key}/info`, options)
            .then(resp => resp.data.response);
    }
}
exports.CleaningShopTaskService = CleaningShopTaskService;
//# sourceMappingURL=index.js.map