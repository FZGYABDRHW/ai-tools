"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HunterTeamsStatisticsService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class HunterTeamsStatisticsService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/hunter-stats`;
        this.getHunterTeamsStatistics = (year, month, team, options) => this.http
            .get(`${this.url}/teams/${year}/${month}/${team}`, options)
            .then(response => response.data.response);
        this.getHunterStatsCleaning = (year, month, options) => this.http
            .get(`${this.url}/cleaning/${year}/${month}`)
            .then(response => response.data.response);
        this.getHunterCleaningBonus = (year, month, hunterId, options) => this.http
            .get(`${this.url}/cleaning/detailed-bonus/${year}/${month}/${hunterId}`)
            .then(response => response.data.response);
    }
}
exports.HunterTeamsStatisticsService = HunterTeamsStatisticsService;
//# sourceMappingURL=index.js.map