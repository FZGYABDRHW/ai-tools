"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerFavorite = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class PerformerFavorite extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/performer`;
        this.deletePerformer = (performerId, options) => this.http
            .delete(`${this.url}/${performerId}/favorite`, options)
            .then(resp => resp.data.response);
    }
}
exports.PerformerFavorite = PerformerFavorite;
exports.default = new PerformerFavorite();
//# sourceMappingURL=index.js.map