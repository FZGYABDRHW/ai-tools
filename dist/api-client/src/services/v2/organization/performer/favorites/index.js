"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerFavorites = void 0;
const BaseServiceV2_1 = __importDefault(require("../../../BaseServiceV2"));
class PerformerFavorites extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/performer/favorites`;
        this.getFavorites = async (limit, offset, options) => await this.http
            .get(this.url, { params: { limit, offset }, ...options })
            .then(resp => resp.data.response);
    }
}
exports.PerformerFavorites = PerformerFavorites;
exports.default = new PerformerFavorites();
//# sourceMappingURL=index.js.map