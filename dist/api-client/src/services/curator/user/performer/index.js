"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerTransaction = void 0;
const BaseServiceCurator_1 = __importDefault(require("../../BaseServiceCurator"));
class PerformerTransaction extends BaseServiceCurator_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/user/performer`;
        this.getPerformerTransaction = (userId, options) => {
            this.http
                .get(`${this.url}/transactions?userId=${userId}`)
                .then(resp => resp.data);
        };
        this.getPerformerBalance = (userId, options) => {
            this.http.get(`${this.url}/balance?userId=${userId}`).then(resp => resp.data);
        };
        this.getPerformerPassport = (params, options) => {
            this.http.get(`${this.url}/passport`, { params }).then(resp => resp.data);
        };
        this.getPerformerRegion = (params, options) => this.http
            .get(`${this.url}/regions`, { params })
            .then(resp => resp.data.response);
        this.getTaskList = (params, options) => {
            this.http.get(`${this.url}/task-list`, { params }).then(resp => resp.data);
        };
        this.getTaskListDone = (params, options) => {
            this.http.get(`${this.url}/task-list-done`, { params }).then(resp => resp.data);
        };
        this.getProfileHistory = (params, options) => {
            this.http.get(`${this.url}/profile-history`, { params }).then(resp => resp.data);
        };
        this.getSkillsHistory = (params, options) => {
            this.http
                .get(`${this.url}/skills-history`, { params })
                .then(resp => resp.data);
        };
        this.getIndividualEntrepreneur = (params, options) => this.http.get(`${this.url}/individual-entrepreneur`, { params });
        this.approveIEData = (params, options) => {
            this.http
                .put(`${this.url}/approve-individual-entrepreneur-data`, params)
                .then(resp => resp.data);
        };
        this.refuseIE = (params, options) => {
            this.http
                .post(`${this.url}/refuse-individual-entrepreneur-data`, params)
                .then(resp => resp.data.response);
        };
    }
}
exports.PerformerTransaction = PerformerTransaction;
exports.default = new PerformerTransaction();
//# sourceMappingURL=index.js.map