"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HunterService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class HunterService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/hunter`;
        this.getUserStatus = (userId, options) => this.http
            .get(`${this.url}/${userId}/session/profile/status`, options)
            .then(resp => resp.data.response);
        this.getHunterStats = (id, year, month) => this.http
            .get(`${this.url}/${id}/stats/${year}/${month}`)
            .then(resp => resp.data.response);
        this.getHunterTotalStats = (id, year, month) => this.http
            .get(`${this.url}/${id}/stats/total/${year}/${month}`)
            .then(resp => resp.data.response);
        this.getAllHunterStats = (month, year, group) => this.http
            .get(`${this.url}/stats/${year}/${month}/${group}`)
            .then(resp => resp.data.response);
        this.deleteFine = (hunterBonusId) => this.http
            .delete(`${this.url}/stats/fine/${hunterBonusId}`)
            .then(resp => resp.data.response);
        this.getHunterFines = ({ hunterId, type, year, month }) => this.http
            .get(`${this.url}/${hunterId}/stats/fine/${type}/${year}/${month}`)
            .then(resp => resp.data.response);
        this.getHunterBonusView = (hunterBonusId) => this.http
            .get(`${this.url}/stats/bonus/${hunterBonusId}/view`)
            .then(resp => resp.data.response);
        this.getHunterBonusSettings = () => this.http
            .get(`${this.url}/bonus/settings`)
            .then(resp => resp.data.response);
    }
}
exports.HunterService = HunterService;
exports.default = new HunterService();
//# sourceMappingURL=index.js.map