"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorRating = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class CuratorRating extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/rating`;
        this.getCuratorBonuses = (params, options) => this.http
            .get(`${this.url}/bonus`, { params, ...options })
            .then(resp => resp.data);
        this.getuserInfo = (params, options) => this.http
            .get(`${this.url}/settings/user-info`, { params, ...options })
            .then(resp => resp.data);
    }
}
exports.CuratorRating = CuratorRating;
exports.default = new CuratorRating();
//# sourceMappingURL=index.js.map