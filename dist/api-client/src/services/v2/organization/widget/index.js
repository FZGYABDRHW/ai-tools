"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationWidget = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class OrganizationWidget extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/widget`;
        this.getOrganizationBalance = async (options) => await this.http
            .get(`${this.url}/balance`, options)
            .then(resp => resp.data.response);
        this.getFirstPickerDate = (options) => this.http
            .get(`${this.url}/first-picker-date`, options)
            .then(resp => resp.data.response);
    }
}
exports.OrganizationWidget = OrganizationWidget;
exports.default = new OrganizationWidget();
//# sourceMappingURL=index.js.map