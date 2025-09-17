"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerRatingService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class PerformerRatingService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer-rating`;
        this.getRatingHistory = (type, options) => this.http
            .get(`${this.url}/history/${type}`, options)
            .then(resp => resp.data.response);
        this.getRatingStatus = (options) => this.http
            .get(`${this.url}/status`, options)
            .then(resp => resp.data.response);
    }
}
exports.PerformerRatingService = PerformerRatingService;
//# sourceMappingURL=index.js.map