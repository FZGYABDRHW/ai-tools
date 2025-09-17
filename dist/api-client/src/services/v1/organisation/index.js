"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganisationService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
class OrganisationService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organisation`;
        this.getOrganizationPrice = (params, options) => this.http
            .get(`${this.url}/price`, { params, ...options })
            .then(({ data: { response } }) => response);
        this.getTaskListCounts = (params, options) => this.http
            .get(`${this.url}/task-list/info`, {
            params,
            ...options,
        })
            .then(({ data: { response } }) => response);
        this.getTaskList = (params, options) => this.http
            .get(`${this.url}/task-list`, { params, ...options })
            .then(({ data: { response } }) => response);
        this.getOrganizationUsersList = (options) => this.http
            .get(`${this.url}/employees`, options)
            .then(({ data: { response } }) => response);
    }
}
exports.OrganisationService = OrganisationService;
exports.default = new OrganisationService();
//# sourceMappingURL=index.js.map