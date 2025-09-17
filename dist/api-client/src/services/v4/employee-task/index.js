"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeTaskService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class EmployeeTaskService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/employee-task`;
        this.getFullList = (params, options) => this.http
            .get(this.url, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getActiveList = (params, options) => this.http
            .get(`${this.url}/active`, { params, ...options })
            .then(serviceData => serviceData.data.response);
        this.getDeferredList = (params, options) => this.http
            .get(`${this.url}/deferred`, { params, ...options })
            .then(serviceData => serviceData.data.response);
        this.getCurrent = (options) => this.http
            .get(`${this.url}/current`, options)
            .then(serviceData => serviceData.data.response);
        this.getEmployeeTask = (taskId, options) => this.http
            .get(`${this.url}/${taskId}`, options)
            .then(resp => resp.data.response);
        this.sendAction = (id, data, options) => {
            return this.http
                .put(`${this.url}/${id}`, data, options)
                .then(serviceData => serviceData.data.messages);
        };
        this.getStatistic = (params, options) => this.http
            .get(`${this.url}/statistic`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.EmployeeTaskService = EmployeeTaskService;
exports.default = new EmployeeTaskService();
//# sourceMappingURL=index.js.map