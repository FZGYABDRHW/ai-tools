"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetabaseService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class MetabaseService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/metabase`;
        this.getDashboard = async (id) => await this.http
            .get(`${this.url}/dashboard/${id}`)
            .then(resp => resp.data.response);
        this.getCard = async (id, parameters) => await this.http
            .post(`${this.url}/card/${id}`, parameters)
            .then(resp => resp.data.response);
    }
}
exports.MetabaseService = MetabaseService;
exports.default = new MetabaseService();
//# sourceMappingURL=index.js.map