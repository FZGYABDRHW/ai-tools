"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const BaseServiceV0_1 = __importDefault(require("../../BaseServiceV0"));
class RatingService extends BaseServiceV0_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/rating`;
        this.getTeamsList = async () => await this.http.get(`${this.url}/stats/teams-info`).then(resp => resp.data);
        this.getYears = async () => await this.http
            .get(`${this.url}/stats/available-years`)
            .then(resp => resp.data);
        this.setReceipt = async (params) => await this.http
            .put(`${this.url}/settings/receive-task`, params)
            .then(resp => resp.data);
        this.setReceiveTaskAsHunter = async (params) => await this.http
            .put(`${this.url}/settings/receive-task-as-hunter`, params)
            .then(resp => resp.data);
        this.getUserInfo = async (params) => await this.http
            .get(`${this.url}/settings/user-info`, { params })
            .then(resp => resp.data);
        this.getCuratorDashboard = async (params) => await this.http
            .get(`${this.url}/dashboard/curator`, { params })
            .then(resp => resp.data);
        this.getHunterDashboard = async (params) => await this.http
            .get(`${this.url}/dashboard/hunter`, { params })
            .then(resp => resp.data);
        this.getTeamMembersDashboard = async (params) => await this.http
            .get(`${this.url}/dashboard/team-members-data`, { params })
            .then(resp => resp.data);
        this.getTeamHeadDashboard = async (params) => await this.http
            .get(`${this.url}/stats/team-heads`, { params })
            .then(resp => resp.data);
        this.getCuratorsRoles = async () => await this.http
            .get(`${this.url}/stats/curator-roles`)
            .then(resp => resp.data);
    }
}
exports.RatingService = RatingService;
//# sourceMappingURL=index.js.map