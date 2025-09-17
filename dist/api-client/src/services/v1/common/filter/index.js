"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterHelpers = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class FilterHelpers extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/filter`;
        this.getSkillsList = (options) => this.http
            .get(`${this.url}/skills`, options)
            .then(resp => resp.data);
        this.searchRegion = (options) => this.http
            .get(`${this.url}/regions`, options)
            .then(resp => resp.data);
        this.searchTools = (options) => this.http
            .get(`${this.url}/tools`, options)
            .then(resp => resp.data.response);
    }
}
exports.FilterHelpers = FilterHelpers;
exports.default = new FilterHelpers();
//# sourceMappingURL=index.js.map