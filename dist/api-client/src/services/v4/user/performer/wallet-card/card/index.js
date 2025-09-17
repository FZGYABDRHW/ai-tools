"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerCardService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../../../BaseServiceV4"));
class PerformerCardService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = (performerId) => `${this.baseUrl}/user/${performerId}/performer/wallet`;
        this.getPerformerCards = (performerId, options) => this.http
            .get(`${this.baseUrl}/user/${performerId}/performer/card`, options)
            .then(resp => resp.data.response);
        this.addCard = (performerId, params, options) => this.http
            .post(`${this.url(performerId)}/card/add`, params)
            .then(resp => resp.data.response);
        this.deleteCard = (performerId, cardId, options) => this.http
            .delete(`${this.url(performerId)}/card/delete/${cardId}`, options)
            .then(resp => resp.data.response);
        this.editCard = (performerId, cardId, params, options) => this.http
            .put(`${this.url(performerId)}/card/${cardId}`, params)
            .then(resp => resp.data.response);
    }
}
exports.PerformerCardService = PerformerCardService;
exports.default = new PerformerCardService();
//# sourceMappingURL=index.js.map