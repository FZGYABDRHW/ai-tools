"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DutyService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class DutyService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = (idUser) => `${this.baseUrl}/user/${idUser}/duty`;
        this.getUserStatusDuty = (idUser, options) => this.http
            .get(`${this.url(idUser)}`, options)
            .then(resp => resp.data.response);
        this.starDuty = (idUser, options) => this.http
            .post(`${this.url(idUser)}`, {}, options)
            .then(resp => resp.data);
        this.stopDuty = (idUser, options) => this.http.delete(`${this.url(idUser)}`, options).then(resp => resp.data);
    }
}
exports.DutyService = DutyService;
exports.default = new DutyService();
//# sourceMappingURL=index.js.map