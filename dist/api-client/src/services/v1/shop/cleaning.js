"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleaningShopService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class CleaningShopService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/shop`;
        this.getShopInfo = (key, options) => this.http
            .get(`${this.url}/task/cleaning/${key}/info`, options)
            .then(response => response.data.response);
        this.updateCalendar = (key, params, options) => this.http
            .post(`${this.url}/cleaning/task/${key}/act`, params, options)
            .then(response => response.data.response);
        this.getCalendar = (key, params, options) => this.http
            .get(`${this.url}/cleaning/task/${key}/calendar`, {
            params,
            ...options,
        })
            .then(response => response.data.response);
        this.getActComment = (key, options) => this.http
            .get(`${this.url}/cleaning/task/${key}/act-comment`, {
            ...options,
        })
            .then(response => response.data.response);
        this.getActFiles = (key, options) => this.http
            .get(`${this.url}/cleaning/task/${key}/act-file-list`, {
            ...options,
        })
            .then(response => response.data.response);
    }
}
exports.CleaningShopService = CleaningShopService;
//# sourceMappingURL=cleaning.js.map